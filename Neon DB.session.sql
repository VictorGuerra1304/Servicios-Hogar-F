
CREATE TABLE clientes (
  id_cliente SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  genero BOOLEAN NOT NULL,
  doi CHAR(8) NOT NULL,
  edad VARCHAR(2) NOT NULL,
  celular VARCHAR(9) NOT NULL,
  direccion TEXT NOT NULL,
  distrito VARCHAR(100) NOT NULL,
  referencia VARCHAR(100),
  correo VARCHAR(100) UNIQUE NOT NULL,
  contraseña VARCHAR(100) NOT NULL,
  tipo_plan BOOLEAN NOT NULL
);


SELECT * FROM clientes;

ALTER TABLE clientes RENAME COLUMN email TO correo;


ALTER TABLE clientes
ALTER COLUMN edad TYPE VARCHAR(2);


ALTER SEQUENCE clientes_id_cliente_seq RESTART WITH 1;
TRUNCATE TABLE clientes RESTART IDENTITY;

DROP TABLE clientes;


CREATE TABLE servicios_domesticos (
  id_serv_domest SERIAL PRIMARY KEY,
  id_cliente INTEGER NOT NULL,
  id_proveedor INTEGER,
  titulo VARCHAR(100) NOT NULL,
  tipo_servicio VARCHAR(100) NOT NULL,
  descripcion TEXT NOT NULL,
  direccion TEXT NOT NULL,
  distrito VARCHAR(100) NOT NULL,
  presupuesto NUMERIC(10, 2) DEFAULT 0.00,
  precio_final NUMERIC(10, 2) DEFAULT 0.00,
  urgencia VARCHAR(50) DEFAULT 'Baja',
  fecha TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 day'),
  estado VARCHAR(10) DEFAULT 'Pendiente',
);

ALTER TABLE servicios_domesticos
ADD COLUMN estado VARCHAR(10) DEFAULT 'Pendiente';
ALTER TABLE servicios_domesticos RENAME COLUMN categoria TO tipo_servicio;
ALTER TABLE servicios_domesticos DROP COLUMN id_imagen;

DROP TABLE servicios_domesticos;
DELETE FROM servicios_domesticos;
TRUNCATE TABLE servicios_domesticos

UPDATE servicios_domesticos SET tipo_servicio = '6' WHERE id_serv_domest=3;

ALTER TABLE servicios_domesticos
ALTER COLUMN tipo_servicio TYPE VARCHAR(3);


CREATE TABLE imagenes (
  id_imagen SERIAL PRIMARY KEY,
  id_serv_domest INTEGER NOT NULL REFERENCES servicios_domesticos(id_serv_domest) ON DELETE CASCADE,
  url TEXT NOT NULL
);

ALTER TABLE imagenes RENAME COLUMN id_servicio TO id_serv_domest;

DROP TABLE imagenes;
DELETE FROM imagenes
TRUNCATE TABLE imagenes

TRUNCATE TABLE imagenes RESTART IDENTITY;



//////////////////////////////////////////////////////////////////////////////


TRUNCATE TABLE proveedores, lista_servicios RESTART IDENTITY CASCADE;


CREATE TABLE proveedores (
  id_proveedor SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  genero BOOLEAN NOT NULL,
  doi CHAR(8) NOT NULL,
  edad VARCHAR(2) NOT NULL,
  celular VARCHAR(9) NOT NULL,
  direccion TEXT NOT NULL,
  distrito VARCHAR(100) NOT NULL,
  referencia VARCHAR(100),
  correo VARCHAR(100) UNIQUE NOT NULL,
  contraseña VARCHAR(100) NOT NULL
);


CREATE TABLE lista_servicios (
  id_servicio SERIAL PRIMARY KEY,
  id_proveedor INTEGER NOT NULL REFERENCES proveedores (id_proveedor) ON DELETE CASCADE,
  gasfiteria BOOLEAN NOT NULL DEFAULT FALSE,
  electricidad BOOLEAN NOT NULL DEFAULT FALSE,
  cocina BOOLEAN NOT NULL DEFAULT FALSE,
  limpieza BOOLEAN NOT NULL DEFAULT FALSE,
  cuidado_niños BOOLEAN NOT NULL DEFAULT FALSE,
  cuidado_adultos BOOLEAN NOT NULL DEFAULT FALSE,
  jardineria BOOLEAN NOT NULL DEFAULT FALSE,
  pintura BOOLEAN NOT NULL DEFAULT FALSE,
  carpinteria BOOLEAN NOT NULL DEFAULT FALSE,
  plomeria BOOLEAN NOT NULL DEFAULT FALSE
);



CREATE TABLE lista_documentos (
  id_documento SERIAL PRIMARY KEY,
  id_proveedor INTEGER NOT NULL REFERENCES proveedores (id_proveedor) ON DELETE CASCADE,
  url TEXT NOT NULL
);

