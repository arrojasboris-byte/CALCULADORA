import { readFileSync, existsSync } from "fs";

const DATA_FILE = "/tmp/catalogo.json";

export default async () => {
  try {
    if (!existsSync(DATA_FILE))
      return new Response(
        JSON.stringify({ caracteristicasGama: "", imagenes: [] }),
        { headers: { "content-type": "application/json" } }
      );

    const data = readFileSync(DATA_FILE, "utf-8");
    return new Response(data, {
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    console.error("Error leyendo datos", e);
    return new Response(
      JSON.stringify({ error: "SERVER_ERROR", details: e.message }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
};
