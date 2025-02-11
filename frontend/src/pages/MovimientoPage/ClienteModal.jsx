// src/pages/MovimientoPage/ClienteModal.jsx
import { useState } from "react";
import { Input, Label, Button } from "../../components/ui";
import { useClientes } from "../../context/ClientesContext";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "../../components/ui/alert-dialog";

export function ClienteModal({ isOpen, onClose, onSelectCliente }) {
  const { clientes, createCliente } = useClientes();
  const [showNewClienteForm, setShowNewClienteForm] = useState(false);
  const [newCliente, setNewCliente] = useState({
    nombre: "",
    tipo: "Empresa",
  });

  const handleCreateCliente = async (e) => {
    e.preventDefault();
    try {
      const clienteCreado = await createCliente(newCliente);
      if (clienteCreado) {
        setShowNewClienteForm(false);
        onSelectCliente(clienteCreado);
        onClose();
      }
    } catch (error) {
      console.error("Error al crear cliente:", error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-gray-800 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {showNewClienteForm ? "Nuevo Cliente" : "Seleccionar Cliente"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            {showNewClienteForm
              ? "Ingresa los datos del nuevo cliente"
              : "Selecciona un cliente existente o crea uno nuevo"}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-4">
          {!showNewClienteForm ? (
            <>
              <div className="grid grid-cols-1 gap-4 max-h-60 overflow-y-auto">
                {clientes.map((cliente) => (
                  <button
                    key={cliente.id_cliente}
                    onClick={() => {
                      onSelectCliente(cliente);
                      onClose();
                    }}
                    className="p-3 text-left bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <div className="font-medium">{cliente.nombre}</div>
                    <div className="text-sm text-gray-400">{cliente.tipo}</div>
                  </button>
                ))}
              </div>
              <Button
                onClick={() => setShowNewClienteForm(true)}
                className="mt-4 w-full bg-green-600 hover:bg-green-700"
              >
                + Crear Nuevo Cliente
              </Button>
            </>
          ) : (
            <form onSubmit={handleCreateCliente} className="space-y-4">
              <div>
                <Label>Nombre</Label>
                <Input
                  type="text"
                  value={newCliente.nombre}
                  onChange={(e) =>
                    setNewCliente({ ...newCliente, nombre: e.target.value })
                  }
                  className="bg-gray-700"
                  required
                />
              </div>
              <div>
                <Label>Tipo</Label>
                <select
                  value={newCliente.tipo}
                  onChange={(e) =>
                    setNewCliente({ ...newCliente, tipo: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600"
                  required
                >
                  <option value="Empresa">Empresa</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => setShowNewClienteForm(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600"
                >
                  Volver
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Guardar Cliente
                </Button>
              </div>
            </form>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onClose}
            className="bg-gray-700 text-white hover:bg-gray-600"
          >
            Cancelar
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
