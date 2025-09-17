from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date
import uuid

db = SQLAlchemy()

def generate_uuid():
    return str(uuid.uuid4())

# Modelo Rol
class Rol(db.Model):
    __tablename__ = 'rol'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(50), unique=True, nullable=False)

    usuarios = db.relationship('Usuario', backref='rol_usuario', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre
        }

# Modelo Usuario
class Usuario(db.Model):
    __tablename__ = 'usuario'

    id_usuario = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    Username = db.Column(db.String(100), nullable=True)
    correo = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    fecha_registro = db.Column(db.DateTime(6), default=datetime.utcnow, nullable=False)
    ultimo_acceso = db.Column(db.DateTime(6), nullable=True)
    rol_id = db.Column(db.Integer, db.ForeignKey('rol.id'), nullable=False)
    activo = db.Column(db.Boolean, default=True, nullable=False)

    tareas = db.relationship('Tarea', backref='usuario_tarea', lazy=True)
    sesiones = db.relationship('Sesion', backref='usuario_sesion', lazy=True)
    salas = db.relationship('UsuarioSala', backref='usuario_sala', lazy=True)
    recompensas = db.relationship('RecompensaUsuario', backref='usuario_recompensa', lazy=True)
    progreso = db.relationship('Progreso', backref='usuario_progreso', lazy=True)

    def to_dict(self):
        return {
            'id_usuario': self.id_usuario,
            'Username': self.Username,
            'correo': self.correo,
            'fecha_registro': self.fecha_registro.isoformat() if self.fecha_registro else None,
            'ultimo_acceso': self.ultimo_acceso.isoformat() if self.ultimo_acceso else None,
            'rol_id': self.rol_id,
            'activo': self.activo
        }

# Modelo Sala
class Sala(db.Model):
    __tablename__ = 'sala'

    id_sala = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)
    fecha_creacion = db.Column(db.DateTime(6), default=datetime.utcnow, nullable=False)
    creador_id = db.Column(db.String(36), db.ForeignKey('usuario.id_usuario'), nullable=False)

    usuarios_sala = db.relationship('UsuarioSala', backref='sala_usuario', lazy=True)
    sesiones_sala = db.relationship('SalaSesion', backref='sala_sesion_rel', lazy=True)

    def to_dict(self):
        return {
            'id_sala': self.id_sala,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'fecha_creacion': self.fecha_creacion.isoformat() if self.fecha_creacion else None,
            'creador_id': self.creador_id
        }

# UsuarioSala
class UsuarioSala(db.Model):
    __tablename__ = 'usuariosala'

    id_usuario = db.Column(db.String(36), db.ForeignKey('usuario.id_usuario'), primary_key=True)
    id_sala = db.Column(db.String(36), db.ForeignKey('sala.id_sala'), primary_key=True)
    fecha_union = db.Column(db.DateTime(6), default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id_usuario': self.id_usuario,
            'id_sala': self.id_sala,
            'fecha_union': self.fecha_union.isoformat()
        }

# Modelo Tarea
class Tarea(db.Model):
    __tablename__ = 'tarea'

    id_tarea = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    usuario_id = db.Column(db.String(36), db.ForeignKey('usuario.id_usuario'), nullable=False)
    titulo = db.Column(db.String(200), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)
    fecha_creacion = db.Column(db.DateTime(6), default=datetime.utcnow, nullable=False)
    completada = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id_tarea': self.id_tarea,
            'usuario_id': self.usuario_id,
            'titulo': self.titulo,
            'descripcion': self.descripcion,
            'fecha_creacion': self.fecha_creacion.isoformat(),
            'completada': self.completada
        }

# Modelo Tecnica
class Tecnica(db.Model):
    __tablename__ = 'tecnica'

    id_tecnica = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)
    duracion_estimada = db.Column(db.Integer, nullable=False)
    categoria = db.Column(db.String(50), nullable=True)  # 👈 Agregado

    sesiones = db.relationship('Sesion', backref='tecnica_sesion', lazy=True)

    def to_dict(self):
        return {
            'id_tecnica': self.id_tecnica,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'duracion_estimada': self.duracion_estimada,
            'categoria': self.categoria
        }


