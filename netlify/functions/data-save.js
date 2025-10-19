const { getStore } = require('@netlify/blobs');

const ADMIN_PIN = process.env.ADMIN_PIN || '4321';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const { pin, payload } = JSON.parse(event.body || '{}');
    if (!pin || pin !== ADMIN_PIN) {
      return { statusCode: 401, body: JSON.stringify({ error: 'PIN_INCORRECTO' }) };
    }

    const store = getStore('catalogo');
    const current =
      (await store.get('contenido', { type: 'json' })) || {
        caracteristicasGama: '',
        imagenes: [],
        updatedAt: new Date().toISOString(),
      };

    const next = {
      caracteristicasGama:
        typeof payload?.caracteristicasGama === 'string'
          ? payload.caracteristicasGama
          : current.caracteristicasGama,
      imagenes: Array.isArray(payload?.imagenes)
        ? payload.imagenes.filter((u) => typeof u === 'string' && u.trim()).slice(0, 20)
        : current.imagenes,
      updatedAt: new Date().toISOString(),
    };

    await store.setJSON('contenido', next);
    return { statusCode: 200, body: JSON.stringify(next) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: 'SAVE_FAILED', detail: String(e) }) };
  }
};
