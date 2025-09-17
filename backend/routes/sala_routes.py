from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models import db, Sala, UsuarioSala, Usuario
import secrets
import string

sala_bp = Blueprint('sala', __name__)

def generate_access_code():
    """Generar código de acceso aleatorio para salas privadas"""
    return ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(6))

@sala_bp.route('', methods=['GET'])
@jwt_required()
def get_salas():
    try:
        usuario_id = get_jwt_identity()
        
        # Obtener solo las salas donde el usuario participa
        salas_usuario = db.session.query(Sala).join(UsuarioSala).filter(
            UsuarioSala.usuario_id == usuario_id,
            UsuarioSala.activo == True
        ).all()
        
        return jsonify([sala.to_dict() for sala in salas_usuario]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sala_bp.route('/publicas', methods=['GET'])
@jwt_required()
def get_salas_publicas():
    try:
        salas = Sala.query.filter_by(es_privada=False).all()
        return jsonify([sala.to_dict() for sala in salas]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sala_bp.route('/<string:sala_id>', methods=['GET'])
@jwt_required()
def get_sala(sala_id):
    try:
        sala = Sala.query.get(sala_id)
        if not sala:
            return jsonify({'error': 'Sala no encontrada'}), 404
        
        # Verificar si el usuario tiene acceso a la sala
        usuario_id = get_jwt_identity()
        usuario_sala = UsuarioSala.query.filter_by(
            usuario_id=usuario_id, 
            sala_id=sala_id,
            activo=True
        ).first()
        
        if not usuario_sala and sala.es_privada:
            return jsonify({'error': 'No tienes acceso a esta sala'}), 403
        
        # Incluir información de participantes
        sala_dict = sala.to_dict()
        participantes = db.session.query(Usuario).join(UsuarioSala).filter(
            UsuarioSala.sala_id == sala_id,
            UsuarioSala.activo == True
        ).all()
        
        sala_dict['participantes'] = [p.to_dict() for p in participantes]
        sala_dict['total_participantes'] = len(participantes)
        
        return jsonify(sala_dict), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sala_bp.route('', methods=['POST'])
@jwt_required()
def create_sala():
    try:
        usuario_id = get_jwt_identity()
        data = request.get_json()
        
        # Validar datos requeridos
        if not data.get('nombre'):
            return jsonify({'error': 'El nombre de la sala es requerido'}), 400
        
        # Generar código de acceso si es privada
        codigo_acceso = None
        if data.get('es_privada', False):
            codigo_acceso = generate_access_code()
        
        # Crear nueva sala
        nueva_sala = Sala(
            nombre=data['nombre'],
            descripcion=data.get('descripcion'),
            max_participantes=data.get('max_participantes'),
            es_privada=data.get('es_privada', False),
            codigo_acceso=codigo_acceso
        )
        
        db.session.add(nueva_sala)
        db.session.flush()  # Para obtener el ID de la sala
        
        # Agregar al creador como líder de la sala
        usuario_sala = UsuarioSala(
            usuario_id=usuario_id,
            sala_id=nueva_sala.sala_id,
            rol_en_sala='lider'
        )
        
        db.session.add(usuario_sala)
        db.session.commit()
        
        return jsonify(nueva_sala.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@sala_bp.route('/<string:sala_id>', methods=['PUT'])
@jwt_required()
def update_sala(sala_id):
    try:
        usuario_id = get_jwt_identity()
        
        # Verificar que el usuario sea líder de la sala
        usuario_sala = UsuarioSala.query.filter_by(
            usuario_id=usuario_id,
            sala_id=sala_id,
            rol_en_sala='lider',
            activo=True
        ).first()
        
        if not usuario_sala:
            return jsonify({'error': 'No tienes permisos para modificar esta sala'}), 403
        
        sala = Sala.query.get(sala_id)
        if not sala:
            return jsonify({'error': 'Sala no encontrada'}), 404
        
        data = request.get_json()
        
        # Actualizar campos permitidos
        if 'nombre' in data:
            sala.nombre = data['nombre']
        if 'descripcion' in data:
            sala.descripcion = data['descripcion']
        if 'max_participantes' in data:
            sala.max_participantes = data['max_participantes']
        if 'es_privada' in data:
            sala.es_privada = data['es_privada']
            # Si se hace privada y no tiene código, generarlo
            if data['es_privada'] and not sala.codigo_acceso:
                sala.codigo_acceso = generate_access_code()
            # Si se hace pública, remover código
            elif not data['es_privada']:
                sala.codigo_acceso = None
        
        db.session.commit()
        
        return jsonify(sala.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@sala_bp.route('/<string:sala_id>', methods=['DELETE'])
@jwt_required()
def delete_sala(sala_id):
    try:
        usuario_id = get_jwt_identity()
        
        # Verificar que el usuario sea líder de la sala
        usuario_sala = UsuarioSala.query.filter_by(
            usuario_id=usuario_id,
            sala_id=sala_id,
            rol_en_sala='lider',
            activo=True
        ).first()
        
        if not usuario_sala:
            return jsonify({'error': 'No tienes permisos para eliminar esta sala'}), 403
        
        sala = Sala.query.get(sala_id)
        if not sala:
            return jsonify({'error': 'Sala no encontrada'}), 404
        
        # Desactivar todos los usuarios de la sala
        UsuarioSala.query.filter_by(sala_id=sala_id).update({'activo': False})
        
        # Eliminar la sala
        db.session.delete(sala)
        db.session.commit()
        
        return jsonify({'message': 'Sala eliminada exitosamente'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@sala_bp.route('/unirse', methods=['POST'])
@jwt_required()
def unirse_sala():
    try:
        usuario_id = get_jwt_identity()
        data = request.get_json()
        
        sala_id = data.get('sala_id')
        codigo_acceso = data.get('codigo_acceso')
        
        if not sala_id:
            return jsonify({'error': 'ID de sala es requerido'}), 400
        
        sala = Sala.query.get(sala_id)
        if not sala:
            return jsonify({'error': 'Sala no encontrada'}), 404
        
        # Verificar código de acceso para salas privadas
        if sala.es_privada and sala.codigo_acceso != codigo_acceso:
            return jsonify({'error': 'Código de acceso incorrecto'}), 403
        
        # Verificar si ya está en la sala
        usuario_sala_existente = UsuarioSala.query.filter_by(
            usuario_id=usuario_id,
            sala_id=sala_id
        ).first()
        
        if usuario_sala_existente:
            if usuario_sala_existente.activo:
                return jsonify({'error': 'Ya eres miembro de esta sala'}), 400
            else:
                # Reactivar membresía
                usuario_sala_existente.activo = True
        else:
            # Verificar límite de participantes
            if sala.max_participantes:
                participantes_activos = UsuarioSala.query.filter_by(
                    sala_id=sala_id,
                    activo=True
                ).count()
                
                if participantes_activos >= sala.max_participantes:
                    return jsonify({'error': 'La sala ha alcanzado el límite de participantes'}), 400
            
            # Crear nueva membresía
            usuario_sala_existente = UsuarioSala(
                usuario_id=usuario_id,
                sala_id=sala_id,
                rol_en_sala='invitado'
            )
            db.session.add(usuario_sala_existente)
        
        db.session.commit()
        
        return jsonify({'message': 'Te has unido a la sala exitosamente'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@sala_bp.route('/<string:sala_id>/salir', methods=['POST'])
@jwt_required()
def salir_sala(sala_id):
    try:
        usuario_id = get_jwt_identity()
        
        usuario_sala = UsuarioSala.query.filter_by(
            usuario_id=usuario_id,
            sala_id=sala_id,
            activo=True
        ).first()
        
        if not usuario_sala:
            return jsonify({'error': 'No eres miembro de esta sala'}), 400
        
        # Si es el líder, verificar que haya otros líderes o transferir liderazgo
        if usuario_sala.rol_en_sala == 'lider':
            otros_lideres = UsuarioSala.query.filter_by(
                sala_id=sala_id,
                rol_en_sala='lider',
                activo=True
            ).filter(UsuarioSala.usuario_id != usuario_id).count()
            
            if otros_lideres == 0:
                # Transferir liderazgo al primer invitado activo
                nuevo_lider = UsuarioSala.query.filter_by(
                    sala_id=sala_id,
                    rol_en_sala='invitado',
                    activo=True
                ).first()
                
                if nuevo_lider:
                    nuevo_lider.rol_en_sala = 'lider'
                else:
                    # Si no hay más participantes, eliminar la sala
                    sala = Sala.query.get(sala_id)
                    if sala:
                        db.session.delete(sala)
        
        # Desactivar membresía
        usuario_sala.activo = False
        db.session.commit()
        
        return jsonify({'message': 'Has salido de la sala exitosamente'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500