# Modelo Sesion
class Sesion(db.Model):
    __tablename__ = 'sesion'

    id_sesion = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    usuario_id = db.Column(db.String(36), db.ForeignKey('usuario.id_usuario'), nullable=False)
    tecnica_id = db.Column(db.String(36), db.ForeignKey('tecnica.id_tecnica'), nullable=False)
    fecha_inicio = db.Column(db.DateTime(6), default=datetime.utcnow, nullable=False)
    fecha_fin = db.Column(db.DateTime(6), nullable=True)
    completada = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id_sesion': self.id_sesion,
            'usuario_id': self.usuario_id,
            'tecnica_id': self.tecnica_id,
            'fecha_inicio': self.fecha_inicio.isoformat(),
            'fecha_fin': self.fecha_fin.isoformat() if self.fecha_fin else None,
            'completada': self.completada
        }

# Modelo SalaSesion
class SalaSesion(db.Model):
    __tablename__ = 'salasesion'

    id_sala = db.Column(db.String(36), db.ForeignKey('sala.id_sala'), primary_key=True)
    id_sesion = db.Column(db.String(36), db.ForeignKey('sesion.id_sesion'), primary_key=True)

    def to_dict(self):
        return {
            'id_sala': self.id_sala,
            'id_sesion': self.id_sesion
        }

# Modelo SesionTecnicaParam
class SesionTecnicaParam(db.Model):
    __tablename__ = 'sesiontecnicaparam'

    id_param = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    sesion_id = db.Column(db.String(36), db.ForeignKey('sesion.id_sesion'), nullable=False)
    parametro = db.Column(db.String(100), nullable=False)
    valor = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            'id_param': self.id_param,
            'sesion_id': self.sesion_id,
            'parametro': self.parametro,
            'valor': self.valor
        }

# Modelo Recompensa
class Recompensa(db.Model):
    __tablename__ = 'recompensa'

    id_recompensa = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)

    # 🔧 Cambiado de nullable=False a nullable=True para evitar errores con valores None
    puntos_requeridos = db.Column(db.Integer, nullable=True)

    # Campos adicionales para las recompensas dinámicas:
    tipo = db.Column(db.String(50), nullable=False)
    valor = db.Column(db.Integer, nullable=False)
    requisitos = db.Column(db.JSON, nullable=False)

    def to_dict(self):
        return {
            'id_recompensa': self.id_recompensa,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'puntos_requeridos': self.puntos_requeridos,
            'tipo': self.tipo,
            'valor': self.valor,
            'requisitos': self.requisitos
        }

# Modelo RecompensaUsuario
class RecompensaUsuario(db.Model):
    __tablename__ = 'recompensausuario'

    id_usuario = db.Column(db.String(36), db.ForeignKey('usuario.id_usuario'), primary_key=True)
    id_recompensa = db.Column(db.String(36), db.ForeignKey('recompensa.id_recompensa'), primary_key=True)
    fecha_obtenida = db.Column(db.DateTime(6), default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id_usuario': self.id_usuario,
            'id_recompensa': self.id_recompensa,
            'fecha_obtenida': self.fecha_obtenida.isoformat()
        }

# Modelo Progreso
class Progreso(db.Model):
    __tablename__ = 'progreso'

    id_progreso = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    usuario_id = db.Column(db.String(36), db.ForeignKey('usuario.id_usuario'), nullable=False)
    fecha = db.Column(db.Date, default=date.today, nullable=False)
    tareas_completadas = db.Column(db.Integer, default=0, nullable=False)
    sesiones_completadas = db.Column(db.Integer, default=0, nullable=False)
    puntos_acumulados = db.Column(db.Integer, default=0, nullable=False)

    def to_dict(self):
        return {
            'id_progreso': self.id_progreso,
            'usuario_id': self.usuario_id,
            'fecha': self.fecha.isoformat(),
            'tareas_completadas': self.tareas_completadas,
            'sesiones_completadas': self.sesiones_completadas,
            'puntos_acumulados': self.puntos_acumulados
        }
