const pages = [...document.querySelectorAll('.page')];
const links = [...document.querySelectorAll('.nav-link')];
const searchInput = document.getElementById('searchInput');
const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menuBtn');

function showPage(id) {
  const target = document.getElementById(`page-${id}`) || document.getElementById('page-inicio');
  pages.forEach(p => p.classList.toggle('active', p === target));
  links.forEach(a => a.classList.toggle('active', a.dataset.page === id));
  if (location.hash !== `#${id}`) history.replaceState(null, '', `#${id}`);
  window.scrollTo({top: 0, behavior: 'smooth'});
  sidebar.classList.remove('open');
}

links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showPage(link.dataset.page);
  });
});

document.querySelectorAll('.nav-jump').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    showPage(id);
  });
});

menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));

window.addEventListener('hashchange', () => {
  const id = location.hash.slice(1) || 'inicio';
  showPage(id);
});

document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    searchInput.focus();
  }
});

function searchableText(el) {
  return el.innerText.toLocaleLowerCase('pt-BR');
}

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLocaleLowerCase('pt-BR');
  pages.forEach(page => {
    const cards = [...page.querySelectorAll('.rule-card, .concept, .safe-card, .punish-group, .faq details, .feature-card, .step')];
    cards.forEach(card => card.classList.remove('search-hit'));

    if (!q) return;
    let found = 0;
    cards.forEach(card => {
      if (searchableText(card).includes(q)) {
        card.classList.add('search-hit');
        found++;
      }
    });

    if (found && page.id !== 'page-inicio') {
      const id = page.id.replace('page-', '');
      links.find(a => a.dataset.page === id)?.classList.add('active');
    }
  });

  if (q) {
    const match = pages.find(page => searchableText(page).includes(q));
    if (match) {
      const id = match.id.replace('page-', '');
      showPage(id);
      const first = [...match.querySelectorAll('.rule-card, .concept, .safe-card, .punish-group, .faq details, .feature-card, .step')]
        .find(el => searchableText(el).includes(q));
      if (first) setTimeout(() => first.scrollIntoView({behavior:'smooth', block:'center'}), 80);
    }
  }
});

const initial = location.hash.slice(1) || 'inicio';
showPage(initial);
