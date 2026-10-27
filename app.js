/* ---- CONFIGURA AQUÍ TU WHATSAPP (prefijo país + número, sin + ni espacios) ---- */
const WHATSAPP = "34601015975";

const euro = n => n.toLocaleString('es-ES') + ' €';
const km = n => n.toLocaleString('es-ES') + ' km';

function tarjeta(c){
  const msg = encodeURIComponent(`Hola, me interesa el ${c.marca} ${c.modelo} (${c.anio}) de INFICARS.`);
  return `
  <article class="coche">
    ${c.vendido ? '<span class="vendido-tag">VENDIDO</span>' : ''}
    <div class="coche-img">
      <div class="sin-foto">Foto próximamente</div>
      <img src="${c.foto}" alt="${c.marca} ${c.modelo}" loading="lazy" onerror="this.remove()">
    </div>
    <div class="coche-info">
      <small>${c.marca}</small>
      <h3>${c.modelo}</h3>
      <div class="specs">
        <span><b>Año</b> ${c.anio}</span><span><b>Km</b> ${km(c.km)}</span>
        <span><b>Combustible</b> ${c.combustible}</span><span><b>Cambio</b> ${c.cambio}</span>
        <span><b>Potencia</b> ${c.potencia}</span>
      </div>
      <div class="coche-pie">
        <span class="precio">${euro(c.precio)}</span>
        <a class="btn btn-rojo" target="_blank" rel="noopener" href="https://wa.me/${WHATSAPP}?text=${msg}">Me interesa</a>
      </div>
    </div>
  </article>`;
}

/* Menú móvil */
const menu = document.getElementById('menu');
const menuBtn = document.getElementById('menuBtn');
if(menu && menuBtn){
  menuBtn.onclick = () => menu.classList.toggle('abierto');
  menu.querySelectorAll('a').forEach(a => a.onclick = () => menu.classList.remove('abierto'));
}

/* Animación al hacer scroll */
const io = new IntersectionObserver(es => es.forEach(x => { if(x.isIntersecting) x.target.classList.add('visible'); }), {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const anio = document.getElementById('anio');
if(anio) anio.textContent = new Date().getFullYear();

/* Contador de coches disponibles */
const nCoches = document.getElementById('nCoches');
if(nCoches) nCoches.textContent = COCHES.filter(c => !c.vendido).length;

/* Portada: coches destacados (los 3 primeros no vendidos) */
const destacados = document.getElementById('destacados');
if(destacados){
  const lista = COCHES.filter(c => !c.vendido).slice(0, 3);
  destacados.innerHTML = lista.length ? lista.map(tarjeta).join('') : '<p class="vacio">Próximamente nuevos coches.</p>';
}

/* Página de coches: catálogo con filtros */
const listaCoches = document.getElementById('listaCoches');
if(listaCoches){
  const fBusca = document.getElementById('fBusca');
  const fComb = document.getElementById('fComb');
  const fPrecio = document.getElementById('fPrecio');
  const fKm = document.getElementById('fKm');
  const contador = document.getElementById('contador');

  function pintar(){
    const q = fBusca.value.toLowerCase().trim();
    const filtrados = COCHES.filter(c =>
      (c.marca + ' ' + c.modelo).toLowerCase().includes(q) &&
      (!fComb.value || c.combustible === fComb.value) &&
      (!fPrecio.value || c.precio <= Number(fPrecio.value)) &&
      (!fKm.value || c.km <= Number(fKm.value))
    );
    contador.textContent = filtrados.length + (filtrados.length === 1 ? ' coche encontrado' : ' coches encontrados');
    listaCoches.innerHTML = filtrados.length ? filtrados.map(tarjeta).join('') : '<p class="vacio">No hay coches con esos filtros.</p>';
  }
  [fBusca, fComb, fPrecio, fKm].forEach(el => el.addEventListener('input', pintar));
  document.getElementById('limpiar').onclick = () => {
    fBusca.value = ''; fComb.value = ''; fPrecio.value = ''; fKm.value = ''; pintar();
  };
  pintar();
}

/* Formulario de contacto -> WhatsApp */
const form = document.getElementById('formContacto');
if(form){
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(form);
    const t = `Hola INFICARS, soy ${d.get('nombre')} (${d.get('telefono') || 'sin teléfono'}). ${d.get('mensaje')}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t)}`, '_blank');
  });
}
