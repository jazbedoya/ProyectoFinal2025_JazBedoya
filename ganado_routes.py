from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request, jsonify
import cloudinary.uploader
from models import db, Ganado

def register_ganado_routes(app):  # Registra todas las rutas relacionada con ganado

    @app.route("/ganado", methods=["GET"])
    def listar_ganado():   # Devuelve todos los lotes de ganado o solo los de un vendedor

        vendedor_id = request.args.get("vendedor_id", None)

        if vendedor_id:
            ganado = Ganado.query.filter_by(
                vendedor_id=int(vendedor_id),
                is_active=True
            ).all()
        else:
            ganado = Ganado.query.filter_by(is_active=True).all()

        return jsonify([g.serialize() for g in ganado]), 200
    

    # PRIMER ENDPOINT /upload-image ✔
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
            return jsonify({"msg": "Ganado no encontrado"})
        
        return jsonify(g.serialize()), 200


    @app.route("/ganado", methods=["POST"])
    @jwt_required()
    def crear_ganado():
        data = request.get_json()
        vendedor_id = int(get_jwt_identity())

        imagen = data.get("image")
        if not imagen:
            imagen = "https://res.cloudinary.com/demo/image/upload/default_cow.jpg"

        nuevo = Ganado(
            title=data["title"],
            description=data.get("description"),
            price_per_head=data["price_per_head"],
            breed=data.get("breed"),
            category=data.get("category"),
            age=data.get("age"),
            kg=data.get("kg"),
            department=data.get("department"),
            city=data.get("city"),
            image=imagen,
            vendedor_id=vendedor_id
        )

        db.session.add(nuevo)
        db.session.commit()

        return jsonify(nuevo.serialize()), 201


    @app.route("/ganado/<int:id>", methods=["PUT"])
    @jwt_required()
    def editar_ganado(id):
        
        data = request.get_json()
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


    # SEGUNDO /upload-image (CORREGIDO, AHORA NO CHOCA) ✔
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
