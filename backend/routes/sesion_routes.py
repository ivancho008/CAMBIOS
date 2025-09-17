from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models import db, Sesion, SalaSesion, SesionTecnicaParam, Tecnica, Sala, UsuarioSala
from datetime import datetime, timedelta

sesion_bp = Blueprint('sesion', __name__)

@sesion_bp.route('', methods=['GET'])
@jwt_required()
def get_sesiones():
    try:
        usuario_id = get_jwt_identity()
        
        # Parámetros de filtro opcionales
        tecnica_id = request.args.get('tecnica_id')
        estado = request.args.get('estado')
        es_grupal = request.args.get('es_grupal')
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        
        # Consulta base: sesiones del usuario actual
        query = Sesion.query.filter_by(usuario_id=usuario_id)
        
        # Aplicar filtros
        if tecnica_id:
            query = query.filter_by(tecnica_id=tecnica_id)
        if estado:
            query = query.filter_by(estado=estado)
        if es_grupal is not None:
            query = query.filter_by(es_grupal=es_grupal.lower() == 'true')
        
        if fecha_inicio:
            try:
                fecha_inicio_dt = datetime.strptime(fecha_inicio, '%Y-%m-%d')
                query = query.filter(Sesion.inicio >= fecha_inicio_dt)
            except ValueError:
                return jsonify({'error': 'Formato de fecha_inicio inválido (YYYY-MM-DD)'}), 400
        
        if fecha_fin:
            try:
                fecha_fin_dt = datetime.strptime(fecha_fin, '%Y-%m-%d') + timedelta(days=1)
                query = query.filter(Sesion.inicio < fecha_fin_dt)
            except ValueError:
                return jsonify({'error': 'Formato de fecha_fin inválido (YYYY-MM-DD)'}), 400
        
        # Ordenar por fecha de inicio (más recientes primero)
        sesiones = query.order_by(Sesion.inicio.desc()).all()
        
        # Incluir información adicional
        sesiones_completas = []
        for sesion in sesiones:
            sesion_dict = sesion.to_dict()
            
            # Agregar información de la técnica
            if sesion.tecnica_sesion:
                sesion_dict['tecnica'] = sesion.tecnica_sesion.to_dict()
            
            # Agregar parámetros de la sesión
            sesion_dict['parametros'] = [param.to_dict() for param in sesion.parametros]
            
            sesiones_completas.append(sesion_dict)
        
        return jsonify(sesiones_completas), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sesion_bp.route('/<string:sesion_id>', methods=['GET'])
@jwt_required()
def get_sesion(sesion_id):
    try:
        usuario_id = get_jwt_identity()
        
        sesion = Sesion.query.filter_by(sesion_id=sesion_id, usuario_id=usuario_id).first()
        if not sesion:
            return jsonify({'error': 'Sesión no encontrada'}), 404
        
        sesion_dict = sesion.to_dict()
        
        # Agregar información adicional
        if sesion.tecnica_sesion:
            sesion_dict['tecnica'] = sesion.tecnica_sesion.to_dict()
        
        sesion_dict['parametros'] = [param.to_dict() for param in sesion.parametros]
        
        # Si es grupal, agregar información de salas
        if sesion.es_grupal:
            salas_info = []
            for sala_sesion in sesion.salas_sesion:
                if sala_sesion.sala_sesion_rel:
                    salas_info.append(sala_sesion.sala_sesion_rel.to_dict())
            sesion_dict['salas'] = salas_info
        
        return jsonify(sesion_dict), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sesion_bp.route('', methods=['POST'])
