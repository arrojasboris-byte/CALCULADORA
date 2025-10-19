// Lee el contenido guardado (CommonJS)
const { getStore } = require('@netlify/blobs');

exports.handler = async () => {
  try {
    const store = getStore('catalogo');
    const current =
      (await store.get('contenido', { type: 'json' })) || {
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
};
