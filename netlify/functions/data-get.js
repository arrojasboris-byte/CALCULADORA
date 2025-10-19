// Robust GET: nunca revienta; si no hay datos, devuelve un objeto por defecto
const { getStore } = require('@netlify/blobs');

exports.handler = async () => {
  try {
    const store = getStore('catalogo');
    // Si el blob no existe aún, get(...) puede lanzar o devolver null: lo cubrimos
    let current = null;
    try {
      current = await store.get('contenido', { type: 'json' });
    } catch (_) { /* ignore */ }
    if (!current || typeof current !== 'object') {
      current = { caracteristicasGama: '', imagenes: [], updatedAt: new Date().toISOString() };
    }
    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
      body: JSON.stringify(current),
    };
  } catch (e) {
    // No filtramos el error al cliente; devolvemos default para que el admin cargue
    const fallback = { caracteristicasGama: '', imagenes: [], updatedAt: new Date().toISOString() };
    return { statusCode: 200, body: JSON.stringify(fallback) };
  }
};