@jwt_required()
def create_sesion():
    try:
        usuario_id = get_jwt_identity()
        data = request.get_json()
        
        # Validar datos requeridos
        if not data.get('tecnica_id'):
            return jsonify({'error': 'ID de técnica es requerido'}), 400
        
        # Verificar que la técnica existe
        tecnica = Tecnica.query.get(data['tecnica_id'])
        if not tecnica:
            return jsonify({'error': 'Técnica no encontrada'}), 404
        
        # Parsear fecha de inicio
        inicio = datetime.utcnow()
        if data.get('inicio'):
            try:
                inicio = datetime.fromisoformat(data['inicio'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Formato de fecha de inicio inválido'}), 400
        
        # Parsear fecha de fin si se proporciona
        fin = None
        if data.get('fin'):
            try:
                fin = datetime.fromisoformat(data['fin'].replace('Z', '+00:00'))
                if fin <= inicio:
                    return jsonify({'error': 'La fecha de fin debe ser posterior al inicio'}), 400
            except ValueError:
                return jsonify({'error': 'Formato de fecha de fin inválido'}), 400
        
        # Calcular duración real si hay fecha de fin
        duracion_real = None
        if fin:
            duracion_real = int((fin - inicio).total_seconds() / 60)  # minutos
        
        # Crear nueva sesión
        nueva_sesion = Sesion(
            usuario_id=usuario_id,
            tecnica_id=data['tecnica_id'],
            inicio=inicio,
            fin=fin,
            duracion_real=duracion_real,
            es_grupal=data.get('es_grupal', False),
            estado=data.get('estado', 'Completado')
        )
        
        db.session.add(nueva_sesion)
        db.session.flush()  # Para obtener el ID de la sesión
        
        # Agregar parámetros de la sesión si se proporcionan
        parametros = data.get('parametros', [])
        for param in parametros:
            if param.get('codigo') and param.get('cantidad'):
                sesion_param = SesionTecnicaParam(
                    sesion_id=nueva_sesion.sesion_id,
                    codigo=param['codigo'],
                    cantidad=str(param['cantidad'])
                )
                db.session.add(sesion_param)
        
        # Si es sesión grupal, asociar con salas
        if nueva_sesion.es_grupal and data.get('salas_ids'):
            for sala_id in data['salas_ids']:
                # Verificar que el usuario pertenece a la sala
                usuario_sala = UsuarioSala.query.filter_by(
                    usuario_id=usuario_id,
                    sala_id=sala_id,
                    activo=True
                ).first()
                
                if usuario_sala:
                    sala_sesion = SalaSesion(
                        sesion_id=nueva_sesion.sesion_id,
                        sala_id=sala_id
                    )
                    db.session.add(sala_sesion)
        
        db.session.commit()
        
        return jsonify(nueva_sesion.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@sesion_bp.route('/<string:sesion_id>', methods=['PUT'])
@jwt_required()
def update_sesion(sesion_id):
    try:
        usuario_id = get_jwt_identity()
        
        sesion = Sesion.query.filter_by(sesion_id=sesion_id, usuario_id=usuario_id).first()
        if not sesion:
            return jsonify({'error': 'Sesión no encontrada'}), 404
        
        data = request.get_json()
        
        # Actualizar campos permitidos
        if 'estado' in data and data['estado'] in ['EnEjecucion', 'Completado', 'Cancelado', 'EnPausa']:
            sesion.estado = data['estado']
        
        if 'fin' in data:
            if data['fin']:
                try:
                    fin = datetime.fromisoformat(data['fin'].replace('Z', '+00:00'))
                    if fin <= sesion.inicio:
                        return jsonify({'error': 'La fecha de fin debe ser posterior al inicio'}), 400
                    sesion.fin = fin
                    sesion.duracion_real = int((fin - sesion.inicio).total_seconds() / 60)
                except ValueError:
                    return jsonify({'error': 'Formato de fecha de fin inválido'}), 400
            else:
                sesion.fin = None
                sesion.duracion_real = None
        
        # Actualizar parámetros si se proporcionan
        if 'parametros' in data:
            # Eliminar parámetros existentes
            SesionTecnicaParam.query.filter_by(sesion_id=sesion_id).delete()
            
            # Agregar nuevos parámetros
            for param in data['parametros']:
                if param.get('codigo') and param.get('cantidad'):
                    sesion_param = SesionTecnicaParam(
                        sesion_id=sesion_id,
                        codigo=param['codigo'],
                        cantidad=str(param['cantidad'])
                    )
                    db.session.add(sesion_param)
        
        db.session.commit()
        
        return jsonify(sesion.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@sesion_bp.route('/<string:sesion_id>', methods=['DELETE'])
@jwt_required()
def delete_sesion(sesion_id):
    try:
        usuario_id = get_jwt_identity()
        
        sesion = Sesion.query.filter_by(sesion_id=sesion_id, usuario_id=usuario_id).first()
        if not sesion:
            return jsonify({'error': 'Sesión no encontrada'}), 404
        
        # Eliminar parámetros asociados
        SesionTecnicaParam.query.filter_by(sesion_id=sesion_id).delete()
        
        # Eliminar asociaciones con salas
        SalaSesion.query.filter_by(sesion_id=sesion_id).delete()
        
        # Eliminar la sesión
        db.session.delete(sesion)
        db.session.commit()
        
        return jsonify({'message': 'Sesión eliminada exitosamente'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@sesion_bp.route('/iniciar', methods=['POST'])
@jwt_required()
def iniciar_sesion():
    try:
        usuario_id = get_jwt_identity()
        data = request.get_json()
        
        if not data.get('tecnica_id'):
            return jsonify({'error': 'ID de técnica es requerido'}), 400
        
        # Verificar que no hay otra sesión en ejecución
        sesion_activa = Sesion.query.filter_by(
            usuario_id=usuario_id,
            estado='EnEjecucion'
        ).first()
        
        if sesion_activa:
            return jsonify({'error': 'Ya tienes una sesión en ejecución'}), 400
        
        # Crear nueva sesión en ejecución
        nueva_sesion = Sesion(
            usuario_id=usuario_id,
            tecnica_id=data['tecnica_id'],
            inicio=datetime.utcnow(),
            es_grupal=data.get('es_grupal', False),
            estado='EnEjecucion'
        )
        
        db.session.add(nueva_sesion)
        db.session.flush()
        
        # Agregar parámetros iniciales si se proporcionan
        parametros = data.get('parametros', [])
        for param in parametros:
            if param.get('codigo') and param.get('cantidad'):
                sesion_param = SesionTecnicaParam(
                    sesion_id=nueva_sesion.sesion_id,
                    codigo=param['codigo'],
                    cantidad=str(param['cantidad'])
                )
                db.session.add(sesion_param)
        
        db.session.commit()
        
        return jsonify(nueva_sesion.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@sesion_bp.route('/<string:sesion_id>/finalizar', methods=['PATCH'])
@jwt_required()
def finalizar_sesion(sesion_id):
    try:
        usuario_id = get_jwt_identity()
        
        sesion = Sesion.query.filter_by(
            sesion_id=sesion_id, 
            usuario_id=usuario_id,
            estado='EnEjecucion'
        ).first()
        
        if not sesion:
            return jsonify({'error': 'Sesión en ejecución no encontrada'}), 404
        
        # Finalizar sesión
        ahora = datetime.utcnow()
        sesion.fin = ahora
        sesion.duracion_real = int((ahora - sesion.inicio).total_seconds() / 60)
        sesion.estado = 'Completado'
        
        db.session.commit()
        
        return jsonify({
            'message': 'Sesión finalizada exitosamente',
            'sesion': sesion.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@sesion_bp.route('/estadisticas', methods=['GET'])
@jwt_required()
def get_estadisticas_sesiones():
    try:
        usuario_id = get_jwt_identity()
        
        # Estadísticas básicas
        total_sesiones = Sesion.query.filter_by(usuario_id=usuario_id).count()
        sesiones_completadas = Sesion.query.filter_by(usuario_id=usuario_id, estado='Completado').count()
        
        # Tiempo total estudiado (en minutos)
        tiempo_total = db.session.query(
            db.func.sum(Sesion.duracion_real)
        ).filter_by(usuario_id=usuario_id, estado='Completado').scalar() or 0
        
        # Sesiones por técnica
        sesiones_por_tecnica = db.session.query(
            Tecnica.nombre,
            db.func.count(Sesion.sesion_id).label('total'),
            db.func.sum(Sesion.duracion_real).label('tiempo_total')
        ).join(Sesion).filter(
            Sesion.usuario_id == usuario_id
        ).group_by(Tecnica.tecnica_id).all()
        
        # Promedio de duración por sesión
        promedio_duracion = db.session.query(
            db.func.avg(Sesion.duracion_real)
        ).filter_by(usuario_id=usuario_id, estado='Completado').scalar() or 0
        
        return jsonify({
            'total_sesiones': total_sesiones,
            'sesiones_completadas': sesiones_completadas,
            'tiempo_total_minutos': int(tiempo_total),
            'tiempo_total_horas': round(tiempo_total / 60, 2),
            'promedio_duracion_minutos': round(promedio_duracion, 2),
            'sesiones_por_tecnica': [
                {
                    'tecnica': nombre,
                    'total_sesiones': total,
                    'tiempo_total_minutos': int(tiempo_total or 0)
                }
                for nombre, total, tiempo_total in sesiones_por_tecnica
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500