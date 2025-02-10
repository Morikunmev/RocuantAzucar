import React, { useState, useEffect } from "react";
import { Input, Label, Button } from "../../components/ui";
import { useForm } from "react-hook-form";
import { useMovimientos } from "../../context/MovimientosContext.jsx";
import { useClientes } from "../../context/ClientesContext";

function AddMovimientosPage({ onClose }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { createMovimiento, errors: movimientosErrors } = useMovimientos();
  const { clientes, loadClientes } = useClientes();

  // Observar campos para cálculos
  const valor_kilo = watch("valor_kilo", 0);
  const tipo_movimiento = watch("tipo_movimiento", "");

  // Estado para valores calculados
  const [calculatedValues, setCalculatedValues] = useState({
    iva: 0,
    total: 0,
  });

  // Función para formatear en CLP
  const formatCLP = (value) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  // Cargar clientes al montar el componente
  useEffect(() => {
    loadClientes();
  }, []);

  // Calcular IVA y Total
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

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white">
          Crear Nuevo Movimiento
        </h2>
        {movimientosErrors.map((error, i) => (
          <p key={i} className="text-red-500 text-sm mt-2">
            {error}
          </p>
        ))}
      </div>

      {/* Formulario scrolleable */}
      <div className="flex-1 overflow-y-auto px-6">
        <form id="movimientoForm" onSubmit={onSubmit} className="space-y-6">
          {/* Fecha y Factura */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Fecha</Label>
              <Input
                type="date"
                className="bg-gray-900/50"
                {...register("fecha", { required: "La fecha es requerida" })}
              />
              {errors.fecha && (
                <span className="text-red-500 text-sm">
                  {errors.fecha.message}
                </span>
              )}
            </div>
            <div>
              <Label>N° Factura</Label>
              <Input
                type="text"
                className="bg-gray-900/50"
                placeholder="Ej: F-001"
                {...register("numero_factura", {
                  required: "El número de factura es requerido",
                })}
              />
              {errors.numero_factura && (
                <span className="text-red-500 text-sm">
                  {errors.numero_factura.message}
                </span>
              )}
            </div>
          </div>

          {/* Tipo de Movimiento */}
          <div>
            <Label>Tipo de Movimiento</Label>
            <select
              className="w-full px-4 py-2 rounded-lg bg-gray-900/50 text-white border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
              {...register("tipo_movimiento", {
                required: "Debe seleccionar un tipo",
              })}
            >
              <option value="">Seleccionar tipo</option>
              <option value="Compra">Compra</option>
              <option value="Venta">Venta</option>
            </select>
            {errors.tipo_movimiento && (
              <span className="text-red-500 text-sm">
                {errors.tipo_movimiento.message}
              </span>
            )}
          </div>

          {/* Campos específicos de Compra */}
          {tipo_movimiento === "Compra" && (
            <>
              <div>
                <Label>Compra $</Label>
                <Input
                  type="number"
                  step="0.01"
                  className="bg-gray-900/50"
                  {...register("compra_azucar", {
                    required: "El monto de compra es requerido",
                    min: { value: 0, message: "El valor debe ser mayor a 0" },
                  })}
                />
                {errors.compra_azucar && (
                  <span className="text-red-500 text-sm">
                    {errors.compra_azucar.message}
                  </span>
                )}
              </div>
              <div>
                <Label>Ingreso Kilos</Label>
                <Input
                  type="number"
                  step="0.01"
                  className="bg-gray-900/50"
                  {...register("ingreso_kilos", {
                    required: "El ingreso de kilos es requerido",
                    min: { value: 0, message: "El valor debe ser mayor a 0" },
                  })}
                />
                {errors.ingreso_kilos && (
                  <span className="text-red-500 text-sm">
                    {errors.ingreso_kilos.message}
                  </span>
                )}
              </div>
            </>
          )}

          {/* Campos específicos de Venta */}
          {tipo_movimiento === "Venta" && (
            <>
              <div>
                <Label>Venta $</Label>
                <Input
                  type="number"
                  step="0.01"
                  className="bg-gray-900/50"
                  {...register("venta_azucar", {
                    required: "El monto de venta es requerido",
                    min: { value: 0, message: "El valor debe ser mayor a 0" },
                  })}
                />
                {errors.venta_azucar && (
                  <span className="text-red-500 text-sm">
                    {errors.venta_azucar.message}
                  </span>
                )}
              </div>
              <div>
                <Label>Egreso Kilos</Label>
                <Input
                  type="number"
                  step="0.01"
                  className="bg-gray-900/50"
                  {...register("egreso_kilos", {
                    required: "El egreso de kilos es requerido",
                    min: { value: 0, message: "El valor debe ser mayor a 0" },
                  })}
                />
                {errors.egreso_kilos && (
                  <span className="text-red-500 text-sm">
                    {errors.egreso_kilos.message}
                  </span>
                )}
              </div>
            </>
          )}

          {/* Campos comunes */}
          <div>
            <Label>Stock Kilos</Label>
            <Input
              type="number"
              step="0.01"
              className="bg-gray-900/50"
              {...register("stock_kilos", {
                required: "El stock es requerido",
                min: { value: 0, message: "El valor debe ser mayor a 0" },
              })}
            />
            {errors.stock_kilos && (
              <span className="text-red-500 text-sm">
                {errors.stock_kilos.message}
              </span>
            )}
          </div>

          <div>
            <Label>Valor por Kilo</Label>
            <Input
              type="number"
              step="0.01"
              className="bg-gray-900/50"
              {...register("valor_kilo", {
                required: "El valor por kilo es requerido",
                min: { value: 0, message: "El valor debe ser mayor a 0" },
              })}
            />
            {errors.valor_kilo && (
              <span className="text-red-500 text-sm">
                {errors.valor_kilo.message}
              </span>
            )}
          </div>

          <div>
            <Label>Cliente</Label>
            <select
              className="w-full px-4 py-2 rounded-lg bg-gray-900/50 text-white border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
              {...register("id_cliente", {
                required: "Debe seleccionar un cliente",
              })}
            >
              <option value="">Seleccionar cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id_cliente} value={cliente.id_cliente}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
            {errors.id_cliente && (
              <span className="text-red-500 text-sm">
                {errors.id_cliente.message}
              </span>
            )}
          </div>

          {/* Valores Calculados */}
          <div className="bg-gray-800/50 p-4 rounded-lg space-y-4">
            <h3 className="text-gray-400 font-medium">Valores Calculados</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>IVA</Label>
                <div className="px-4 py-2 bg-gray-900/30 rounded-lg text-white">
                  {formatCLP(calculatedValues.iva)}
                </div>
              </div>
              <div>
                <Label>Total con IVA</Label>
                <div className="px-4 py-2 bg-gray-900/30 rounded-lg text-white">
                  {formatCLP(calculatedValues.total)}
                </div>
              </div>
            </div>
          </div>
          {tipo_movimiento === "Venta" && (
            <>
              <div>
                <Label>Utilidad Neta</Label>
                <Input
                  type="number"
                  step="0.01"
                  className="bg-gray-900/50"
                  {...register("utilidad_neta", {
                    required: "La utilidad neta es requerida",
                    min: { value: 0, message: "El valor debe ser mayor a 0" },
                  })}
                />
                {errors.utilidad_neta && (
                  <span className="text-red-500 text-sm">
                    {errors.utilidad_neta.message}
                  </span>
                )}
              </div>
              <div>
                <Label>Utilidad Total</Label>
                <Input
                  type="number"
                  step="0.01"
                  className="bg-gray-900/50"
                  {...register("utilidad_total", {
                    required: "La utilidad total es requerida",
                    min: { value: 0, message: "El valor debe ser mayor a 0" },
                  })}
                />
                {errors.utilidad_total && (
                  <span className="text-red-500 text-sm">
                    {errors.utilidad_total.message}
                  </span>
                )}
              </div>
            </>
          )}
        </form>
      </div>

      {/* Footer con botones */}
      <div className="p-6 border-t border-gray-700">
        <div className="flex gap-4">
          <Button
            type="submit"
            form="movimientoForm"
            className="bg-green-600 hover:bg-green-700"
          >
            Guardar Movimiento
          </Button>
          <Button
            type="button"
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddMovimientosPage;
