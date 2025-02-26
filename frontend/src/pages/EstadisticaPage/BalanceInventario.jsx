// src/pages/EstadisticaPage/BalanceInventario.jsx
import React, { useState, useEffect } from "react";
import { formatNumber } from "./formatters";
import axios from "../../api/axios";

const BalanceInventario = () => {
  const [datos, setDatos] = useState({ total: 0, entradas: 0, salidas: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Llamada real a la API para obtener el balance de inventario
        const response = await axios.get("/estadisticas/balance");

        // Extraer y transformar los datos de la estructura anidada
        const dataTransformada = {
          total: response.data.stock.total,
          entradas: response.data.porcentajes.entradas,
          salidas: response.data.porcentajes.salidas,
        };

        // Actualizar el estado con los datos transformados
        setDatos(dataTransformada);
      } catch (err) {
        console.error("Error al cargar balance de inventario:", err);
        setError("Error al cargar datos. Intente nuevamente.");

        // Si hay un error, mantener los datos previos o usar valores por defecto
        setDatos(
          (prevData) => prevData || { total: 0, entradas: 0, salidas: 0 }
        );
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-800 pb-2">
          Balance de Inventario
        </h2>
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-sky-600 animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-sky-600 animate-pulse delay-75"></div>
            <div className="w-3 h-3 rounded-full bg-sky-600 animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-800 pb-2">
          Balance de Inventario
        </h2>
        <div className="py-8 text-center text-red-400">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white text-sm"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-800 pb-2">
        Balance de Inventario
      </h2>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-gray-800 p-4 rounded-md text-center">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            Total de Inventario
          </h3>
          <p className="text-4xl font-bold text-center text-blue-500">
            {formatNumber(datos.total)} Kg
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-800 p-4 rounded-md text-center">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">
              Entradas
            </h3>
            <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center border-4 border-gray-700 relative">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(#22C55E 0% ${datos.entradas}%, transparent ${datos.entradas}% 100%)`,
                  clipPath: "circle(50%)",
                }}
              ></div>
              <div className="bg-gray-900 w-16 h-16 rounded-full flex items-center justify-center z-10">
                <p className="text-2xl font-bold text-green-500">
                  {datos.entradas}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-md text-center">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">
              Salidas
            </h3>
            <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center border-4 border-gray-700 relative">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(#EF4444 0% ${datos.salidas}%, transparent ${datos.salidas}% 100%)`,
                  clipPath: "circle(50%)",
                }}
              ></div>
              <div className="bg-gray-900 w-16 h-16 rounded-full flex items-center justify-center z-10">
                <p className="text-2xl font-bold text-red-500">
                  {datos.salidas}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceInventario;
