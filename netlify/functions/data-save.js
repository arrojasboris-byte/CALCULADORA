import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";

const DATA_DIR = "/tmp";
const DATA_FILE = DATA_DIR + "/catalogo.json";

export default async (req, context) => {
  try {
    if (req.method !== "POST")
      return new Response("Method Not Allowed", { status: 405 });

    const { pin, payload } = await req.json();

    // Validar PIN del entorno
    const realPin = process.env.ADMIN_PIN;
    if (!realPin || pin !== realPin) {
      return new Response(JSON.stringify({ error: "PIN_INCORRECTO" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    // Crear directorio temporal si no existe
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

    // Guardar archivo
    const data = {
      caracteristicasGama: payload.caracteristicasGama || "",
      imagenes: payload.imagenes || [],
      updatedAt: new Date().toISOString(),
    };
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    console.error("Error guardando datos", e);
    return new Response(
      JSON.stringify({ error: "SERVER_ERROR", details: e.message }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
};
