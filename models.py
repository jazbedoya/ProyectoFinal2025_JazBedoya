from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(50), default="vendedor")

    ganado = db.relationship("Ganado", backref="vendedor", lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role
        }



class Ganado(db.Model):
    __tablename__ = "ganado"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    price_per_head = db.Column(db.Float, nullable=False)

    breed = db.Column(db.String(100))
    category = db.Column(db.String(100))
    age = db.Column(db.Integer)
    kg = db.Column(db.Float)

    department = db.Column(db.String(100))
    city = db.Column(db.String(100))
    image = db.Column(db.String(250))

    is_active = db.Column(db.Boolean, default=True)

    vendedor_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "price_per_head": self.price_per_head,
            "breed": self.breed,
            "category": self.category,
            "age": self.age,
            "kg": self.kg,
            "department": self.department,
            "city": self.city,
            "image": self.image,
            "is_active": self.is_active,
            "vendedor_id": self.vendedor_id,
            "vendedor_nombre": self.vendedor.name if self.vendedor else None
        }


class ArticuloDelCarrito(db.Model):
    __tablename__ = "articulo_del_carrito"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    ganado_id = db.Column(db.Integer, db.ForeignKey("ganado.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    price_per_head = db.Column(db.Float, nullable=False)

    user = db.relationship("User", backref="carrito", lazy=True)
    ganado = db.relationship("Ganado", lazy=True)

    def subtotal(self):
        return self.quantity * self.price_per_head

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "ganado": self.ganado.serialize() if self.ganado else None,
            "quantity": self.quantity,
            "price_per_head": self.price_per_head,
            "subtotal": self.subtotal(),
        }


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default="pending")

    # URL del QR alojado en Cloudinary
    qr_url = db.Column(db.String(300))

    items = db.relationship("OrderItem", backref="order", lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "total_amount": self.total_amount,
            "status": self.status,
            "qr_url": self.qr_url,
            "items": [item.serialize() for item in self.items]
        }



class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    ganado_id = db.Column(db.Integer, db.ForeignKey("ganado.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price_per_head = db.Column(db.Float, nullable=False)

    ganado = db.relationship("Ganado", lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "ganado": self.ganado.serialize() if self.ganado else None,
            "quantity": self.quantity,
            "price_per_head": self.price_per_head,
            "subtotal": self.quantity * self.price_per_head
        }
