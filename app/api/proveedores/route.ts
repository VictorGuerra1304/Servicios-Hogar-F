import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

export async function GET(req: NextRequest) {
  const servicio = req.nextUrl.searchParams.get("servicio");

  if (!servicio) {
    return NextResponse.json({ error: "Falta parámetro 'servicio'" }, { status: 400 });
  }

  const columna = servicio.toLowerCase();
  const client = new Client({connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, });

  try {
    await client.connect();

    const result = await client.query(
      `SELECT p.id_proveedor, p.nombre, p.edad, p.distrito FROM proveedores p JOIN lista_servicios ls ON p.id_proveedor = ls.id_proveedor WHERE ls.${columna} = TRUE`);

    return NextResponse.json(result.rows);
  } 
  catch (error) {
    console.error("❌ Error al obtener proveedores:", error);
    return NextResponse.json({ error: "Error al obtener proveedores" }, { status: 500 });
  } 
  
  finally {
    await client.end();
  }
}