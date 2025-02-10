import React, { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import { FaFileExcel } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import AddMovimientosPage from "./AddMovimientosPage";
import { useMovimientos } from "../../context/MovimientosContext";

function MovimientosPage() {
  const [showAddPanel, setShowAddPanel] = useState(false);
  const { movimientos, loadMovimientos, deleteMovimiento } = useMovimientos();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadMovimientos();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteMovimiento(id);
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // Función para formatear valores monetarios en CLP
  const formatCLP = (value) => {
    if (typeof value !== "number") return "$ 0";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Función para formatear números no monetarios
  const formatNumber = (value) => {
    if (typeof value !== "number") return "0";
    return new Intl.NumberFormat("es-CL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const filteredMovimientos = movimientos.filter(
    (movimiento) =>
      movimiento.numero_factura
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      movimiento.cliente_nombre
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  if (!movimientos || movimientos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <h2 className="text-2xl font-semibold text-gray-400">
          No hay movimientos registrados
        </h2>
        <p className="text-gray-500">Comienza creando un nuevo movimiento</p>
        <button
          onClick={() => setShowAddPanel(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          + Nuevo Movimiento
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex">
      {/* Contenido principal */}
      <div
        className={`flex-1 overflow-hidden transition-all duration-300 ${
          showAddPanel ? "mr-96" : ""
        }`}
      >
        <div className="space-y-4">
          {/* Encabezado */}
          <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Módulo Movimientos
              </h1>
              <div className="text-gray-400 mt-1">
                Total movimientos: {movimientos.length}
              </div>
            </div>
            <button
              onClick={() => setShowAddPanel(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              + Nuevo Movimiento
            </button>
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por número de factura, cliente..."
                className="w-full bg-gray-800 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <FaFileExcel />
              Generar Excel
            </button>
          </div>

          {/* Tabla con scroll horizontal */}
          <div className="rounded-lg bg-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: "1500px" }}>
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="p-4 text-left">Fecha</th>
                    <th className="p-4 text-left">Factura</th>
                    <th className="p-4 text-right">Compra</th>
                    <th className="p-4 text-right">Venta</th>
                    <th className="p-4 text-right">Ingreso Kilos</th>
                    <th className="p-4 text-right">Egreso Kilos</th>
                    <th className="p-4 text-right">Stock</th>
                    <th className="p-4 text-right">Valor Kilo</th>
                    <th className="p-4 text-right">IVA</th>
                    <th className="p-4 text-right">Total</th>
                    <th className="p-4 text-right">Utilidad Neta</th>
                    <th className="p-4 text-right">Utilidad Total</th>
                    <th className="p-4 text-left">Cliente</th>
                    <th className="p-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMovimientos.map((movimiento) => (
                    <tr
                      key={movimiento.id_movimiento}
                      className="border-b border-gray-700 hover:bg-gray-700/50"
                    >
                      <td className="p-4 text-white">
                        {movimiento.fecha
                          ? new Date(movimiento.fecha).toLocaleDateString(
                              "es-CL"
                            )
                          : "-"}
                      </td>
                      <td className="p-4 text-white">
                        {movimiento.numero_factura || "-"}
                      </td>
                      <td className="p-4 text-white text-right">
                        {movimiento.tipo_movimiento === "Compra"
                          ? formatCLP(
                              movimiento.valor_kilo * movimiento.ingreso_kilos
                            )
                          : "-"}
                      </td>
                      <td className="p-4 text-white text-right">
                        {movimiento.tipo_movimiento === "Venta"
                          ? formatCLP(
                              movimiento.valor_kilo * movimiento.egreso_kilos
                            )
                          : "-"}
                      </td>
                      <td className="p-4 text-white text-right">
                        {formatNumber(movimiento.ingreso_kilos)}
                      </td>
                      <td className="p-4 text-white text-right">
                        {formatNumber(movimiento.egreso_kilos)}
                      </td>
                      <td className="p-4 text-white text-right">
                        {formatNumber(movimiento.stock_kilos)}
                      </td>
                      <td className="p-4 text-white text-right">
                        {formatCLP(movimiento.valor_kilo)}
                      </td>
                      <td className="p-4 text-white text-right">
                        {formatCLP(movimiento.iva)}
                      </td>
                      <td className="p-4 text-white text-right">
                        {formatCLP(movimiento.total)}
                      </td>
                      <td className="p-4 text-white text-right">
                        {formatCLP(movimiento.utilidad_neta)}
                      </td>
                      <td className="p-4 text-white text-right">
                        {formatCLP(movimiento.utilidad_total)}
                      </td>
                      <td className="p-4 text-white">
                        {movimiento.cliente_nombre || "-"}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              setShowEditPanel(movimiento.id_movimiento)
                            }
                            className="text-sky-500 hover:text-sky-400"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(movimiento.id_movimiento)
                            }
                            className="text-red-500 hover:text-red-400"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginación */}
          <div className="flex justify-between items-center">
            <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
              Anterior
            </button>
            <span className="text-white">Página 1 de 1</span>
            <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Panel lateral derecho para añadir movimiento */}
      <div
        className={`fixed right-0 top-0 h-screen w-96 bg-gray-900 shadow-lg transform transition-transform duration-300 ${
          showAddPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative h-full">
          <button
            onClick={() => setShowAddPanel(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <IoClose size={24} />
          </button>

          {showAddPanel && (
            <AddMovimientosPage
              onClose={() => {
                setShowAddPanel(false);
                loadMovimientos(); // Recargar datos después de añadir
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MovimientosPage;
