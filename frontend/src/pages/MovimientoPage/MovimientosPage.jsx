import React, { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import { FaFileExcel } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import AddMovimientosPage from "./AddMovimientosPage";
import { useMovimientos } from "../../context/MovimientosContext";
import { generateMovimientosExcel } from "./ExcelGenerator";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";

function MovimientosPage() {
  const [showAddPanel, setShowAddPanel] = useState(false);
  const {
    movimientos,
    createMovimiento,
    updateMovimiento,
    deleteMovimiento,
    loadMovimientos,
    errors: movimientosErrors,
  } = useMovimientos();
  const handleExcelGeneration = () => {
    generateMovimientosExcel(filteredMovimientos);
  };

  const [showEditPanel, setShowEditPanel] = useState(false);
  const [selectedMovimiento, setSelectedMovimiento] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    movimientoId: null,
    movimientoData: null, // Agregamos este campo para guardar los datos del movimiento
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [tipoFiltro, setTipoFiltro] = useState("todos"); // Añade esto con los otros estados

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
  const handleDeleteClick = (movimiento) => {
    setDeleteConfirmation({
      isOpen: true,
      movimientoId: movimiento.id_movimiento,
      movimientoData: movimiento,
    });
  };
  const handleConfirmDelete = async () => {
    try {
      await deleteMovimiento(deleteConfirmation.movimientoId);
      setDeleteConfirmation({
        isOpen: false,
        movimientoId: null,
        movimientoData: null,
      });
      loadMovimientos(); // Recargar la lista después de eliminar
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({
      isOpen: false,
      movimientoId: null,
      movimientoData: null,
    });
  };

  const formatCLP = (value) => {
    if (typeof value !== "number") return "$ 0";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value) => {
    if (typeof value !== "number") return "0";
    return new Intl.NumberFormat("es-CL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const filteredMovimientos = movimientos
    .filter((movimiento) => {
      console.log("Tipo de movimiento:", movimiento.tipo_movimiento); // Para debug

      // Filtro por tipo de movimiento
      if (tipoFiltro !== "todos" && movimiento.tipo_movimiento !== tipoFiltro) {
        return false;
      }

      // Para ajustes, no filtrar por búsqueda
      if (movimiento.tipo_movimiento === "Ajuste") {
        return true;
      }

      // Filtro por búsqueda solo para Compras y Ventas
      return (
        movimiento.numero_factura
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        movimiento.cliente_nombre
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const groupByDate = (movimientos) => {
    const groups = {};
    movimientos.forEach((movimiento) => {
      if (movimiento.fecha) {
        const date = new Date(movimiento.fecha);
        const dateKey = date.toLocaleDateString("es-CL", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(movimiento);
      }
    });
    return groups;
  };

  return (
    <div className="relative flex">
      {/* Contenido principal */}
      <div
        className={`flex-1 overflow-hidden transition-all duration-300 ${
          showAddPanel || showEditPanel ? "mr-96" : "" // Agregamos showEditPanel a la condición
        }`}
      >
        {!movimientos || movimientos.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
            <h2 className="text-2xl font-semibold text-gray-400">
              No hay movimientos registrados
            </h2>
            <p className="text-gray-500">
              Comienza creando un nuevo movimiento
            </p>
            <button
              onClick={() => setShowAddPanel(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              + Nuevo Movimiento
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Encabezado */}
            <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
              <div className="flex gap-8">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Módulo Movimientos
                  </h1>
                  <div className="flex gap-8 text-gray-400 mt-1">
                    <span>Total movimientos: {movimientos.length}</span>
                    <span className="text-red-400">
                      Total Compras (
                      {
                        movimientos.filter(
                          (m) => m.tipo_movimiento === "Compra"
                        ).length
                      }
                      ):{" "}
                      {formatCLP(
                        movimientos
                          .filter((m) => m.tipo_movimiento === "Compra")
                          .reduce(
                            (sum, m) => sum + parseFloat(m.compra_azucar || 0),
                            0
                          )
                      )}
                    </span>
                    <span className="text-green-400">
                      Total Ventas (
                      {
                        movimientos.filter((m) => m.tipo_movimiento === "Venta")
                          .length
                      }
                      ):{" "}
                      {formatCLP(
                        movimientos
                          .filter((m) => m.tipo_movimiento === "Venta")
                          .reduce(
                            (sum, m) => sum + parseFloat(m.venta_azucar || 0),
                            0
                          )
                      )}
                    </span>
                    <span className="text-yellow-400">
                      Diferencia:{" "}
                      {formatCLP(
                        movimientos
                          .filter((m) => m.tipo_movimiento === "Compra")
                          .reduce(
                            (sum, m) => sum + parseFloat(m.compra_azucar || 0),
                            0
                          ) -
                          movimientos
                            .filter((m) => m.tipo_movimiento === "Venta")
                            .reduce(
                              (sum, m) => sum + parseFloat(m.venta_azucar || 0),
                              0
                            )
                      )}
                    </span>
                    {/* Añadimos el contador de ajustes */}
                    <span className="text-purple-400">
                      Total Ajustes (
                      {
                        movimientos.filter(
                          (m) => m.tipo_movimiento === "Ajuste"
                        ).length
                      }
                      )
                    </span>
                    <span className="text-blue-400">
                      Stock Actual:{" "}
                      {formatNumber(
                        parseFloat(filteredMovimientos[0]?.stock_kilos || "0")
                      )}{" "}
                      kg
                    </span>
                  </div>
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
            {/* Barra de búsqueda y filtros */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 flex items-center gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por número de factura, cliente..."
                    className="w-full bg-gray-800 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <select
                  value={tipoFiltro}
                  onChange={(e) => setTipoFiltro(e.target.value)}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="todos">Todos</option>
                  <option value="Compra">Compras</option>
                  <option value="Venta">Ventas</option>
                  <option value="Ajuste">Ajustes</option>
                </select>
              </div>
              <button
                onClick={handleExcelGeneration}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaFileExcel />
                Generar Excel
              </button>
            </div>

            {/* Tabla con scroll horizontal */}
            <div className="rounded-lg bg-gray-800">
              <div className="overflow-x-auto">
                <table
                  className="w-full text-sm"
                  style={{ minWidth: "1200px" }}
                >
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-700">
                      <th className="p-2 text-left">Fecha</th>
                      <th className="p-2 text-left">Factura</th>
                      <th className="p-2 text-right">Compra</th>
                      <th className="p-2 text-right">Venta</th>
                      <th className="p-2 text-right">Ing. Kilos</th>
                      <th className="p-2 text-right">Egr. Kilos</th>
                      <th className="p-2 text-right">Stock</th>
                      <th className="p-2 text-right">Val. Kilo</th>
                      <th className="p-2 text-right">IVA</th>
                      <th className="p-2 text-right">Total</th>
                      <th className="p-2 text-right">Util. Neta</th>
                      <th className="p-2 text-right">Util. Total</th>
                      <th className="p-2 text-left">Cliente</th>
                      <th className="p-2 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(groupByDate(filteredMovimientos)).map(
                      ([date, movimientos]) => (
                        <React.Fragment key={date}>
                          {/* Encabezado de la fecha */}
                          <tr className="bg-gray-900">
                            <td
                              colSpan="14"
                              className="p-3 text-lg font-semibold text-white border-b border-gray-700"
                            >
                              {date}
                            </td>
                          </tr>
                          {/* Movimientos del día */}
                          {movimientos.map((movimiento) => (
                            <tr
                              key={movimiento.id_movimiento}
                              className={`border-b border-gray-700 ${
                                movimiento.tipo_movimiento === "Compra"
                                  ? "bg-red-950/40 hover:bg-red-900/50"
                                  : movimiento.tipo_movimiento === "Venta"
                                  ? "bg-green-950/40 hover:bg-green-900/50"
                                  : movimiento.tipo_movimiento === "Ajuste"
                                  ? "bg-blue-950/40 hover:bg-blue-900/50" // Color especial para Ajustes
                                  : "hover:bg-gray-700/50"
                              }`}
                            >
                              <td className="p-2 text-gray-200">
                                {new Date(movimiento.fecha).toLocaleDateString(
                                  "es-CL"
                                )}
                              </td>
                              <td className="p-2 text-gray-200">
                                {movimiento.tipo_movimiento === "Ajuste"
                                  ? "Ajuste de Stock"
                                  : movimiento.numero_factura || "-"}
                              </td>
                              <td className="p-2 text-gray-200 text-right">
                                {movimiento.tipo_movimiento === "Compra"
                                  ? formatCLP(
                                      parseFloat(movimiento.compra_azucar)
                                    )
                                  : "-"}
                              </td>
                              <td className="p-2 text-gray-200 text-right">
                                {movimiento.tipo_movimiento === "Venta"
                                  ? formatCLP(
                                      parseFloat(movimiento.venta_azucar)
                                    )
                                  : "-"}
                              </td>
                              <td className="p-2 text-gray-200 text-right">
                                {formatNumber(
                                  parseFloat(movimiento.ingreso_kilos || 0)
                                )}
                              </td>
                              <td className="p-2 text-gray-200 text-right">
                                {formatNumber(
                                  parseFloat(movimiento.egreso_kilos || 0)
                                )}
                              </td>
                              <td className="p-2 text-gray-200 text-right">
                                {movimiento.tipo_movimiento === "Ajuste" ? (
                                  <span className="text-blue-400 font-medium">
                                    {formatNumber(
                                      parseFloat(movimiento.stock_kilos || 0)
                                    )}
                                  </span>
                                ) : (
                                  formatNumber(
                                    parseFloat(movimiento.stock_kilos || 0)
                                  )
                                )}
                              </td>
                              <td className="p-2 text-gray-200 text-right">
                                {movimiento.tipo_movimiento === "Ajuste"
                                  ? "-"
                                  : formatCLP(
                                      parseFloat(movimiento.valor_kilo || 0)
                                    )}
                              </td>
                              <td className="p-2 text-gray-200 text-right">
                                {movimiento.tipo_movimiento === "Ajuste"
                                  ? "-"
                                  : formatCLP(parseFloat(movimiento.iva || 0))}
                              </td>
                              <td className="p-2 text-gray-200 text-right">
                                {movimiento.tipo_movimiento === "Ajuste"
                                  ? "-"
                                  : formatCLP(
                                      parseFloat(movimiento.total || 0)
                                    )}
                              </td>
                              <td className="p-2 text-gray-200 text-right">
                                {movimiento.tipo_movimiento === "Venta"
                                  ? formatCLP(
                                      parseFloat(movimiento.utilidad_neta || 0)
                                    )
                                  : "-"}
                              </td>
                              <td className="p-2 text-gray-200 text-right">
                                {movimiento.tipo_movimiento === "Venta"
                                  ? formatCLP(
                                      parseFloat(movimiento.utilidad_total || 0)
                                    )
                                  : "-"}
                              </td>
                              <td className="p-2 text-gray-200">
                                {movimiento.tipo_movimiento === "Ajuste"
                                  ? "-"
                                  : movimiento.cliente_nombre || "Cliente"}
                              </td>
                              <td className="p-2 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => {
                                      setSelectedMovimiento(movimiento);
                                      setShowEditPanel(true);
                                    }}
                                    className="text-sm text-sky-500 hover:text-sky-400"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteClick(movimiento)
                                    }
                                    className="text-sm text-red-500 hover:text-red-400"
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      )
                    )}
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
        )}
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
                loadMovimientos();
              }}
              stockActual={movimientos[0]?.stock_kilos || 0}
              isFirstMovement={!movimientos || movimientos.length === 0} // Agregamos esta prop
            />
          )}
        </div>
      </div>
      <div
        className={`fixed right-0 top-0 h-screen w-96 bg-gray-900 shadow-lg transform transition-transform duration-300 ${
          showEditPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative h-full">
          <button
            onClick={() => setShowEditPanel(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <IoClose size={24} />
          </button>
          {showEditPanel && selectedMovimiento && (
            <AddMovimientosPage
              onClose={() => {
                setShowEditPanel(false);
                setSelectedMovimiento(null);
                loadMovimientos();
              }}
              isEditing={true}
              movimientoToEdit={selectedMovimiento}
            />
          )}
        </div>
      </div>
      {/* Agregar el AlertDialog aquí */}
      <AlertDialog open={deleteConfirmation.isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              el movimiento
              {deleteConfirmation.movimientoData && (
                <span className="font-medium">
                  {" "}
                  con factura {deleteConfirmation.movimientoData.numero_factura}
                </span>
              )}
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default MovimientosPage;
