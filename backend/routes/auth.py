from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from backend.models import db, Usuario, Rol
from datetime import datetime

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        print("✅ [REGISTER] Datos recibidos:", data)

        if not data.get('username') or not data.get('email') or not data.get('password'):
            print("❌ [REGISTER] Faltan campos obligatorios")
            return jsonify({'error': 'Username, email y contraseña son requeridos'}), 400

        if Usuario.query.filter_by(correo=data['email']).first():
            print("❌ [REGISTER] Email ya registrado:", data['email'])
            return jsonify({'error': 'El email ya está registrado'}), 400

        if Usuario.query.filter_by(username=data['username']).first():
            print("❌ [REGISTER] Username ya registrado:", data['username'])
            return jsonify({'error': 'El username ya está registrado'}), 400

        rol_usuario = Rol.query.filter_by(nombre='usuario').first()
        if not rol_usuario:
            print("❌ [REGISTER] Rol 'usuario' no encontrado en DB")
            return jsonify({'error': 'Rol de usuario no encontrado'}), 500

        print("✅ [REGISTER] Rol encontrado:", rol_usuario.id)

        nuevo_usuario = Usuario(
            username=data['username'],
            correo=data['email'],
            password=generate_password_hash(data['password']),
            rol_id=rol_usuario.id
        )

        db.session.add(nuevo_usuario)
        db.session.commit()
        print("✅ [REGISTER] Usuario creado:", nuevo_usuario.to_dict())

        return jsonify({
            'message': 'Usuario registrado exitosamente',
            'usuario': nuevo_usuario.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        print("🔥 [REGISTER] Error:", str(e))
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print("✅ [LOGIN] Datos recibidos:", data)

        if not data.get('email') or not data.get('password'):
            print("❌ [LOGIN] Email o contraseña faltante")
            return jsonify({'error': 'Email y contraseña son requeridos'}), 400

        usuario = Usuario.query.filter_by(correo=data['email']).first()
        if not usuario:
            print("❌ [LOGIN] Usuario no encontrado con email:", data['email'])
            return jsonify({'error': 'Credenciales inválidas'}), 401

        if not check_password_hash(usuario.password, data['password']):
            print("❌ [LOGIN] Contraseña incorrecta para:", data['email'])
            return jsonify({'error': 'Credenciales inválidas'}), 401

        if not usuario.activo:
            print("❌ [LOGIN] Cuenta desactivada para:", data['email'])
            return jsonify({'error': 'Cuenta desactivada'}), 401

        usuario.ultimo_acceso = datetime.utcnow()
        db.session.commit()
        print("✅ [LOGIN] Último acceso actualizado")

        access_token = create_access_token(identity=usuario.id_usuario)
        print("✅ [LOGIN] Token generado:", access_token)

        return jsonify({
            'access_token': access_token,
            'usuario': usuario.to_dict()
        }), 200

    except Exception as e:
        print("🔥 [LOGIN] Error:", str(e))
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        usuario_id = get_jwt_identity()
        print("✅ [ME] ID del usuario autenticado:", usuario_id)

        usuario = Usuario.query.get(usuario_id)
        if not usuario:
            print("❌ [ME] Usuario no encontrado con ID:", usuario_id)
            return jsonify({'error': 'Usuario no encontrado'}), 404

        print("✅ [ME] Usuario encontrado:", usuario.to_dict())
        return jsonify(usuario.to_dict()), 200

    except Exception as e:
        print("🔥 [ME] Error:", str(e))
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    try:
        usuario_id = get_jwt_identity()
        print("✅ [CHANGE PASSWORD] ID del usuario autenticado:", usuario_id)

        data = request.get_json()
        print("✅ [CHANGE PASSWORD] Datos recibidos:", data)

        if not data.get('current_password') or not data.get('new_password'):
            print("❌ [CHANGE PASSWORD] Contraseñas requeridas faltantes")
            return jsonify({'error': 'Contraseña actual y nueva son requeridas'}), 400

        usuario = Usuario.query.get(usuario_id)
        if not usuario:
            print("❌ [CHANGE PASSWORD] Usuario no encontrado con ID:", usuario_id)
            return jsonify({'error': 'Usuario no encontrado'}), 404

        if not check_password_hash(usuario.password, data['current_password']):
            print("❌ [CHANGE PASSWORD] Contraseña actual incorrecta")
            return jsonify({'error': 'Contraseña actual incorrecta'}), 400

        usuario.password = generate_password_hash(data['new_password'])
        db.session.commit()
        print("✅ [CHANGE PASSWORD] Contraseña actualizada")

        return jsonify({'message': 'Contraseña actualizada exitosamente'}), 200

    except Exception as e:
        db.session.rollback()
        print("🔥 [CHANGE PASSWORD] Error:", str(e))
        return jsonify({'error': str(e)}), 500
