// context/ClientesContext.jsx
import { createContext, useContext, useState } from "react";
import {
  getClientesRequest,
  createClienteRequest,
  deleteClienteRequest,
  updateClienteRequest,
} from "../api/clientes.api";

const ClientesContext = createContext();

export const useClientes = () => {
  const context = useContext(ClientesContext);
  if (!context) {
    throw new Error("useClientes must be used within a ClientesProvider");
  }
  return context;
};

export function ClientesProvider({ children }) {
  const [clientes, setClientes] = useState([]);
  const [errors, setErrors] = useState([]);

  const loadClientes = async () => {
    try {
      const res = await getClientesRequest();
      setClientes(res.data);
    } catch (error) {
      console.error(error);
      setErrors([error.response?.data?.message || "Error al cargar los clientes"]);
    }
  };

  const createCliente = async (cliente) => {
    try {
      const res = await createClienteRequest(cliente);
      setClientes([...clientes, res.data]);
      return res.data;
    } catch (error) {
      console.error(error);
      setErrors([error.response?.data?.message || "Error al crear el cliente"]);
      return null;
    }
  };

  const deleteCliente = async (id) => {
    try {
      const res = await deleteClienteRequest(id);
      if (res.status === 204) {
        setClientes(clientes.filter(cliente => cliente.id_cliente !== id));
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      setErrors([error.response?.data?.message || "Error al eliminar el cliente"]);
      return false;
    }
  };

  const updateCliente = async (id, cliente) => {
    try {
      const res = await updateClienteRequest(id, cliente);
      setClientes(clientes.map(item => 
        item.id_cliente === id ? res.data : item
      ));
      return res.data;
    } catch (error) {
      console.error(error);
      setErrors([error.response?.data?.message || "Error al actualizar el cliente"]);
      return null;
    }
  };

  return (
    <ClientesContext.Provider value={{
      clientes,
      loadClientes,
      createCliente,
      deleteCliente,
      updateCliente,
      errors,
    }}>
      {children}
    </ClientesContext.Provider>
  );
}