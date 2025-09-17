from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from backend.config import config
from backend.models import db


# Routers
from backend.routes.auth import auth_bp
from backend.routes.usuario_routes import usuario_bp
from backend.routes.sala_routes import sala_bp
from backend.routes.tarea_routes import tarea_bp
from backend.routes.sesion_routes import sesion_bp
from backend.routes.tecnica_routes import tecnica_bp
from backend.routes.recompensa_routes import recompensa_bp
from backend.routes.progreso_routes import progreso_bp

def create_app(config_name='development'):
    app = Flask(__name__)
    
    # Cargar configuración
    app.config.from_object(config[config_name])
    
    # Inicializar extensiones
    db.init_app(app)
    CORS(app, origins=app.config.get('CORS_ORIGINS', '*'))
    jwt = JWTManager(app)
    
    # Inicializar migraciones aquí (solo si quieres migrar desde aquí)
    migrate = Migrate(app, db)
    
    # Registrar blueprints
    from backend.routes.auth import auth_bp
    from backend.routes.usuario_routes import usuario_bp
    from backend.routes.sala_routes import sala_bp
    from backend.routes.tarea_routes import tarea_bp
    from backend.routes.sesion_routes import sesion_bp
    from backend.routes.tecnica_routes import tecnica_bp
    from backend.routes.recompensa_routes import recompensa_bp
    from backend.routes.progreso_routes import progreso_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(usuario_bp, url_prefix='/api/usuarios')
    app.register_blueprint(sala_bp, url_prefix='/api/salas')
    app.register_blueprint(tarea_bp, url_prefix='/api/tareas')
    app.register_blueprint(sesion_bp, url_prefix='/api/sesiones')
    app.register_blueprint(tecnica_bp, url_prefix='/api/tecnicas')
    app.register_blueprint(recompensa_bp, url_prefix='/api/recompensas')
    app.register_blueprint(progreso_bp, url_prefix='/api/progreso')
    
    # Crear tablas y roles por defecto solo si es necesario
    with app.app_context():
        db.create_all()
        
        from backend.models import Rol
        if not Rol.query.first():
            admin_role = Rol(nombre='administrador')
            user_role = Rol(nombre='usuario')
            db.session.add_all([admin_role, user_role])
            db.session.commit()
    
    return app
