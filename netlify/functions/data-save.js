// Persiste datos en Netlify Blobs
// Requiere ADMIN_PIN en Variables de Entorno (por ejemplo: 4321)

import { createClient } from "@netlify/blobs";

export default async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    // Cuerpo { pin, payload: { caracteristicasGama, imagenes[] } }
    const { pin, payload } = await req.json();

    const realPin = process.env.ADMIN_PIN;
    if (!realPin || pin !== realPin) {
      return new Response(JSON.stringify({ error: "PIN_INCORRECTO" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    // Blobs: store "calculadora", clave "catalogo.json"
    const store = createClient({ name: "calculadora" });

    const data = {
      caracteristicasGama: (payload?.caracteristicasGama || "").toString(),
      imagenes: Array.isArray(payload?.imagenes) ? payload.imagenes.slice(0, 20) : [],
      updatedAt: new Date().toISOString(),
    };

    await store.setJSON("catalogo.json", data);
    const saved = await store.getJSON("catalogo.json");

    return new Response(JSON.stringify(saved), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    console.error("ERROR data-save:", e);
    return new Response(
      JSON.stringify({ error: "SERVER_ERROR", details: e.message }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
};
