import React, { useState, useEffect } from "react";
import { Input, Label, Button } from "../../components/ui";
import { useForm } from "react-hook-form";
import { useMovimientos } from "../../context/MovimientosContext.jsx";
import { useClientes } from "../../context/ClientesContext";
import { ClienteModal } from "./ClienteModal";

function AddMovimientosPage({ onClose }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue, // Añade este

    formState: { errors },
  } = useForm();

  const { createMovimiento, errors: movimientosErrors } = useMovimientos();
  const { clientes, loadClientes } = useClientes();

  const valor_kilo = watch("valor_kilo", 0);
  const tipo_movimiento = watch("tipo_movimiento", "");

  const [calculatedValues, setCalculatedValues] = useState({
    iva: 0,
    total: 0,
  });
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);

  const formatCLP = (value) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  useEffect(() => {
    loadClientes();
  }, []);

  useEffect(() => {
    const valorKilo = parseFloat(valor_kilo) || 0;
    const iva = valorKilo * 0.19;
    const total = valorKilo + iva;

    setCalculatedValues({
      iva,
      total,
    });
  }, [valor_kilo]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const movimientoData = {
        ...data,
        valor_kilo: parseFloat(data.valor_kilo),
        ingreso_kilos:
          tipo_movimiento === "Compra"
            ? parseFloat(data.ingreso_kilos || 0)
            : null,
        egreso_kilos:
          tipo_movimiento === "Venta"
            ? parseFloat(data.egreso_kilos || 0)
            : null,
        stock_kilos: parseFloat(data.stock_kilos),
        compra_azucar:
          tipo_movimiento === "Compra" ? parseFloat(data.compra_azucar) : null,
        venta_azucar:
          tipo_movimiento === "Venta" ? parseFloat(data.venta_azucar) : null,
        utilidad_neta:
          tipo_movimiento === "Venta" ? parseFloat(data.utilidad_neta) : null,
        utilidad_total:
          tipo_movimiento === "Venta" ? parseFloat(data.utilidad_total) : null,
      };

      const res = await createMovimiento(movimientoData);
      if (res) {
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  });

  const inputStyles =
    "w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none transition-colors duration-200";
  const selectStyles =
    "w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none transition-colors duration-200";
  const errorStyles = "text-red-400 text-sm mt-1";

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-800">
        <h2 className="text-2xl font-bold text-white">
          Crear Nuevo Movimiento
        </h2>
        {movimientosErrors.map((error, i) => (
          <p key={i} className="text-red-400 text-sm mt-2">
            {error}
          </p>
        ))}
      </div>

      {/* Formulario scrolleable */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <form id="movimientoForm" onSubmit={onSubmit} className="space-y-8">
          {/* Fecha y Factura */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-300">Fecha</Label>
              <Input
                type="date"
                className={inputStyles}
                {...register("fecha", { required: "La fecha es requerida" })}
              />
              {errors.fecha && (
                <span className={errorStyles}>{errors.fecha.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">N° Factura</Label>
              <Input
                type="text"
                className={inputStyles}
                placeholder="Ej: F-001"
                {...register("numero_factura", {
                  required: "El número de factura es requerido",
                })}
              />
              {errors.numero_factura && (
                <span className={errorStyles}>
                  {errors.numero_factura.message}
                </span>
              )}
            </div>
          </div>

          {/* Tipo de Movimiento */}
          <div className="space-y-2">
            <Label className="text-gray-300">Tipo de Movimiento</Label>
            <select
              className={selectStyles}
              {...register("tipo_movimiento", {
                required: "Debe seleccionar un tipo",
              })}
            >
              <option value="">Seleccionar tipo</option>
              <option value="Compra">Compra</option>
              <option value="Venta">Venta</option>
            </select>
            {errors.tipo_movimiento && (
              <span className={errorStyles}>
                {errors.tipo_movimiento.message}
              </span>
            )}
          </div>

          {/* Campos dinámicos basados en tipo de movimiento */}
          {tipo_movimiento && (
            <div className="p-6 bg-gray-800/50 rounded-xl space-y-6">
              <h3 className="text-lg font-medium text-gray-300">
                Detalles de {tipo_movimiento}
              </h3>

              {tipo_movimiento === "Compra" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Compra $</Label>
                    <Input
                      type="number"
                      step="0.01"
                      className={inputStyles}
                      {...register("compra_azucar", {
                        required: "El monto de compra es requerido",
                        min: {
                          value: 0,
                          message: "El valor debe ser mayor a 0",
                        },
                      })}
                    />
                    {errors.compra_azucar && (
                      <span className={errorStyles}>
                        {errors.compra_azucar.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Ingreso Kilos</Label>
                    <Input
                      type="number"
                      step="0.01"
                      className={inputStyles}
                      {...register("ingreso_kilos", {
                        required: "El ingreso de kilos es requerido",
                        min: {
                          value: 0,
                          message: "El valor debe ser mayor a 0",
                        },
                      })}
                    />
                    {errors.ingreso_kilos && (
                      <span className={errorStyles}>
                        {errors.ingreso_kilos.message}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {tipo_movimiento === "Venta" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Venta $</Label>
                    <Input
                      type="number"
                      step="0.01"
                      className={inputStyles}
                      {...register("venta_azucar", {
                        required: "El monto de venta es requerido",
                        min: {
                          value: 0,
                          message: "El valor debe ser mayor a 0",
                        },
                      })}
                    />
                    {errors.venta_azucar && (
                      <span className={errorStyles}>
                        {errors.venta_azucar.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Egreso Kilos</Label>
                    <Input
                      type="number"
                      step="0.01"
                      className={inputStyles}
                      {...register("egreso_kilos", {
                        required: "El egreso de kilos es requerido",
                        min: {
                          value: 0,
                          message: "El valor debe ser mayor a 0",
                        },
                      })}
                    />
                    {errors.egreso_kilos && (
                      <span className={errorStyles}>
                        {errors.egreso_kilos.message}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Campos comunes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-300">Stock Kilos</Label>
              <Input
                type="number"
                step="0.01"
                className={inputStyles}
                {...register("stock_kilos", {
                  required: "El stock es requerido",
                  min: { value: 0, message: "El valor debe ser mayor a 0" },
                })}
              />
              {errors.stock_kilos && (
                <span className={errorStyles}>
                  {errors.stock_kilos.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Valor por Kilo</Label>
              <Input
                type="number"
                step="0.01"
                className={inputStyles}
                {...register("valor_kilo", {
                  required: "El valor por kilo es requerido",
                  min: { value: 0, message: "El valor debe ser mayor a 0" },
                })}
              />
              {errors.valor_kilo && (
                <span className={errorStyles}>{errors.valor_kilo.message}</span>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Cliente</Label>
            <div className="flex gap-2">
              <input
                type="text"
                value={selectedCliente ? selectedCliente.nombre : ""}
                className={`${inputStyles} flex-1`}
                readOnly
                placeholder="Selecciona un cliente..."
              />
              <Button
                type="button"
                onClick={() => setShowClienteModal(true)}
                className="bg-sky-600 hover:bg-sky-700"
              >
                {selectedCliente ? "Cambiar" : "Seleccionar"}
              </Button>
            </div>
            {errors.id_cliente && (
              <span className={errorStyles}>{errors.id_cliente.message}</span>
            )}

            <ClienteModal
              isOpen={showClienteModal}
              onClose={() => setShowClienteModal(false)}
              onSelectCliente={(cliente) => {
                setSelectedCliente(cliente);
                // Actualizar el valor del formulario
                setValue("id_cliente", cliente.id_cliente);
                setShowClienteModal(false);
              }}
            />
          </div>

          {/* Valores Calculados */}
          <div className="bg-gray-800/50 p-6 rounded-xl space-y-4">
            <h3 className="text-lg font-medium text-gray-300">
              Valores Calculados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-300">IVA</Label>
                <div className="px-4 py-2 bg-gray-800 rounded-lg text-white border border-gray-700">
                  {formatCLP(calculatedValues.iva)}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Total con IVA</Label>
                <div className="px-4 py-2 bg-gray-800 rounded-lg text-white border border-gray-700">
                  {formatCLP(calculatedValues.total)}
                </div>
              </div>
            </div>
          </div>

          {tipo_movimiento === "Venta" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-300">Utilidad Neta</Label>
                <Input
                  type="number"
                  step="0.01"
                  className={inputStyles}
                  {...register("utilidad_neta", {
                    required: "La utilidad neta es requerida",
                    min: { value: 0, message: "El valor debe ser mayor a 0" },
                  })}
                />
                {errors.utilidad_neta && (
                  <span className={errorStyles}>
                    {errors.utilidad_neta.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Utilidad Total</Label>
                <Input
                  type="number"
                  step="0.01"
                  className={inputStyles}
                  {...register("utilidad_total", {
                    required: "La utilidad total es requerida",
                    min: { value: 0, message: "El valor debe ser mayor a 0" },
                  })}
                />
                {errors.utilidad_total && (
                  <span className={errorStyles}>
                    {errors.utilidad_total.message}
                  </span>
                )}
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Footer con botones */}
      <div className="px-8 py-6 border-t border-gray-800 bg-gray-900">
        <div className="flex gap-4">
          <Button
            type="submit"
            form="movimientoForm"
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
          >
            Guardar Movimiento
          </Button>
          <Button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddMovimientosPage;
