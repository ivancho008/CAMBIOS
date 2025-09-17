from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models import db, Recompensa, RecompensaUsuario, Usuario
import json

recompensa_bp = Blueprint('recompensa', __name__)

@recompensa_bp.route('', methods=['GET'])
@jwt_required()
def get_recompensas():
    try:
        tipo = request.args.get('tipo')
        
        if tipo:
            recompensas = Recompensa.query.filter_by(tipo=tipo).all()
        else:
            recompensas = Recompensa.query.all()
        
        return jsonify([recompensa.to_dict() for recompensa in recompensas]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@recompensa_bp.route('/<string:recompensa_id>', methods=['GET'])
@jwt_required()
def get_recompensa(recompensa_id):
    try:
        recompensa = Recompensa.query.get(recompensa_id)
        if not recompensa:
            return jsonify({'error': 'Recompensa no encontrada'}), 404
        
        return jsonify(recompensa.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@recompensa_bp.route('', methods=['POST'])
@jwt_required()
def create_recompensa():
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        if not data.get('nombre') or not data.get('valor') or not data.get('requisitos'):
            return jsonify({'error': 'Nombre, valor y requisitos son requeridos'}), 400
        
        # Validar que requisitos sea un objeto JSON válido
        try:
            requisitos = data['requisitos'] if isinstance(data['requisitos'], dict) else json.loads(data['requisitos'])
        except (json.JSONDecodeError, TypeError):
            return jsonify({'error': 'Requisitos debe ser un objeto JSON válido'}), 400
        
        # Crear nueva recompensa
        nueva_recompensa = Recompensa(
            nombre=data['nombre'],
            descripcion=data.get('descripcion'),
            tipo=data.get('tipo', 'puntos'),
            valor=data['valor'],
            requisitos=requisitos
        )
        
        db.session.add(nueva_recompensa)
        db.session.commit()
        
        return jsonify(nueva_recompensa.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@recompensa_bp.route('/<string:recompensa_id>', methods=['PUT'])
@jwt_required()
def update_recompensa(recompensa_id):
    try:
        recompensa = Recompensa.query.get(recompensa_id)
        if not recompensa:
            return jsonify({'error': 'Recompensa no encontrada'}), 404
        
        data = request.get_json()
        
        # Actualizar campos permitidos
        if 'nombre' in data:
            recompensa.nombre = data['nombre']
        if 'descripcion' in data:
            recompensa.descripcion = data['descripcion']
        if 'tipo' in data and data['tipo'] in ['personalizacion', 'tecnica', 'puntos']:
            recompensa.tipo = data['tipo']
        if 'valor' in data:
            recompensa.valor = data['valor']
        
        if 'requisitos' in data:
            try:
                requisitos = data['requisitos'] if isinstance(data['requisitos'], dict) else json.loads(data['requisitos'])
                recompensa.requisitos = requisitos
            except (json.JSONDecodeError, TypeError):
                return jsonify({'error': 'Requisitos debe ser un objeto JSON válido'}), 400
        
        db.session.commit()
        
        return jsonify(recompensa.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@recompensa_bp.route('/<string:recompensa_id>', methods=['DELETE'])
@jwt_required()
def delete_recompensa(recompensa_id):
    try:
        recompensa = Recompensa.query.get(recompensa_id)
        if not recompensa:
            return jsonify({'error': 'Recompensa no encontrada'}), 404
        
        # Verificar si la recompensa ha sido otorgada a usuarios
        if recompensa.usuarios_recompensa:
            return jsonify({'error': 'No se puede eliminar una recompensa que ya ha sido otorgada'}), 400
        
        db.session.delete(recompensa)
        db.session.commit()
        
        return jsonify({'message': 'Recompensa eliminada exitosamente'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@recompensa_bp.route('/mis-recompensas', methods=['GET'])
@jwt_required()
def get_mis_recompensas():
    try:
        usuario_id = get_jwt_identity()
        
        # Obtener recompensas del usuario
        recompensas_usuario = db.session.query(
            RecompensaUsuario, Recompensa
        ).join(Recompensa).filter(
            RecompensaUsuario.usuario_id == usuario_id
        ).order_by(RecompensaUsuario.fecha_otorgada.desc()).all()
        
        resultado = []
        for recompensa_usuario, recompensa in recompensas_usuario:
            recompensa_dict = recompensa.to_dict()
            recompensa_dict.update({
                'fecha_otorgada': recompensa_usuario.fecha_otorgada.isoformat(),
                'consumida': recompensa_usuario.consumida,
                'recompensa_usuario_id': recompensa_usuario.recompensa_usuario_id
            })
            resultado.append(recompensa_dict)
        
        return jsonify(resultado), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@recompensa_bp.route('/disponibles', methods=['GET'])
@jwt_required()
def get_recompensas_disponibles():
    try:
        usuario_id = get_jwt_identity()
        
        # Obtener estadísticas del usuario para evaluar requisitos
        from models import Sesion, Tarea, Progreso
        
        # Sesiones completadas
        sesiones_completadas = Sesion.query.filter_by(
            usuario_id=usuario_id, 
            estado='Completado'
        ).count()
        
        # Tareas completadas
        tareas_completadas = Tarea.query.filter_by(
            usuario_id=usuario_id,
            estado='Completado'
        ).count()
        
        # Tiempo total de estudio
        tiempo_total = db.session.query(
            db.func.sum(Sesion.duracion_real)
        ).filter_by(usuario_id=usuario_id, estado='Completado').scalar() or 0
        
        # Días consecutivos (simplificado)
        dias_consecutivos = Progreso.query.filter_by(usuario_id=usuario_id).count()
        
        # Recompensas ya obtenidas
        recompensas_obtenidas = db.session.query(RecompensaUsuario.recompensa_id).filter_by(
            usuario_id=usuario_id
        ).subquery()
        
        # Recompensas disponibles (no obtenidas)
        recompensas_disponibles = Recompensa.query.filter(
            ~Recompensa.recompensa_id.in_(recompensas_obtenidas)
        ).all()
        
        # Evaluar cuáles puede obtener
        resultado = []
        stats_usuario = {
            'sesiones_completadas': sesiones_completadas,
            'tareas_completadas': tareas_completadas,
            'tiempo_total_minutos': tiempo_total,
            'dias_consecutivos': dias_consecutivos
        }
        
        for recompensa in recompensas_disponibles:
            recompensa_dict = recompensa.to_dict()
            puede_obtener = evaluar_requisitos(recompensa.requisitos, stats_usuario)
            recompensa_dict['puede_obtener'] = puede_obtener
            recompensa_dict['progreso_requisitos'] = calcular_progreso_requisitos(recompensa.requisitos, stats_usuario)
            resultado.append(recompensa_dict)
        
        return jsonify(resultado), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@recompensa_bp.route('/otorgar', methods=['POST'])
@jwt_required()
def otorgar_recompensa():
    try:
        data = request.get_json()
        usuario_id = get_jwt_identity()
        
        recompensa_id = data.get('recompensa_id')
        if not recompensa_id:
            return jsonify({'error': 'ID de recompensa es requerido'}), 400
        
        recompensa = Recompensa.query.get(recompensa_id)
        if not recompensa:
            return jsonify({'error': 'Recompensa no encontrada'}), 404
        
        # Verificar si ya tiene esta recompensa
        ya_tiene = RecompensaUsuario.query.filter_by(
            usuario_id=usuario_id,
            recompensa_id=recompensa_id
        ).first()
        
        if ya_tiene:
            return jsonify({'error': 'Ya tienes esta recompensa'}), 400
        
        # TODO: Aquí deberías evaluar si cumple con los requisitos
        # Por simplicidad, asumimos que sí cumple
        
        # Otorgar recompensa
        nueva_recompensa_usuario = RecompensaUsuario(
            usuario_id=usuario_id,
            recompensa_id=recompensa_id
        )
        
        db.session.add(nueva_recompensa_usuario)
        db.session.commit()
        
        return jsonify({
            'message': 'Recompensa otorgada exitosamente',
            'recompensa': recompensa.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@recompensa_bp.route('/consumir/<int:recompensa_usuario_id>', methods=['PATCH'])
@jwt_required()
def consumir_recompensa(recompensa_usuario_id):
    try:
        usuario_id = get_jwt_identity()
        
        recompensa_usuario = RecompensaUsuario.query.filter_by(
            recompensa_usuario_id=recompensa_usuario_id,
            usuario_id=usuario_id
        ).first()
        
        if not recompensa_usuario:
            return jsonify({'error': 'Recompensa no encontrada'}), 404
        
        if recompensa_usuario.consumida:
            return jsonify({'error': 'Esta recompensa ya ha sido consumida'}), 400
        
        recompensa_usuario.consumida = True
        db.session.commit()
        
        return jsonify({'message': 'Recompensa consumida exitosamente'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def evaluar_requisitos(requisitos, stats_usuario):
    """Evalúa si el usuario cumple con los requisitos para una recompensa"""
    try:
        for key, valor_requerido in requisitos.items():
            if key in stats_usuario:
                if stats_usuario[key] < valor_requerido:
                    return False
        return True
    except:
        return False

def calcular_progreso_requisitos(requisitos, stats_usuario):
    """Calcula el progreso del usuario hacia los requisitos"""
    progreso = {}
    try:
        for key, valor_requerido in requisitos.items():
            if key in stats_usuario:
                actual = stats_usuario[key]
                porcentaje = min(100, (actual / valor_requerido) * 100) if valor_requerido > 0 else 100
                progreso[key] = {
                    'actual': actual,
                    'requerido': valor_requerido,
                    'porcentaje': round(porcentaje, 2)
                }
        return progreso
    except:
        return {}