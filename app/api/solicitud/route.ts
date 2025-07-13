import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";
console.log("🚀 Entró al archivo solicitud/route.ts");

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    titulo,
    tipo_servicio,
    descripcion,
    direccion,
    distrito,
    presupuesto,
    urgencia,
    fecha,
    id_cliente,
    imagen, // Array de strings
  } = body;

  console.log("BODY recibido:", body);

  if (!id_cliente) {
    return NextResponse.json({ error: "ID del cliente no proporcionado" }, { status: 400 });
  }

  if (isNaN(presupuesto) || Number(presupuesto) <= 0) {
    return NextResponse.json({ error: "Presupuesto inválido" }, { status: 400 });
  }

  if (!imagen || !Array.isArray(imagen) || imagen.length === 0) {
    return NextResponse.json({ error: "Debes subir al menos una imagen." }, { status: 400 });
  }

  const client = new Client({   connectionString: process.env.DATABASE_URL,
                                ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // Paso 1: insertar en servicios_domesticos y obtener id
    const result = await client.query(
    `INSERT INTO servicios_domesticos 
    (titulo, tipo_servicio, descripcion, direccion, distrito, presupuesto, urgencia, fecha, id_cliente) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id_serv_domest`,
    [
        titulo,
        tipo_servicio,
        descripcion,
        direccion,
        distrito,
        presupuesto,
        urgencia,
        fecha,
        id_cliente,
    ]
    );

    const id_servicio_domestico = result.rows[0].id_serv_domest;
    console.log("🟢 ID del servicio creado:", id_servicio_domestico);

    // Paso 2: insertar en imagenes
    for (const url of imagen) {
      console.log("🖼️ Insertando imagen con URL:", url);
      await client.query(
        `INSERT INTO imagenes (id_serv_domest, url) VALUES ($1, $2)`,
        [id_servicio_domestico, url]
    );
    }

    return NextResponse.json({ message: "Servicio registrado correctamente" });
  } 
  
  catch (e) {
    console.error("Error al insertar servicio:", e);
    return NextResponse.json({ error: "Error al insertar el servicio" }, { status: 500 });
  } 
  
  finally {
    await client.end();
  }
}

