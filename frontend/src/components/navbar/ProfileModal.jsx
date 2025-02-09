import React from 'react';
import { useAuth } from '../../context/AuthContext';

function ProfileModal({ isOpen, onClose }) {
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Perfil de Usuario</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <img
            src={user.gravatar}
            alt="Profile"
            className="w-24 h-24 rounded-full mb-4"
          />
          <h3 className="text-xl font-semibold text-white">{user.name}</h3>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Email</p>
            <p className="text-white">{user.email}</p>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">ID de Usuario</p>
            <p className="text-white">{user.id}</p>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Fecha de Creación</p>
            <p className="text-white">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-sky-600 text-white py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default ProfileModal;