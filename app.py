from flask import Flask
from flask_cors import CORS
from models import db
from users_routes import register_user_routes
from ganado_routes import register_ganado_routes
from carrito_routes import register_carrito_routes
from order_routes import register_order_routes
from flask_jwt_extended import JWTManager
import cloudinary
import cloudinary.uploader
import os

app = Flask(__name__)

# ---------------------------------------------------
# CONFIG DB (SQLite local o PostgreSQL en Render)
# ---------------------------------------------------
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://")
    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
else:
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///test.db"


app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# SECRET JWT
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "4geeks")

# ---------------------------------------------------
# CORS
# ---------------------------------------------------
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# ---------------------------------------------------
# CLOUDINARY
# ---------------------------------------------------
cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME", "dk41nda4d"),
    api_key=os.getenv("CLOUD_API_KEY", "139628881353826"),
    api_secret=os.getenv("CLOUD_API_SECRET", "Yao5q36MCVl5MieO7dq_-FNDelU")
)

# ---------------------------------------------------
# Inicializar extensiones
# ---------------------------------------------------
db.init_app(app)
jwt = JWTManager(app)

# Registrar rutas
register_user_routes(app)
register_ganado_routes(app)
register_carrito_routes(app)
register_order_routes(app)

# ---------------------------------------------------
# INICIO DEL SERVIDOR
# ---------------------------------------------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    # Render asigna el puerto
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
