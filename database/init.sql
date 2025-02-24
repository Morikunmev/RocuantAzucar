/*
 * Sistema de Gestión de Inventario de Azúcar
 * Este esquema maneja usuarios, clientes y movimientos de inventario
 * Incluye funcionalidades para compras, ventas y ajustes de stock
 */

-- Tabla de Usuarios (Administración de accesos al sistema)
CREATE TABLE users (
   id SERIAL PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   password VARCHAR(255) NOT NULL,        -- Almacena contraseña hasheada
   email VARCHAR(255) UNIQUE NOT NULL,    -- Email único para cada usuario
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   gravatar VARCHAR(255)                  -- Avatar del usuario
);

-- Tabla de Clientes (Registro de clientes para compras y ventas)
CREATE TABLE clientes (
    id_cliente SERIAL PRIMARY KEY,
    nombre VARCHAR(100),                  -- Nombre del cliente
    tipo VARCHAR(50),                     -- Tipo: Mayorista, Empresa, Personal, etc.
    created_by INTEGER REFERENCES users(id), -- Usuario que creó el registro
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Movimientos (Registro de transacciones de inventario)
CREATE TABLE movimientos (
    -- Campos de identificación y referencia
    id_movimiento SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    numero_factura VARCHAR(20) NOT NULL UNIQUE,  -- Número único de factura/documento
    id_cliente INTEGER REFERENCES clientes(id_cliente),
    
    -- Tipo de operación
    tipo_movimiento VARCHAR(20) NOT NULL,        -- Valores permitidos: 'Compra', 'Venta', 'Ajuste'
    
    -- Campos de montos
    compra_azucar DECIMAL(12,2),                 -- Monto total de compra
    venta_azucar DECIMAL(12,2),                  -- Monto total de venta
    valor_kilo DECIMAL(10,2),                    -- Precio por kilo
    
    -- Campos de cantidades
    ingreso_kilos DECIMAL(10,2),                 -- Cantidad de kilos ingresados (compras)
    egreso_kilos DECIMAL(10,2),                  -- Cantidad de kilos vendidos (ventas)
    stock_kilos DECIMAL(10,2),                   -- Stock actual después del movimiento
    
    -- Campos calculados automáticamente
    iva DECIMAL(10,2) GENERATED ALWAYS AS (valor_kilo * 0.19) STORED,
    total DECIMAL(12,2) GENERATED ALWAYS AS (valor_kilo + (valor_kilo * 0.19)) STORED,
    utilidad_neta DECIMAL(12,2),                 -- Utilidad sin IVA
    utilidad_total DECIMAL(12,2),                -- Utilidad con IVA
    
    -- Campos de auditoría
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*
 * Función Trigger: calcular_montos_y_utilidad
 * Propósito: Maneja automáticamente los cálculos y validaciones para cada tipo de movimiento
 * Tipos de movimiento soportados:
 * - Compra: Calcula montos de compra y aumenta stock
 * - Venta: Calcula montos de venta y reduce stock
 * - Ajuste: Permite modificación directa del stock sin afectar otros campos
 */
CREATE OR REPLACE FUNCTION calcular_montos_y_utilidad()
RETURNS TRIGGER AS $$
DECLARE
    ultimo_stock DECIMAL(10,2);
BEGIN
    -- Obtener el último stock registrado
    SELECT stock_kilos
    INTO ultimo_stock
    FROM movimientos
    WHERE id_movimiento = (
        SELECT MAX(id_movimiento)
        FROM movimientos
    );

    -- Inicializar stock en 0 si no hay registros previos
    IF ultimo_stock IS NULL THEN
        ultimo_stock := 0;
    END IF;

    -- Lógica específica para cada tipo de movimiento
    CASE NEW.tipo_movimiento
        WHEN 'Compra' THEN
            -- Ya no calculamos compra_azucar, respetamos el valor que viene
            -- NEW.compra_azucar := NEW.valor_kilo * NEW.ingreso_kilos; -- Quitamos esta línea
            NEW.venta_azucar := NULL;
            NEW.utilidad_neta := NULL;
            NEW.utilidad_total := NULL;
            NEW.stock_kilos := ultimo_stock + NEW.ingreso_kilos;
            
        WHEN 'Venta' THEN
            -- Validación de stock suficiente
            IF NEW.egreso_kilos > ultimo_stock THEN
                RAISE EXCEPTION 'Stock insuficiente. Actual: %, Solicitado: %', 
                    ultimo_stock, NEW.egreso_kilos;
            END IF;
            -- Ya no calculamos venta_azucar, respetamos el valor que viene
            -- NEW.venta_azucar := NEW.valor_kilo * NEW.egreso_kilos; -- Quitamos esta línea
            NEW.compra_azucar := NULL;
            NEW.stock_kilos := ultimo_stock - NEW.egreso_kilos;
            
        WHEN 'Ajuste' THEN
            -- Limpieza de campos para ajustes de stock
            NEW.compra_azucar := NULL;
            NEW.venta_azucar := NULL;
            NEW.utilidad_neta := NULL;
            NEW.utilidad_total := NULL;
            NEW.ingreso_kilos := NULL;
            NEW.egreso_kilos := NULL;
            NEW.valor_kilo := NULL;
            NEW.id_cliente := NULL;
            NEW.numero_factura := NULL;
    END CASE;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger
DROP TRIGGER IF EXISTS trigger_calcular_montos_y_utilidad ON movimientos;
CREATE TRIGGER trigger_calcular_montos_y_utilidad
    BEFORE INSERT ON movimientos
    FOR EACH ROW
    EXECUTE FUNCTION calcular_montos_y_utilidad();

-- Modificaciones para soportar ajustes de stock
ALTER TABLE movimientos
    ALTER COLUMN numero_factura DROP NOT NULL;

-- Restricción para manejo de número de factura según tipo de movimiento
ALTER TABLE movimientos
    ADD CONSTRAINT check_factura_not_null
    CHECK (
        (tipo_movimiento = 'Ajuste' AND numero_factura IS NULL) OR
        (tipo_movimiento != 'Ajuste' AND numero_factura IS NOT NULL)
    );

/* 
 * Notas adicionales:
 * 1. El trigger maneja automáticamente el cálculo de stock basado en movimientos previos
 * 2. Para ajustes de stock, se permiten registros sin número de factura ni cliente
 * 3. El IVA y total se calculan automáticamente basados en el valor por kilo
 * 4. Se mantiene un registro de auditoría con created_by/updated_by para cada movimiento
 */