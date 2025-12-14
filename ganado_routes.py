from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request, jsonify
import cloudinary.uploader
from models import db, Ganado

def register_ganado_routes(app):

    @app.route("/ganado", methods=["GET"])
    def listar_ganado():
        vendedor_id = request.args.get("vendedor_id", None)

        if vendedor_id:
            ganado = Ganado.query.filter_by(
                vendedor_id=int(vendedor_id),
                is_active=True
            ).all()
        else:
            ganado = Ganado.query.filter_by(is_active=True).all()

        return jsonify([g.serialize() for g in ganado]), 200


    @app.route("/upload-image", methods=["POST"], endpoint="upload_image")
    @jwt_required()
    def upload_image():
        file = request.files.get("file")

        if not file:
            return jsonify({"error": "No file uploaded"}), 400

        try:
            result = cloudinary.uploader.upload(file)
            return jsonify({"url": result["secure_url"]}), 200

        except Exception as e:
            print("Cloudinary error:", e)
            return jsonify({"error": "Upload failed"}), 500


    @app.route("/ganado/<int:id>", methods=["GET"])
    def obtener_ganado(id):
        g = Ganado.query.get(id)
        if not g or not g.is_active:
            return jsonify({"msg": "Ganado no encontrado"}), 404
        
        return jsonify(g.serialize()), 200


    @app.route("/ganado", methods=["POST"])
    @jwt_required()
    def crear_ganado():
        data = request.get_json(silent=True) or {}
        vendedor_id = int(get_jwt_identity())

        imagen = data.get("image") or "https://res.cloudinary.com/demo/image/upload/default_cow.jpg"

        try:
            nuevo = Ganado(
                title=data.get("title"),
                description=data.get("description"),
                price_per_head=int(data.get("price_per_head", 0)),
                breed=data.get("breed"),
                category=data.get("category"),
                age=int(data.get("age", 0)) if data.get("age") else None,
                kg=int(data.get("kg", 0)) if data.get("kg") else None,
                department=data.get("department"),
                city=data.get("city"),
                image=imagen,
                vendedor_id=vendedor_id
            )

            db.session.add(nuevo)
            db.session.commit()

            return jsonify(nuevo.serialize()), 201

        except Exception as e:
            print("ERROR CREAR GANADO:", e)
            return jsonify({"error": str(e)}), 500


    @app.route("/ganado/<int:id>", methods=["PUT"])
    @jwt_required()
    def editar_ganado(id):
        data = request.get_json(silent=True) or {}
        g = Ganado.query.get(id)

        if not g:
            return jsonify({"msg": "Ganado no existe"}), 404

        if g.vendedor_id != int(get_jwt_identity()):
            return jsonify({"msg": "No autorizado"}), 403

        for campo, valor in data.items():
            if hasattr(g, campo):
                setattr(g, campo, valor)

        db.session.commit()
        return jsonify(g.serialize()), 200


    @app.route("/ganado/<int:id>", methods=["DELETE"])
    @jwt_required()
    def eliminar_ganado(id):
        g = Ganado.query.get(id)
        if not g:
            return jsonify({"msg": "Ganado no existe"}), 404

        user_id = int(get_jwt_identity())
        from models import User
        user = User.query.get(user_id)

        if g.vendedor_id != user_id and user.role != "admin":
            return jsonify({"mensaje": "No autorizado"}), 403

        g.is_active = False
        db.session.commit()
        return jsonify({"mensaje": "Ganado eliminado"}), 200


    @app.route("/upload-image", methods=["POST"], endpoint="upload_image_v2")
    @jwt_required()
    def upload_image_v2():
        if "file" not in request.files:
            return jsonify({"msg": "No file provided"}), 400

        file = request.files["file"]

        try:
            upload = cloudinary.uploader.upload(file, folder="ganado")
            url = upload["secure_url"]
            return jsonify({"url": url}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
