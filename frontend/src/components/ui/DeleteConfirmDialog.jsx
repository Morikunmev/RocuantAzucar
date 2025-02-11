// src/components/ui/DeleteConfirmDialog.jsx
import { Button } from "./Button.jsx";

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold text-white mb-4">
          {title || "Confirmar Eliminación"}
        </h3>
        <p className="text-gray-300 mb-6">
          {message ||
            "¿Estás seguro que deseas eliminar este elemento? Esta acción no se puede deshacer."}
        </p>
        <div className="flex justify-end gap-4">
          <Button onClick={onClose} className="bg-gray-700 hover:bg-gray-600">
            Cancelar
          </Button>
          <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
}
