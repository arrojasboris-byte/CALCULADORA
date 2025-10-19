// public/catalogo-infy.js
// Inyecta el contenido guardado (texto + galería de imágenes) debajo del bloque
// "Características de gamas" de tu calculadora, sin romper tu UI existente.

const ENDPOINT = '/.netlify/functions/data-get';

/** Busca el elemento ancla cuya etiqueta o texto contenga "Características de gamas" */
function findAnchor() {
  const candidates = document.querySelectorAll('h1,h2,h3,h4,legend,label,div,section');
  const re = /caracter[íi]sticas?\s+de\s+gamas?/i;
  for (const el of candidates) {
    const txt = (el.textContent || '').trim();
    if (re.test(txt)) return el;
  }
  // fallback: intenta encontrar el encabezado de la tabla de características
  for (const el of candidates) {
    const txt = (el.textContent || '').trim();
    if (/caracter[íi]sticas?/i.test(txt)) return el;
  }
  return null;
}

/** Crea el contenedor visual donde se insertará lo guardado */
function createContainer() {
  const wrap = document.createElement('div');
  wrap.setAttribute('data-catalogo-infy', 'true');
  wrap.style.margin = '12px 0 8px';

  const texto = document.createElement('div');
  texto.id = 'cat-gama-contenido';
  texto.style.whiteSpace = 'pre-wrap';
  texto.style.margin = '8px 0 12px';

  const galeria = document.createElement('div');
  galeria.id = 'cat-gama-galeria';
  galeria.style.display = 'grid';
  galeria.style.gridTemplateColumns = 'repeat(auto-fill,minmax(160px,1fr))';
  galeria.style.gap = '12px';

  wrap.appendChild(texto);
  wrap.appendChild(galeria);
  return wrap;
}

/** Pinta texto e imágenes */
function render(data, mountEl) {
  try {
    const texto = mountEl.querySelector('#cat-gama-contenido');
    const gal = mountEl.querySelector('#cat-gama-galeria');

    if (texto) {
      texto.textContent = (data && data.caracteristicasGama) || '';
    }
    if (gal) {
      gal.innerHTML = '';
      (data && Array.isArray(data.imagenes) ? data.imagenes : []).forEach((url) => {
        if (typeof url !== 'string' || !url.trim()) return;
        const card = document.createElement('div');
        card.style.cssText =
          'border:1px solid #eee;border-radius:12px;overflow:hidden;min-height:120px;background:#fff';
        const img = new Image();
        img.src = url;
        img.loading = 'lazy';
        img.alt = 'Imagen de gama';
        img.style.cssText = 'width:100%;height:100%;object-fit:cover';
        card.appendChild(img);
        gal.appendChild(card);
      });
    }
  } catch (e) {
    console.error('catalogo-infy: error al pintar', e);
  }
}

/** Carga remota */
async function loadData() {
  try {
    const r = await fetch(ENDPOINT, { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.json();
  } catch (e) {
    console.warn('catalogo-infy: no se pudo cargar, se mostrará vacío', e);
    return { caracteristicasGama: '', imagenes: [] };
  }
}

(async function bootstrap() {
  // Espera a que haya DOM listo
  if (document.readyState === 'loading') {
    await new Promise((res) => document.addEventListener('DOMContentLoaded', res, { once: true }));
  }

  // Evita duplicados
  if (document.querySelector('[data-catalogo-infy="true"]')) return;

  const anchor = findAnchor();
  if (!anchor) {
    console.warn('catalogo-infy: no se encontró el bloque "Características de gamas". No se inyecta.');
    return;
  }

  // Inserta contenedor justo debajo del ancla encontrada
  const mount = createContainer();
  if (anchor.nextSibling) {
    anchor.parentNode.insertBefore(mount, anchor.nextSibling);
  } else {
    anchor.parentNode.appendChild(mount);
  }

  // Carga y pinta
  const data = await loadData();
  render(data, mount);
})();
