// src/pages/EstadisticaPage/TablaCompras.jsx
import React, { useState, useEffect } from "react";
import { formatCLP, formatNumber } from "./formatters";
import axios from "../../api/axios";

const TablaCompras = ({ periodo = "anual" }) => {
  const [datos, setDatos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Llamada a la API real
        const response = await axios.get(
          `/estadisticas/compras?periodo=${periodo}`
        );
        setDatos(response.data);
      } catch (err) {
        console.error("Error al cargar datos de compras:", err);
        setError("Error al cargar datos. Intente nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();
  }, [periodo]);

  if (isLoading) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-800 pb-2">
          Compras por Mes
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
          Compras por Mes
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

  if (!datos || datos.length === 0) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-800 pb-2">
          Compras por Mes
        </h2>
        <div className="py-8 text-center text-gray-400">
          No hay datos de compras disponibles para este período
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-800 pb-2">
        Compras por Mes
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Mes
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Valor ($)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Kilos
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {datos.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
              >
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-300">
                  {item.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-red-500 font-medium text-right">
                  {formatCLP(item.valor)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300 text-right">
                  {formatNumber(item.kilos)} kg
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaCompras;
