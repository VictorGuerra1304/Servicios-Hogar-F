import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
 
  let body;
  try {
      body = await req.json();
  } 
  catch (err) {
      console.error("❌ Error al parsear JSON:", err);
      return NextResponse.json({ error: "Error al recibir datos del formulario" }, { status: 400 });
  }
  
  const { correo, contraseña, usuario } = body;
  const cliente = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, });
  const proveedor = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, });

  try {

      if(usuario === "client") {
        await cliente.connect();

        const result = await cliente.query(
        "SELECT * FROM clientes WHERE correo = $1",
        [correo]
        );

        if (result.rows.length === 0) {
        return NextResponse.json({ error: "Correo no registrado" }, { status: 400 });
        }

        const usuario = result.rows[0];
        const passwordMatch = await bcrypt.compare(contraseña, usuario.contraseña);

        if (!passwordMatch) {
        return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
        }
        
        // Quitar la contraseña antes de enviar los datos al frontend
        const { contraseña: _, ...usuarioSinContraseña } = usuario;

        return NextResponse.json({ message: "Inicio de sesión exitoso", usuario });
      }

      else if(usuario === "provider"){
        await proveedor.connect();

        const resultado = await proveedor.query(
        "SELECT * FROM proveedores WHERE correo = $1",
        [correo]
        );

        if (resultado.rows.length === 0) {
        return NextResponse.json({ error: "Correo no registrado" }, { status: 400 });
        }

        const usuario = resultado.rows[0];
        const passwordMatch = await bcrypt.compare(contraseña, usuario.contraseña);

        if (!passwordMatch) {
        return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
        }
        
        // Quitar la contraseña antes de enviar los datos al frontend
        const { contraseña: _, ...usuarioSinContraseña } = usuario;

        return NextResponse.json({ message: "Inicio de sesión exitoso", usuario });
      }

      else {
        return NextResponse.json({ error: "Tipo de usuario no válido" }, { status: 400 });
      }
    } 
  
  catch (error) {
        console.error("Error en login:", error);
        return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
    } 
  
  finally {
    await cliente.end();
    await proveedor.end();

  }
}