from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, ArticuloDelCarrito, Order, OrderItem
import qrcode
from io import BytesIO
import cloudinary.uploader

def register_order_routes(app):

    @app.route("/orders/checkout", methods=["POST"])
    @jwt_required() #solo un usuario logueado puede pagar
    def checkout(): #Esta funcion procede al pago del carrito
       
        user_id = int(get_jwt_identity()) #devuelve el ID del usuario que inicio sesion
        items = ArticuloDelCarrito.query.filter_by(user_id=user_id).all() #busca articulo del carrito asociado a ID

        if not items:
            return jsonify({"msg": "Carrito vacío"}), 400

        #Calcular total
        total = sum(i.subtotal() for i in items) #cada articulo tiene el metodo subtota= catidadxprecio , se suman todos los subtotales

        #Crear orden en la BD
        order = Order(user_id=user_id, total_amount=total, status="pending") #Crea la orden con estado pendiente
        db.session.add(order)
        db.session.flush() #guarda temporamwnte sin hacer commit

        #Se crea una orderItem por cada gaando en el carrito
        for i in items:
            order_item = OrderItem(
                order_id=order.id,
                ganado_id=i.ganado_id,
                quantity=i.quantity,
                price_per_head=i.price_per_head
            )
            db.session.add(order_item)
            db.session.delete(i) #se elimina el ganado del carrito y queda vacio

        
        #pago con Qr #Todavia no es un arhivo solo esta en  memoria
        qr_text = f"Pago orden #{order.id} - Total {total} Gs"
        qr = qrcode.make(qr_text) #use libreria qrcode para generar imagen qr
        buffer = BytesIO() # lo guardamos temporalmente en memoria BytesIO()
        qr.save(buffer, format="PNG")
        buffer.seek(0) #movemos el cursor al inicio

       
        #subir qr Cloudinary 
        upload_result = cloudinary.uploader.upload(buffer, folder="ordenes") #Se envia el arhivo en memoria a cloudinary y esta lo almacena

        qr_url = upload_result["secure_url"] #obtengo url publica

      
      
        # Guardar la URL en la orden
        order.status = "paid"
        order.qr_url = qr_url

        db.session.commit() #se guarda la orden + OrdenItem+ borrado del carrito + QR URL

        return jsonify(order.serialize()), 201





#Mi flujo de checkout funciona así

#El usuario presiona Pagar, entonces mi ruta /orders/checkout valida el token con JWT. Esto garantiza que solo un usuario logueado pueda pagar.3

#Después leo todos los productos del carrito, calculo el total y creo la orden en estado ‘pending’. Cada producto del carrito se convierte en un OrderItem y el carrito se vacía.

#En ese momento genero un QR en memoria usando qrcode, y ese QR lo subo a la API externa Cloudinary, porque Cloudinary convierte ese archivo en un enlace público.

#La URL del QR queda guardada dentro de la orden, actualizo el estado a ‘paid’ y devuelvo la orden al frontend.

#El frontend muestra ese QR centrado, y el usuario puede escanearlo.

#Así cumplo con todos los requisitos: CRUD, Login, carrito, órdenes y una API externa real conectada al backend