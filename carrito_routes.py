from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, ArticuloDelCarrito, Ganado


def register_carrito_routes(app):

    @app.route("/carrito", methods=["GET"])
    @jwt_required()
    def ver_carrito(): #Devuelve los articulos del carrito del usuario logueado

        user_id = int(get_jwt_identity())
        items = ArticuloDelCarrito.query.filter_by(user_id=user_id).all()

        total = sum(item.subtotal() for item in items)

        return jsonify ({
            "items":[i.serialize () for i in items],
            "total":total
        }), 200
    


    @app.route("/carrito", methods=["POST"])
    @jwt_required()
    def agregar_carrito():  #agrega un lote de ganado al carrito, espera: "gaando_id"=1 , "quantity"=3
       
      
        data = request.get_json()
        user_id = int(get_jwt_identity())
        ganado_id = data["ganado_id"]
        quantity = data.get("quantity", 1)

        ganado = Ganado.query.get(ganado_id)
        if not ganado or not ganado.is_active:
            return jsonify({"msg": "Ganado no existe"}), 404

        item = ArticuloDelCarrito(
            user_id=user_id,
            ganado_id=ganado_id,
            quantity=quantity,
            price_per_head=ganado.price_per_head
        )

        db.session.add(item)
        db.session.commit()

        return jsonify(item.serialize()), 201
    

    @app.route("/carrito/<int:item_id>", methods=["PUT"])
    @jwt_required()
    def actualizar_cantidad(item_id):  # Actualiza la cantidad de un artículo del carrito
        item = ArticuloDelCarrito.query.get(item_id)

        if not item:
            return jsonify({"msg": "No existe"}), 404

        # Verificar que el item pertenece al usuario logueado
        if item.user_id != int(get_jwt_identity()):
            return jsonify({"msg": "No autorizado"}), 403

        data = request.get_json()
        nueva_cantidad = data.get("quantity")

        if nueva_cantidad is None or nueva_cantidad < 1:
            return jsonify({"msg": "Cantidad inválida"}), 400

        item.quantity = nueva_cantidad
        db.session.commit()

        return jsonify(item.serialize()), 200



    @app.route("/carrito/<int:item_id>", methods=["DELETE"])
    @jwt_required()
    def eliminar_item(item_id): #Elimina un articulo especifico del carrito
        
        item = ArticuloDelCarrito.query.get(item_id)

        if not item:
            return jsonify({"msg": "No existe"}), 404

        db.session.delete(item)
        db.session.commit()
        return jsonify({"msg": " eliminado del carrito"}), 200