// src/pages/EstadisticaPage/EstadisticasPage.jsx
import React, { useState, useEffect } from "react";
import { formatCLP, formatNumber } from "./formatters";
import axios from "../../api/axios";

// Componentes de gráficos
import GraficoCircularComprasVentas from "./GraficoCircularComprasVentas";
import GraficoBarrasComprasVentas from "./GraficoBarrasComprasVentas";
import GraficoClientesTop from "./GraficoClientesTop";
import TablaVentas from "./TablaVentas";
import TablaCompras from "./TablaCompras";
import BalanceInventario from "./BalanceInventario";

function EstadisticasPage() {
  const [periodo, setPeriodo] = useState("anual");
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const cargarResumen = async () => {
      try {
        setLoading(true);
        setError(null);

        // Llamada real a la API para obtener el resumen de estadísticas
        const response = await axios.get("/estadisticas/resumen");
        console.log("Datos cargados:", response.data); // Para depuración

        // Asegurarnos de que los datos existen
        if (response.data) {
          setResumen({
            total_compras: parseInt(response.data.total_compras || 0),
            valor_compras: parseFloat(response.data.valor_compras || 0),
            total_ventas: parseInt(response.data.total_ventas || 0),
            valor_ventas: parseFloat(response.data.valor_ventas || 0),
            diferencia:
              parseFloat(response.data.valor_ventas || 0) -
              parseFloat(response.data.valor_compras || 0),
            stock_actual: parseFloat(response.data.stock_actual || 0),
            total_clientes: parseInt(response.data.total_clientes || 0),
          });
        }
      } catch (err) {
        console.error("Error al cargar resumen:", err);
        setError("Error al cargar datos. Intente nuevamente.");

        // En caso de error, mantener los datos previos o usar valores por defecto
        setResumen(
          (prevData) =>
            prevData || {
              total_compras: 0,
              valor_compras: 0,
              total_ventas: 0,
              valor_ventas: 0,
              diferencia: 0,
              stock_actual: 0,
              total_clientes: 0,
            }
        );
      } finally {
        setLoading(false);
      }
    };

    cargarResumen();
  }, [periodo]);

  const exportarEstadisticas = () => {
    // Esta función podría implementarse para exportar los datos a Excel o PDF
    alert("Esta funcionalidad será implementada próximamente");
  };

  return (
    <div className="relative flex">
      <div className="flex-1 overflow-hidden">
        <div className="space-y-4 p-4">
          {/* Encabezado - Estilo actualizado similar a MovimientosPage */}
          <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Módulo Estadísticas
              </h1>
              <div className="flex gap-8 text-gray-400 mt-1">
                <span>
                  Total Período: <span className="text-white">{periodo}</span>
                </span>
                <span className="text-red-400">
                  Total Compras ({!loading && (resumen?.total_compras || 0)}):{" "}
                  {!loading && formatCLP(resumen?.valor_compras || 0)}
                </span>
                <span className="text-green-400">
                  Total Ventas ({!loading && (resumen?.total_ventas || 0)}):{" "}
                  {!loading && formatCLP(resumen?.valor_ventas || 0)}
                </span>
                <span className="text-yellow-400">
                  Resultado Operativo: {!loading && formatCLP(resumen?.diferencia || 0)}
                </span>
                <span className="text-blue-400">
                  Stock Actual:{" "}
                  {!loading && formatNumber(resumen?.stock_actual || 0)} kg
                </span>
              </div>
            </div>
            <button
              onClick={exportarEstadisticas}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              + Exportar Estadísticas
            </button>
          </div>

          {/* Barra de opciones - Estilo actualizado */}
          <div className="flex items-center justify-between gap-4 bg-gray-800 p-3 rounded-lg">
            <div className="flex-1 flex items-center gap-4">
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="mensual">Mensual</option>
                <option value="trimestral">Trimestral</option>
                <option value="anual">Anual</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-100 p-4 rounded-lg mb-4">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 bg-red-700 hover:bg-red-600 text-white px-4 py-1 rounded-md text-sm"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Sección 1: Resumen y comparativas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Compras vs Ventas (gráfico circular) */}
            <GraficoCircularComprasVentas periodo={periodo} />

            {/* Clientes Top */}
            <GraficoClientesTop periodo={periodo} limite={5} />
          </div>

          {/* Sección 2: Distribución y Tablas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Compras vs Ventas (gráfico de barras) */}
            <GraficoBarrasComprasVentas periodo={periodo} />

            {/* Balance de inventario */}
            <BalanceInventario />
          </div>

          {/* Sección 3: Tablas detalladas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TablaCompras periodo="anual" />
            <TablaVentas periodo="anual" />
          </div>

          {/* Paginación - Se podría implementar si hay muchos datos */}
          <div className="flex justify-between mt-4">
            <button
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
              disabled={true} // Deshabilitado por ahora
            >
              Anterior
            </button>
            <p className="text-gray-400">Página 1 de 1</p>
            <button
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
              disabled={true} // Deshabilitado por ahora
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EstadisticasPage;
