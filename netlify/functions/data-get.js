// Lee datos desde Netlify Blobs
import { createClient } from "@netlify/blobs";

export default async () => {
  try {
    const store = createClient({ name: "calculadora" });
    const data = await store.getJSON("catalogo.json");
    return new Response(
      JSON.stringify(data || { caracteristicasGama: "", imagenes: [] }),
      { headers: { "content-type": "application/json" } }
    );
  } catch (e) {
    console.error("ERROR data-get:", e);
    return new Response(JSON.stringify({ caracteristicasGama: "", imagenes: [] }), {
      headers: { "content-type": "application/json" },
    });
  }
};
