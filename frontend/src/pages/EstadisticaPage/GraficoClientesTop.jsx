// src/pages/EstadisticaPage/GraficoClientesTop.jsx
import React, { useState, useEffect } from "react";
import { formatCLP, formatNumber } from "./formatters";
import axios from "../../api/axios";

const GraficoClientesTop = ({ periodo = "anual" }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("compras");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Llamada a la API para obtener transacciones por cliente (compras y ventas)
        const response = await axios.get(
          `/estadisticas/clientes-transacciones?periodo=${periodo}`
        );

        setData(response.data);
      } catch (err) {
        console.error("Error al cargar datos de clientes:", err);
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
          Transacciones por Cliente
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
          Transacciones por Cliente
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

  if (!data || (!data.compras?.length && !data.ventas?.length)) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-800 pb-2">
          Transacciones por Cliente
        </h2>
        <div className="py-8 text-center text-gray-400">
          No hay datos disponibles para este período
        </div>
      </div>
    );
  }

  const activeData = activeTab === "compras" ? data.compras : data.ventas;
  const totalRegistros = activeData
    ? activeData.reduce(
        (sum, cliente) => sum + (parseInt(cliente.num_transacciones) || 0),
        0
      )
    : 0;
  // Agrega estos console.log antes del return:
  console.log("Datos recibidos:", data);
  console.log("Tab activo:", activeTab);
  console.log("Datos activos:", activeData);
  console.log("Total calculado:", totalRegistros);

  // Función para determinar el color según el índice
  const getBarColor = (index) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-orange-500",
      "bg-teal-500",
      "bg-cyan-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
        <h2 className="text-xl font-semibold text-white">
          Transacciones por Cliente
        </h2>
        <div className="text-sm text-gray-400">
          {totalRegistros.toString()}{" "}
          {totalRegistros === 1 ? "registro" : "registros"} en total
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 mb-6">
        <button
          className={`py-2 px-4 focus:outline-none ${
            activeTab === "compras"
              ? "text-sky-500 border-b-2 border-sky-500 font-medium"
              : "text-gray-500 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("compras")}
        >
          Compras
        </button>
        <button
          className={`py-2 px-4 focus:outline-none ${
            activeTab === "ventas"
              ? "text-sky-500 border-b-2 border-sky-500 font-medium"
              : "text-gray-500 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("ventas")}
        >
          Ventas
        </button>
      </div>

      {/* Gráfico de barras horizontal con scroll */}
      <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
        {activeData.map((cliente, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-md">
            <div className="flex justify-between mb-1">
              <span className="text-white font-medium">{cliente.nombre}</span>
              <span className="text-gray-400 text-sm">{cliente.tipo}</span>
            </div>

            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-gray-700">
                    {cliente.porcentaje}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-gray-400">
                    {formatCLP(cliente.total_monto)}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                <div
                  style={{ width: `${cliente.porcentaje}%` }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getBarColor(
                    index
                  )}`}
                ></div>
              </div>
            </div>

            <div className="flex justify-between text-xs">
              <div className="text-gray-500">
                {cliente.num_transacciones}{" "}
                {cliente.num_transacciones === 1
                  ? "transacción"
                  : "transacciones"}
              </div>
              <div className="text-gray-400">
                {formatNumber(cliente.total_kilos)} kg
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraficoClientesTop;
