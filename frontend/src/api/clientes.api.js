// api/clientes.api.js
import client from "./axios";

export const getClientesRequest = () => client.get("/clientes");
export const createClienteRequest = (cliente) =>
  client.post("/clientes", cliente);
export const deleteClienteRequest = (id) => client.delete(`/clientes/${id}`);
export const updateClienteRequest = (id, cliente) =>
  client.put(`/clientes/${id}`, cliente);
