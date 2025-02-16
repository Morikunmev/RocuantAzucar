import * as XLSX from 'xlsx';

export const generateMovimientosExcel = (movimientos) => {
  // Preparar los datos para el Excel
  const excelData = movimientos.map(movimiento => ({
    Fecha: new Date(movimiento.fecha).toLocaleDateString('es-CL'),
    'Nº Factura': movimiento.numero_factura || '-',
    'Tipo': movimiento.tipo_movimiento,
    Cliente: movimiento.cliente_nombre || '-',
    Compra: movimiento.tipo_movimiento === "Compra" ? parseFloat(movimiento.compra_azucar) : 0,
    Venta: movimiento.tipo_movimiento === "Venta" ? parseFloat(movimiento.venta_azucar) : 0,
    'Ingreso Kilos': parseFloat(movimiento.ingreso_kilos || 0),
    'Egreso Kilos': parseFloat(movimiento.egreso_kilos || 0),
    'Stock Kilos': parseFloat(movimiento.stock_kilos || 0),
    'Valor Kilo': parseFloat(movimiento.valor_kilo || 0),
    'IVA': parseFloat(movimiento.iva || 0),
    'Total': parseFloat(movimiento.total || 0),
    'Utilidad Neta': movimiento.tipo_movimiento === "Venta" ? parseFloat(movimiento.utilidad_neta || 0) : 0,
    'Utilidad Total': movimiento.tipo_movimiento === "Venta" ? parseFloat(movimiento.utilidad_total || 0) : 0
  }));

  // Crear el libro de trabajo y la hoja
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Ajustar el ancho de las columnas
  const colWidths = [
    { wch: 15 }, // Fecha
    { wch: 12 }, // Nº Factura
    { wch: 10 }, // Tipo
    { wch: 20 }, // Cliente
    { wch: 15 }, // Compra
    { wch: 15 }, // Venta
    { wch: 12 }, // Ingreso Kilos
    { wch: 12 }, // Egreso Kilos
    { wch: 12 }, // Stock Kilos
    { wch: 12 }, // Valor Kilo
    { wch: 12 }, // IVA
    { wch: 15 }, // Total
    { wch: 15 }, // Utilidad Neta
    { wch: 15 }, // Utilidad Total
  ];
  ws['!cols'] = colWidths;

  // Añadir la hoja al libro
  XLSX.utils.book_append_sheet(wb, ws, "Movimientos");

  // Generar el archivo y descargarlo
  const fecha = new Date().toLocaleDateString('es-CL').replace(/\//g, '-');
  XLSX.writeFile(wb, `Movimientos_${fecha}.xlsx`);
};