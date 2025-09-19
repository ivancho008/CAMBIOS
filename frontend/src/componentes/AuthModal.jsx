// src/componentes/AuthModal.jsx
import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaCalendarAlt,
  FaVenusMars,
  FaPhone,
  FaIdBadge,
  FaGoogle,
  FaFacebookF,
  FaMicrosoft,
} from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ProgresoBar from "./ProgresoBar";

export default function AuthModal({
  isOpen,
  defaultMode = "login",
  onClose,
  onLogin,
  onRegister,
}) {
  const [isLogin, setIsLogin] = useState(defaultMode === "login");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthdate: "",
    gender: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [flashMessage, setFlashMessage] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Reglas de validación
  const validatePassword = (password) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(password);

  const validatePhone = (phone) =>
    phone === "" || /^\d{10}$/.test(phone); // opcional

  const requiredFields = [
    "name",
    "username",
    "email",
    "password",
    "confirmPassword",
    "birthdate",
    "gender",
  ];

  const calculateProgress = () => {
    if (isLogin) return 0;
    let validCount = 0;
    requiredFields.forEach((field) => {
      if (formData[field]) {
        if (field === "password" && !validatePassword(formData.password))
          return;
        if (
          field === "confirmPassword" &&
          formData.confirmPassword !== formData.password
        )
          return;
        validCount++;
      }
    });
    return Math.round((validCount / requiredFields.length) * 100);
  };

  useEffect(() => {
    setIsLogin(defaultMode === "login");
  }, [defaultMode, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        birthdate: "",
        gender: "",
        phone: "",
      });
      setErrors({});
      setFlashMessage({ message: "", type: "" });
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!isLogin) {
      if (!formData.name) newErrors.name = "El nombre completo es requerido";
      if (!formData.username)
        newErrors.username = "El nombre de usuario es requerido";
      if (!formData.birthdate)
        newErrors.birthdate = "La fecha de nacimiento es requerida";
      if (!formData.gender) newErrors.gender = "El género es requerido";
      if (!validatePassword(formData.password))
        newErrors.password =
          "La contraseña debe tener 8 caracteres, una mayúscula, un número y un caracter especial";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Las contraseñas no coinciden";
      if (!validatePhone(formData.phone))
        newErrors.phone =
          "El teléfono debe tener 10 dígitos o dejarse vacío (opcional)";
    }
    if (!formData.email) newErrors.email = "El correo es requerido";
    if (!formData.password) newErrors.password = "La contraseña es requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setFlashMessage({
        message: "Por favor corrige los errores",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await onLogin(formData.email, formData.password);
        setFlashMessage({
          message: "Inicio de sesión exitoso",
          type: "success",
        });
      } else {
        await onRegister({
          nombre: formData.name,
          username: formData.username,
          correo: formData.email,
          password: formData.password,
          birthdate: formData.birthdate,
          gender: formData.gender,
          phone: formData.phone,
        });
        setFlashMessage({
          message: "Cuenta creada con éxito",
          type: "success",
        });
      }

      onClose();
    } catch (err) {
      setFlashMessage({
        message: err?.message || "Error en el servidor",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 relative animate-fadeIn">
        {/* cerrar */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-lg"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-3 text-gray-800">
          {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
        </h2>

        {flashMessage.message && (
          <div
            className={`px-3 py-2 rounded mb-3 text-sm ${
              flashMessage.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {flashMessage.message}
          </div>
        )}

        {!isLogin && (
          <div className="mb-4">
            <ProgresoBar progress={calculateProgress()} />
            <p className="text-xs text-gray-500 mt-1">
              Completa los campos obligatorios
            </p>
          </div>
        )}

        {/* Botones sociales */}
        <div className="flex justify-center gap-2 mb-4">
          <button className="flex items-center gap-2 border px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
            <FaGoogle className="text-red-500" /> Google
          </button>
          <button className="flex items-center gap-2 border px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
            <FaFacebookF className="text-blue-600" /> Facebook
          </button>
          <button className="flex items-center gap-2 border px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
            <FaMicrosoft className="text-gray-700" /> Microsoft
          </button>
        </div>

        <div className="flex items-center my-3">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-2 text-gray-400 text-xs">o con tu correo</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <>
              <div className="relative">
                <FaUser className="absolute top-2.5 left-3 text-gray-400 text-sm" />
                <input
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  name="name"
                  placeholder="Nombre completo"
                  className="w-full border pl-9 py-2.5 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                )}
              </div>

              <div className="relative">
                <FaIdBadge className="absolute top-2.5 left-3 text-gray-400 text-sm" />
                <input
                  value={formData.username}
                  onChange={handleChange}
                  type="text"
                  name="username"
                  placeholder="Nombre de usuario"
                  className="w-full border pl-9 py-2.5 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
                />
                {errors.username && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.username}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FaCalendarAlt className="absolute top-2.5 left-3 text-gray-400 text-sm" />
                  <input
                    value={formData.birthdate}
                    onChange={handleChange}
                    type="date"
                    name="birthdate"
                    className="w-full border pl-9 py-2.5 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
                  />
                  {errors.birthdate && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.birthdate}
                    </p>
                  )}
                </div>
                <div className="relative flex-1">
                  <FaVenusMars className="absolute top-2.5 left-3 text-gray-400 text-sm" />
                  <select
                    value={formData.gender}
                    onChange={handleChange}
                    name="gender"
                    className="w-full border pl-9 py-2.5 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Género</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                  {errors.gender && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.gender}
                    </p>
                  )}
                </div>
              </div>

              <div className="relative">
                <FaPhone className="absolute top-2.5 left-3 text-gray-400 text-sm" />
                <input
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  name="phone"
                  placeholder="Teléfono (opcional)"
                  className="w-full border pl-9 py-2.5 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
                />
                {errors.phone && (
                  <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                )}
              </div>
            </>
          )}

          <div className="relative">
            <FaEnvelope className="absolute top-2.5 left-3 text-gray-400 text-sm" />
            <input
              value={formData.email}
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Correo electrónico"
              className="w-full border pl-9 py-2.5 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password con ojo */}
          <div className="relative">
            <FaLock className="absolute top-2.5 left-3 text-gray-400 text-sm" />
            <input
              value={formData.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              className="w-full border pl-9 pr-9 py-2.5 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
            />
<button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
>
  {showPassword ? <FaEyeSlash /> : <FaEye />}
</button>

            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          {!isLogin && (
            <div className="relative">
              <FaLock className="absolute top-2.5 left-3 text-gray-400 text-sm" />
              <input
                value={formData.confirmPassword}
                onChange={handleChange}
                type="password"
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                className="w-full border pl-9 py-2.5 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 rounded-md text-sm font-semibold shadow-md hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-60"
          >
            {loading
              ? "Procesando..."
              : isLogin
              ? "Iniciar Sesión"
              : "Registrarse"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600 text-sm">
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button
            className="text-purple-600 font-semibold hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Regístrate aquí" : "Inicia sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}