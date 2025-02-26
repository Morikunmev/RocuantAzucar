// src/pages/EstadisticaPage/GraficoBarrasComprasVentas.jsx
import React, { useState, useEffect } from "react";
import { formatCLP } from "./formatters";
import axios from "../../api/axios";

const GraficoBarrasComprasVentas = ({ periodo = "anual" }) => {
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
        console.error("Error al cargar datos:", err);
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

  if (!data || !data.monthly || data.monthly.length === 0) {
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

  // Encontrar el valor máximo para escalar el gráfico
  const maxValue = data.monthly.reduce((max, item) => {
    return Math.max(max, item.compras || 0, item.ventas || 0);
  }, 0);

  // Altura máxima de las barras en píxeles
  const maxBarHeight = 200;

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-800 pb-2">
        Compras vs Ventas
      </h2>

      {/* Gráfico de barras */}
      <div className="mt-6">
        <div className="relative h-64">
          {/* Eje Y - Valores */}
          <div className="absolute top-0 bottom-0 left-0 w-16 flex flex-col justify-between text-xs text-gray-400">
            <div>{formatCLP(maxValue)}</div>
            <div>{formatCLP(maxValue * 0.75)}</div>
            <div>{formatCLP(maxValue * 0.5)}</div>
            <div>{formatCLP(maxValue * 0.25)}</div>
            <div>{formatCLP(0)}</div>
          </div>

          {/* Líneas de referencia horizontales */}
          <div className="absolute left-16 right-0 top-0 bottom-0 flex flex-col justify-between">
            <div className="border-t border-gray-700 h-0"></div>
            <div className="border-t border-gray-700 h-0"></div>
            <div className="border-t border-gray-700 h-0"></div>
            <div className="border-t border-gray-700 h-0"></div>
            <div className="border-t border-gray-700 h-0"></div>
          </div>

          {/* Contenedor de barras */}
          <div className="absolute left-16 right-0 top-0 bottom-0 flex items-end justify-around">
            {data.monthly.map((item, index) => (
              <div
                key={index}
                className="flex items-end justify-center space-x-2"
              >
                {/* Barra de compras */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-10 bg-red-500 rounded-t"
                    style={{
                      height:
                        maxValue > 0
                          ? `${
                              ((item.compras || 0) / maxValue) * maxBarHeight
                            }px`
                          : "0px",
                    }}
                  ></div>
                  <div className="text-xs text-gray-400 mt-2">{item.mes}</div>
                </div>

                {/* Barra de ventas */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-10 bg-green-500 rounded-t"
                    style={{
                      height:
                        maxValue > 0
                          ? `${
                              ((item.ventas || 0) / maxValue) * maxBarHeight
                            }px`
                          : "0px",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leyenda */}
        <div className="flex justify-center mt-4 space-x-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span className="text-sm text-gray-300">Compras</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span className="text-sm text-gray-300">Ventas</span>
          </div>
        </div>
      </div>

      {/* Resumen de totales */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-800 p-4 rounded-md">
          <h3 className="text-lg font-medium text-gray-300 mb-2">
            Total Compras
          </h3>
          <p className="text-2xl font-bold text-red-500">
            {formatCLP(data.totales.total_compras || 0)}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-md">
          <h3 className="text-lg font-medium text-gray-300 mb-2">
            Total Ventas
          </h3>
          <p className="text-2xl font-bold text-green-500">
            {formatCLP(data.totales.total_ventas || 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GraficoBarrasComprasVentas;
