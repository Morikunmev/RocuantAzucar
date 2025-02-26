// src/pages/EstadisticaPage/GraficoCircularComprasVentas.jsx
import React, { useState, useEffect } from "react";
import { formatCLP } from "./formatters";
import axios from "../../api/axios";

const GraficoCircularComprasVentas = ({ periodo = "anual" }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Llamada real a la API
        const response = await axios.get(
          `/estadisticas/compras-vs-ventas?periodo=${periodo}`
        );

        setData(response.data);
      } catch (err) {
        console.error("Error al cargar datos de compras vs ventas:", err);
        setError("Error al cargar datos. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [periodo]);

  if (loading) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-800 pb-2">
          Compras vs Ventas
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
          Compras vs Ventas
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

  if (
    !data ||
    (!data.totales?.porcentaje_compras && !data.totales?.porcentaje_ventas)
  ) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-800 pb-2">
          Compras vs Ventas
        </h2>
        <div className="py-8 text-center text-gray-400">
          No hay datos disponibles para este período
        </div>
      </div>
    );
  }

  const { totales } = data;
  const totalMonto = totales.total_compras + totales.total_ventas;

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-800 pb-2">
        Compras vs Ventas
      </h2>

      <div className="grid grid-cols-1 gap-6">
        {/* Gráfico circular */}
        <div className="flex justify-center">
          <div className="relative w-64 h-64">
            {/* Círculo base */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Sector para compras */}
              {totales.porcentaje_compras > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#EF4444"
                  strokeWidth="20"
                  strokeDasharray={`${totales.porcentaje_compras * 2.51} 251`}
                  transform="rotate(-90 50 50)"
                />
              )}

              {/* Sector para ventas */}
              {totales.porcentaje_ventas > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#22C55E"
                  strokeWidth="20"
                  strokeDasharray={`${totales.porcentaje_ventas * 2.51} 251`}
                  strokeDashoffset={`${-totales.porcentaje_compras * 2.51}`}
                  transform="rotate(-90 50 50)"
                />
              )}
            </svg>

            {/* Texto central */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 rounded-full w-32 h-32 m-auto">
              <span className="text-sm text-gray-400">Total</span>
              <span className="text-xl font-bold text-white">
                {formatCLP(totalMonto)}
              </span>
            </div>
          </div>
        </div>

        {/* Leyenda y detalles */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-4 rounded-md">
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
              <span className="text-white font-medium">Compras</span>
            </div>
            <div className="text-3xl font-bold text-red-500 mb-1">
              {totales.porcentaje_compras}%
            </div>
            <div className="text-gray-400 text-sm">
              {formatCLP(totales.total_compras)}
            </div>
            <div className="text-gray-500 text-xs mt-1">
              {totales.num_compras} operaciones
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-md">
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span className="text-white font-medium">Ventas</span>
            </div>
            <div className="text-3xl font-bold text-green-500 mb-1">
              {totales.porcentaje_ventas}%
            </div>
            <div className="text-gray-400 text-sm">
              {formatCLP(totales.total_ventas)}
            </div>
            <div className="text-gray-500 text-xs mt-1">
              {totales.num_ventas} operaciones
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraficoCircularComprasVentas;
