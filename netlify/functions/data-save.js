// Guarda solo con PIN; valida tipos y limita imágenes
const { getStore } = require('@netlify/blobs');
const ADMIN_PIN = process.env.ADMIN_PIN || '4321';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { pin, payload } = JSON.parse(event.body || '{}');

    if (!pin || String(pin) !== String(ADMIN_PIN)) {
      return { statusCode: 401, body: JSON.stringify({ error: 'PIN_INCORRECTO' }) };
    }

    const safeText = (v) => (typeof v === 'string' ? v : '');
    const safeImages = (arr) =>
      Array.isArray(arr)
        ? arr
            .map((u) => (typeof u === 'string' ? u.trim() : ''))
            .filter(Boolean)
            .slice(0, 20)
        : [];

    const next = {
      caracteristicasGama: safeText(payload?.caracteristicasGama),
      imagenes: safeImages(payload?.imagenes),
      updatedAt: new Date().toISOString(),
    };

    const store = getStore('catalogo');
    await store.setJSON('contenido', next);

    return { statusCode: 200, body: JSON.stringify(next) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: 'SAVE_FAILED' }) };
  }
};
