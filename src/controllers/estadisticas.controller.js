// src/controllers/estadisticas.controller.js
import { pool } from "../db.js";

/**
 * Obtiene estadísticas de ventas por período
 */
export const getVentasEstadisticas = async (req, res, next) => {
  try {
    const { periodo = "anual" } = req.query;

    // Determinar el intervalo de tiempo según el período
    let intervalo;
    if (periodo === "mensual") {
      intervalo = "INTERVAL '1 month'";
    } else if (periodo === "trimestral") {
      intervalo = "INTERVAL '3 months'";
    } else {
      // Anual por defecto
      intervalo = "INTERVAL '1 year'";
    }

    const query = `
      SELECT 
        TO_CHAR(fecha, 'Mon') AS nombre,
        SUM(venta_azucar) AS valor,
        SUM(egreso_kilos) AS kilos
      FROM movimientos
      WHERE 
        fecha >= CURRENT_DATE - ${intervalo}
        AND tipo_movimiento = 'Venta'
        AND created_by = $1
      GROUP BY TO_CHAR(fecha, 'Mon'), EXTRACT(MONTH FROM fecha)
      ORDER BY EXTRACT(MONTH FROM fecha)
    `;

    const result = await pool.query(query, [req.userId]);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene estadísticas de compras por período
 */
export const getComprasEstadisticas = async (req, res, next) => {
  try {
    const { periodo = "anual" } = req.query;

    // Determinar el intervalo de tiempo según el período
    let intervalo;
    if (periodo === "mensual") {
      intervalo = "INTERVAL '1 month'";
    } else if (periodo === "trimestral") {
      intervalo = "INTERVAL '3 months'";
    } else {
      // Anual por defecto
      intervalo = "INTERVAL '1 year'";
    }

    const query = `
      SELECT 
        TO_CHAR(fecha, 'Mon') AS nombre,
        SUM(compra_azucar) AS valor,
        SUM(ingreso_kilos) AS kilos
      FROM movimientos
      WHERE 
        fecha >= CURRENT_DATE - ${intervalo}
        AND tipo_movimiento = 'Compra'
        AND created_by = $1
      GROUP BY TO_CHAR(fecha, 'Mon'), EXTRACT(MONTH FROM fecha)
      ORDER BY EXTRACT(MONTH FROM fecha)
    `;

    const result = await pool.query(query, [req.userId]);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene comparativa de compras vs ventas (por mes y totales)
 */
export const getComprasVsVentas = async (req, res, next) => {
  try {
    const { periodo = "anual" } = req.query;

    // Determinar el intervalo de tiempo según el período
    let intervalo;
    if (periodo === "mensual") {
      intervalo = "INTERVAL '1 month'";
    } else if (periodo === "trimestral") {
      intervalo = "INTERVAL '3 months'";
    } else {
      // Anual por defecto
      intervalo = "INTERVAL '1 year'";
    }

    // Datos mensuales para gráficos
    const monthlyQuery = `
      SELECT 
        TO_CHAR(fecha, 'Mon') AS mes,
        EXTRACT(MONTH FROM fecha) AS mes_num,
        SUM(CASE WHEN tipo_movimiento = 'Compra' THEN compra_azucar ELSE 0 END) AS compras,
        SUM(CASE WHEN tipo_movimiento = 'Venta' THEN venta_azucar ELSE 0 END) AS ventas,
        SUM(CASE WHEN tipo_movimiento = 'Compra' THEN ingreso_kilos ELSE 0 END) AS kilos_comprados,
        SUM(CASE WHEN tipo_movimiento = 'Venta' THEN egreso_kilos ELSE 0 END) AS kilos_vendidos
      FROM movimientos
      WHERE 
        fecha >= CURRENT_DATE - ${intervalo}
        AND created_by = $1
        AND tipo_movimiento IN ('Compra', 'Venta')
      GROUP BY TO_CHAR(fecha, 'Mon'), EXTRACT(MONTH FROM fecha)
      ORDER BY mes_num
    `;

    // Datos totales para gráfico circular
    const totalesQuery = `
      SELECT
        SUM(CASE WHEN tipo_movimiento = 'Compra' THEN compra_azucar ELSE 0 END) AS total_compras,
        SUM(CASE WHEN tipo_movimiento = 'Venta' THEN venta_azucar ELSE 0 END) AS total_ventas,
        COUNT(CASE WHEN tipo_movimiento = 'Compra' THEN 1 END) AS num_compras,
        COUNT(CASE WHEN tipo_movimiento = 'Venta' THEN 1 END) AS num_ventas
      FROM movimientos
      WHERE 
        fecha >= CURRENT_DATE - ${intervalo}
        AND created_by = $1
        AND tipo_movimiento IN ('Compra', 'Venta')
    `;

    const [monthlyResult, totalesResult] = await Promise.all([
      pool.query(monthlyQuery, [req.userId]),
      pool.query(totalesQuery, [req.userId]),
    ]);

    // Preparar datos para gráfico circular
    const totales = totalesResult.rows[0];
    const totalCompras = parseFloat(totales.total_compras || 0);
    const totalVentas = parseFloat(totales.total_ventas || 0);
    const montoTotal = totalCompras + totalVentas;

    // Calcular porcentajes
    const porcentajeCompras =
      montoTotal > 0 ? (totalCompras / montoTotal) * 100 : 0;
    const porcentajeVentas =
      montoTotal > 0 ? (totalVentas / montoTotal) * 100 : 0;

    res.json({
      monthly: monthlyResult.rows,
      totales: {
        total_compras: totalCompras,
        total_ventas: totalVentas,
        num_compras: parseInt(totales.num_compras || 0),
        num_ventas: parseInt(totales.num_ventas || 0),
        porcentaje_compras: Math.round(porcentajeCompras),
        porcentaje_ventas: Math.round(porcentajeVentas),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene la distribución de clientes por tipo
 */
export const getDistribucionClientes = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        tipo AS nombre, 
        COUNT(*) AS cantidad,
        COUNT(*) * 100.0 / (
          SELECT COUNT(*) 
          FROM clientes 
          WHERE created_by = $1
        ) AS valor
      FROM clientes
      WHERE created_by = $1
      GROUP BY tipo
      ORDER BY cantidad DESC
    `;

    const result = await pool.query(query, [req.userId]);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene los clientes que más compran
 */
export const getClientesTop = async (req, res, next) => {
  try {
    const { periodo = "anual" } = req.query;
    // Eliminamos el uso del parámetro 'limite' para mostrar todos los clientes

    // Determinar el intervalo de tiempo según el período
    let intervalo;
    if (periodo === "mensual") {
      intervalo = "INTERVAL '1 month'";
    } else if (periodo === "trimestral") {
      intervalo = "INTERVAL '3 months'";
    } else {
      // Anual por defecto
      intervalo = "INTERVAL '1 year'";
    }

    // Query para clientes por monto - sin LIMIT
    const montoQuery = `
      SELECT 
        c.nombre, 
        c.tipo,
        SUM(m.venta_azucar) AS total_compras,
        COUNT(*) AS num_compras,
        ROUND(SUM(m.venta_azucar) * 100.0 / (
          SELECT NULLIF(SUM(venta_azucar), 0)
          FROM movimientos
          WHERE tipo_movimiento = 'Venta'
          AND fecha >= CURRENT_DATE - ${intervalo}
          AND created_by = $1
        )) AS porcentaje
      FROM movimientos m
      JOIN clientes c ON m.id_cliente = c.id_cliente
      WHERE 
        m.tipo_movimiento = 'Venta'
        AND m.fecha >= CURRENT_DATE - ${intervalo}
        AND m.created_by = $1
      GROUP BY c.nombre, c.tipo
      ORDER BY total_compras DESC
    `;

    // Query para clientes por cantidad - sin LIMIT
    const cantidadQuery = `
      SELECT 
        c.nombre, 
        c.tipo,
        SUM(m.egreso_kilos) AS total_kilos,
        COUNT(*) AS num_compras,
        ROUND(SUM(m.egreso_kilos) * 100.0 / (
          SELECT NULLIF(SUM(egreso_kilos), 0)
          FROM movimientos
          WHERE tipo_movimiento = 'Venta'
          AND fecha >= CURRENT_DATE - ${intervalo}
          AND created_by = $1
        )) AS porcentaje
      FROM movimientos m
      JOIN clientes c ON m.id_cliente = c.id_cliente
      WHERE 
        m.tipo_movimiento = 'Venta'
        AND m.fecha >= CURRENT_DATE - ${intervalo}
        AND m.created_by = $1
      GROUP BY c.nombre, c.tipo
      ORDER BY total_kilos DESC
    `;

    const [montoResult, cantidadResult] = await Promise.all([
      pool.query(montoQuery, [req.userId]),
      pool.query(cantidadQuery, [req.userId]),
    ]);

    res.json({
      por_monto: montoResult.rows,
      por_cantidad: cantidadResult.rows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene el balance de inventario (total, entradas y salidas)
 */
export const getBalanceInventario = async (req, res, next) => {
  try {
    // Consulta para obtener el stock actual (último movimiento)
    const stockQuery = `
      SELECT stock_kilos AS total
      FROM movimientos
      WHERE created_by = $1
      ORDER BY id_movimiento DESC
      LIMIT 1
    `;

    // Consulta para obtener porcentajes y montos de entradas y salidas en el último año
    const balanceQuery = `
      SELECT
        COALESCE(SUM(CASE WHEN tipo_movimiento = 'Compra' THEN ingreso_kilos ELSE 0 END), 0) AS kilos_entrada,
        COALESCE(SUM(CASE WHEN tipo_movimiento = 'Venta' THEN egreso_kilos ELSE 0 END), 0) AS kilos_salida,
        COALESCE(SUM(CASE WHEN tipo_movimiento = 'Compra' THEN compra_azucar ELSE 0 END), 0) AS monto_compras,
        COALESCE(SUM(CASE WHEN tipo_movimiento = 'Venta' THEN venta_azucar ELSE 0 END), 0) AS monto_ventas
      FROM movimientos
      WHERE 
        fecha >= CURRENT_DATE - INTERVAL '1 year'
        AND created_by = $1
    `;

    const [stockResult, balanceResult] = await Promise.all([
      pool.query(stockQuery, [req.userId]),
      pool.query(balanceQuery, [req.userId]),
    ]);

    const total = parseFloat(stockResult.rows[0]?.total || 0);
    const kilosEntrada = parseFloat(balanceResult.rows[0]?.kilos_entrada || 0);
    const kilosSalida = parseFloat(balanceResult.rows[0]?.kilos_salida || 0);
    const montoCompras = parseFloat(balanceResult.rows[0]?.monto_compras || 0);
    const montoVentas = parseFloat(balanceResult.rows[0]?.monto_ventas || 0);

    const totalKilos = kilosEntrada + kilosSalida;
    const totalMontos = montoCompras + montoVentas;

    // Calcular porcentajes (evitando división por cero)
    const entradasPct =
      totalKilos > 0 ? Math.round((kilosEntrada / totalKilos) * 100) : 0;
    const salidasPct =
      totalKilos > 0 ? Math.round((kilosSalida / totalKilos) * 100) : 0;
    const comprasPct =
      totalMontos > 0 ? Math.round((montoCompras / totalMontos) * 100) : 0;
    const ventasPct =
      totalMontos > 0 ? Math.round((montoVentas / totalMontos) * 100) : 0;

    res.json({
      stock: {
        total,
        kilos_entrada: kilosEntrada,
        kilos_salida: kilosSalida,
      },
      porcentajes: {
        entradas: entradasPct,
        salidas: salidasPct,
      },
      montos: {
        compras: montoCompras,
        ventas: montoVentas,
        compras_pct: comprasPct,
        ventas_pct: ventasPct,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene resumen general de estadísticas
 */
export const getResumenEstadisticas = async (req, res, next) => {
  try {
    // Consulta mejorada para obtener resumen de compras, ventas, stock
    const query = `
      SELECT
        (SELECT COUNT(*) FROM movimientos WHERE tipo_movimiento = 'Compra' AND created_by = $1) AS total_compras,
        (SELECT COALESCE(SUM(compra_azucar), 0) FROM movimientos WHERE tipo_movimiento = 'Compra' AND created_by = $1) AS valor_compras,
        (SELECT COUNT(*) FROM movimientos WHERE tipo_movimiento = 'Venta' AND created_by = $1) AS total_ventas,
        (SELECT COALESCE(SUM(venta_azucar), 0) FROM movimientos WHERE tipo_movimiento = 'Venta' AND created_by = $1) AS valor_ventas,
        (SELECT stock_kilos FROM movimientos WHERE created_by = $1 ORDER BY created_at DESC, id_movimiento DESC LIMIT 1) AS stock_actual,
        (SELECT COUNT(*) FROM clientes WHERE created_by = $1) AS total_clientes
    `;

    const result = await pool.query(query, [req.userId]);

    // Calcular diferencia (Ventas - Compras)
    const data = result.rows[0];

    // Asegúrate de que los valores numéricos sean tratados correctamente
    data.valor_compras = parseFloat(data.valor_compras || 0);
    data.valor_ventas = parseFloat(data.valor_ventas || 0);
    data.total_compras = parseInt(data.total_compras || 0);
    data.total_ventas = parseInt(data.total_ventas || 0);
    data.stock_actual = parseFloat(data.stock_actual || 0);
    data.total_clientes = parseInt(data.total_clientes || 0);

    // Cálculo de diferencia
    data.diferencia = data.valor_ventas - data.valor_compras;

    // Calcular porcentajes para gráficos
    const totalMonto = data.valor_compras + data.valor_ventas;
    if (totalMonto > 0) {
      data.porcentaje_compras = Math.round(
        (data.valor_compras / totalMonto) * 100
      );
      data.porcentaje_ventas = Math.round(
        (data.valor_ventas / totalMonto) * 100
      );
    } else {
      data.porcentaje_compras = 0;
      data.porcentaje_ventas = 0;
    }

    res.json(data);
  } catch (error) {
    console.error("Error en getResumenEstadisticas:", error);
    next(error);
  }
};

/**
 * Obtiene las transacciones por cliente (compras y ventas separadas)
 */
export const getClientesTransacciones = async (req, res, next) => {
  try {
    const { periodo = "anual" } = req.query;

    // Determinar el intervalo de tiempo según el período
    let intervalo;
    if (periodo === "mensual") {
      intervalo = "INTERVAL '1 month'";
    } else if (periodo === "trimestral") {
      intervalo = "INTERVAL '3 months'";
    } else {
      // Anual por defecto
      intervalo = "INTERVAL '1 year'";
    }

    // Query para clientes con compras
    const comprasQuery = `
      SELECT 
        c.nombre, 
        c.tipo,
        COUNT(*) AS num_transacciones,
        SUM(m.compra_azucar) AS total_monto,
        SUM(m.ingreso_kilos) AS total_kilos,
        ROUND(COUNT(*) * 100.0 / (
          SELECT NULLIF(COUNT(*), 0)
          FROM movimientos
          WHERE tipo_movimiento = 'Compra'
          AND fecha >= CURRENT_DATE - ${intervalo}
          AND created_by = $1
        )) AS porcentaje
      FROM movimientos m
      JOIN clientes c ON m.id_cliente = c.id_cliente
      WHERE 
        m.tipo_movimiento = 'Compra'
        AND m.fecha >= CURRENT_DATE - ${intervalo}
        AND m.created_by = $1
      GROUP BY c.nombre, c.tipo
      ORDER BY num_transacciones DESC
    `;

    // Query para clientes con ventas
    const ventasQuery = `
      SELECT 
        c.nombre, 
        c.tipo,
        COUNT(*) AS num_transacciones,
        SUM(m.venta_azucar) AS total_monto,
        SUM(m.egreso_kilos) AS total_kilos,
        ROUND(COUNT(*) * 100.0 / (
          SELECT NULLIF(COUNT(*), 0)
          FROM movimientos
          WHERE tipo_movimiento = 'Venta'
          AND fecha >= CURRENT_DATE - ${intervalo}
          AND created_by = $1
        )) AS porcentaje
      FROM movimientos m
      JOIN clientes c ON m.id_cliente = c.id_cliente
      WHERE 
        m.tipo_movimiento = 'Venta'
        AND m.fecha >= CURRENT_DATE - ${intervalo}
        AND m.created_by = $1
      GROUP BY c.nombre, c.tipo
      ORDER BY num_transacciones DESC
    `;

    const [comprasResult, ventasResult] = await Promise.all([
      pool.query(comprasQuery, [req.userId]),
      pool.query(ventasQuery, [req.userId]),
    ]);

    res.json({
      compras: comprasResult.rows,
      ventas: ventasResult.rows,
    });
  } catch (error) {
    next(error);
  }
};
