import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) 
{
  
  let body;
  try {
      body = await req.json();
  } 
  catch (err) {
      console.error("❌ Error al parsear JSON:", err);
      return NextResponse.json({ error: "Error al recibir datos del formulario" }, { status: 400 });
  }

  const cliente = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, });
  const proveedor = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, });

  const hashedPassword = await bcrypt.hash(body.contraseña, 10);
  //console.log("Paso 2: Body recibido:", body);

  try 
    {   
        if(body.usuario === "client") {
          await cliente.connect();
          await cliente.query(
            `INSERT INTO clientes 
            (nombre, genero, doi, edad, celular, direccion, distrito, referencia, correo, contraseña, tipo_plan) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11)`,
            [
                body.nombre, 
                body.genero === "Hombre", // true si es "Hombre", false si es "Mujer"
                body.doi, 
                body.edad,
                body.celular,
                body.direccion, 
                body.distrito,
                body.referencia,
                body.correo, 
                hashedPassword, 
                body.tipo_plan === "premium", // true si es premium, false si es free
            ]
          );
        }

        else if(body.usuario === "provider"){
          await proveedor.connect();
          const result = await proveedor.query(
            `INSERT INTO proveedores 
            (nombre, genero, doi, edad, celular, direccion, distrito, referencia, correo, contraseña)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id_proveedor`,
            [
                body.nombre, 
                body.genero === "Hombre", // true si es "Hombre", false si es "Mujer"
                body.doi, 
                body.edad,
                body.celular,
                body.direccion, 
                body.distrito,
                body.referencia,
                body.correo, 
                hashedPassword,
            ]
          );

          const id_prov = result.rows[0].id_proveedor;

          await proveedor.query(
            `INSERT INTO lista_servicios
            (id_proveedor, gasfiteria, electricidad, cocina, limpieza, cuidado_niños, cuidado_adultos, jardineria, pintura, carpinteria, plomeria)  
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [
                id_prov,
                body.servicios[0], 
                body.servicios[1],
                body.servicios[2], 
                body.servicios[3],
                body.servicios[4],
                body.servicios[5], 
                body.servicios[6],
                body.servicios[7],
                body.servicios[8], 
                body.servicios[9],
            ]
          );

        }

        return NextResponse.json({ message: "Registro exitoso" });
    } 
  
  catch (error) 
    { console.error("Error al registrar en la BD:", error);
        return NextResponse.json({ error: "Error al registrar en la BD" }, { status: 500 });
    } 
  
  finally 
    { await cliente.end();
    }
}