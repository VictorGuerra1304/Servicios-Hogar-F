import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

export async function GET(req: NextRequest) {
  
  const client = new Client({connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, });

  try {
    await client.connect();
    const { searchParams } = new URL(req.url);
    const idClienteParam = searchParams.get("id_cliente");

    if (!idClienteParam ) {
      return NextResponse.json({ error: "Falta id_cliente" }, { status: 400 });
    }

    const id_cli = parseInt(idClienteParam);
    if (isNaN(id_cli)) {
      return NextResponse.json({ error: "id_cliente inválido" }, { status: 400 });
    }

    console.log("ID cliente recibido:", id_cli);

    const estado = 'Pendiente';
    const result = await client.query("SELECT * FROM servicios_domesticos WHERE estado = $1 AND id_cliente = $2 ORDER BY id_serv_domest DESC", [estado, id_cli]);

    if (result.rows.length === 0) {
      return NextResponse.json([], { status: 200 }); // Retorna arreglo vacío
    }

    return NextResponse.json(result.rows);
  } 
  
  catch (error) { 
    console.error("❌ Error al obtener servicios:", error);
    return NextResponse.json({ error: "Error al obtener servicios" }, { status: 500 });
  } 
  
  finally { 
    await client.end();
  }
}