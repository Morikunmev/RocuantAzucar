// src/pages/EstadisticaPage/GraficoBarrasComprasVentas.jsx
import React, { useState, useEffect } from "react";
import { formatCLP } from "./formatters";
import axios from "../../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

  // Formatear los datos para Recharts
  const chartData = data.monthly.map((item) => ({
    mes: item.mes,
    compras: item.compras || 0,
    ventas: item.ventas || 0,
  }));

  // Formateo personalizado para el tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-2 border border-gray-700 rounded shadow">
          <p className="font-medium text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCLP(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-800 pb-2">
        Compras vs Ventas
      </h2>

      {/* Gráfico de barras usando Recharts */}
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="mes" stroke="#999" />
            <YAxis
              stroke="#999"
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                return value;
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: "#fff" }} />
            <Bar dataKey="compras" name="Compras" fill="#EF4444" />
            <Bar dataKey="ventas" name="Ventas" fill="#22C55E" />
          </BarChart>
        </ResponsiveContainer>
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
