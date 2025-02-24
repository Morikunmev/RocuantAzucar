import { createContext, useContext, useState } from "react";
import {
  getAllMovimientosRequest,
  deleteMovimientoRequest,
  createMovimientoRequest,
  getMovimientoRequest,
  updateMovimientoRequest,
} from "../api/movimientos.api";

const MovimientosContext = createContext();

export const useMovimientos = () => {
  const context = useContext(MovimientosContext);
  if (!context) {
    throw new Error("useMovimientos must be used within a MovimientosProvider");
  }
  return context;
};

export function MovimientosProvider({ children }) {
  const [movimientos, setMovimientos] = useState([]);
  const [errors, setErrors] = useState([]);

  // Create a new movimiento
  const createMovimiento = async (movimiento) => {
    try {
      // Log the incoming data
      console.log("Attempting to create movimiento with data:", movimiento);

      // Ensure tipo_movimiento is present
      if (!movimiento.tipo_movimiento) {
        console.error("tipo_movimiento is missing from the request data");
        setErrors(["El tipo de movimiento es requerido"]);
        return null;
      }

      let formattedData;

      // Handle Ajuste type separately
      if (movimiento.tipo_movimiento === "Ajuste") {
        formattedData = {
          fecha: movimiento.fecha,
          tipo_movimiento: "Ajuste",
          stock_kilos: Number(movimiento.stock_kilos),
        };
      } else {
        // Format the data for Compra/Venta
        formattedData = {
          fecha: movimiento.fecha,
          numero_factura: movimiento.numero_factura,
          id_cliente: Number(movimiento.id_cliente),
          tipo_movimiento: movimiento.tipo_movimiento,
          valor_kilo: parseFloat(movimiento.valor_kilo),
          stock_kilos: parseFloat(movimiento.stock_kilos),
          ingreso_kilos:
            movimiento.tipo_movimiento === "Compra"
              ? parseFloat(movimiento.ingreso_kilos)
              : null,
          egreso_kilos:
            movimiento.tipo_movimiento === "Venta"
              ? parseFloat(movimiento.egreso_kilos)
              : null,
          compra_azucar:
            movimiento.tipo_movimiento === "Compra"
              ? parseFloat(movimiento.compra_azucar)
              : null,
          venta_azucar:
            movimiento.tipo_movimiento === "Venta"
              ? parseFloat(movimiento.venta_azucar)
              : null,
          utilidad_neta:
            movimiento.tipo_movimiento === "Venta"
              ? parseFloat(movimiento.utilidad_neta)
              : null,
          utilidad_total:
            movimiento.tipo_movimiento === "Venta"
              ? parseFloat(movimiento.utilidad_total)
              : null,
        };
      }

      // Log the formatted data
      console.log("Sending formatted data:", formattedData);

      const res = await createMovimientoRequest(formattedData);
      console.log("Response received:", res);

      setMovimientos([...movimientos, res.data]);
      return res.data;
    } catch (error) {
      console.error("Detailed error:", {
        message: error.message,
        response: error.response?.data,
        request: error.request,
        config: error.config,
      });

      setErrors([
        error.response?.data?.message ||
          error.response?.data ||
          "Error al crear el movimiento",
      ]);
      return null;
    }
  };
  const clearErrors = () => {
    setErrors([]); // Cambiado de setMovimientosErrors a setErrors
  };

  // Rest of the context code remains the same
  const loadMovimientos = async () => {
    try {
      const res = await getAllMovimientosRequest();
      setMovimientos(res.data);
    } catch (error) {
      console.error(error);
      setErrors([
        error.response?.data?.message || "Error al cargar los movimientos",
      ]);
    }
  };

  const deleteMovimiento = async (id) => {
    try {
      const res = await deleteMovimientoRequest(id);
      if (res.status === 204) {
        setMovimientos(
          movimientos.filter((movimiento) => movimiento.id_movimiento !== id)
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      setErrors([
        error.response?.data?.message || "Error al eliminar el movimiento",
      ]);
      return false;
    }
  };

  const updateMovimiento = async (id, movimiento) => {
    try {
      const res = await updateMovimientoRequest(id, movimiento);
      setMovimientos(
        movimientos.map((item) => (item.id_movimiento === id ? res.data : item))
      );
      return res.data;
    } catch (error) {
      console.error(error);
      setErrors([
        error.response?.data?.message || "Error al actualizar el movimiento",
      ]);
      return null;
    }
  };

  return (
    <MovimientosContext.Provider
      value={{
        movimientos,
        loadMovimientos,
        createMovimiento,
        deleteMovimiento,
        updateMovimiento,
        errors,
        clearErrors, // Agregamos clearErrors al value
      }}
    >
      {children}
    </MovimientosContext.Provider>
  );
}
