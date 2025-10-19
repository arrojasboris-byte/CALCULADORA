// Lee datos públicos (características + imágenes) desde Netlify Blobs
import { getStore } from '@netlify/blobs';

export async function handler() {
  try {
    const store = getStore('catalogo'); // nombre del store
    // Valores por defecto si aún no hay datos
    const current = (await store.get('contenido', { type: 'json' })) || {
      caracteristicasGama: '',
      imagenes: [],
      updatedAt: new Date().toISOString(),
    };
    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
      body: JSON.stringify(current),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: 'GET_FAILED', detail: String(e) }) };
  }
}
