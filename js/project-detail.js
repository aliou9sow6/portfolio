/**
 * project-detail.js — Affichage dynamique du détail d'un projet
 * Lit l'identifiant via le paramètre URL ?id=
 * Anoor's Portfolio v2
 */

function fetchHtmlFragment(url) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return response.text();
    })
    .then((html) => {
      const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      return match ? match[1] : html;
    });
}

document.addEventListener('DOMContentLoaded', () => {
  // Charger la navigation et le footer
  fetchHtmlFragment('../shared/nav.html')
    .then((data) => {
      document.getElementById('nav-placeholder').innerHTML = data;
    })
    .catch((err) => console.error('Erreur chargement nav :', err));

  fetchHtmlFragment('../shared/footer.html')
    .then((data) => {
      document.getElementById('footer-placeholder').innerHTML = data;
    })
    .catch((err) => console.error('Erreur chargement footer :', err));

  // Récupérer l'identifiant depuis l'URL
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const conteneur = document.getElementById('detail-contenu');

  if (!id) {
    window.location.href = 'list-project.html';
    return;
  }

  const projet = getProjetParId(id);

  if (!projet) {
    conteneur.innerHTML = `
      <div class="p-12 text-center">
        <div class="text-5xl mb-4">🔍</div>
        <h2 class="text-xl font-semibold text-slate-700 mb-2">Projet introuvable</h2>
        <p class="text-slate-500 mb-6">Ce projet n'existe pas ou a été supprimé.</p>
        <a href="list-project.html"
           class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          ← Retour aux projets
        </a>
      </div>
    `;
    return;
  }

  // Titre de l'onglet
  document.title = `${projet.titre} — Anoor's Portfolio`;

  // Construire les technologies
  const techsHtml = projet.technologies
    .map((t) => `<li>${escHtml(t)}</li>`)
    .join('');

  // Construire les liens
  const liensHtml = [
    projet.github  ? `<li><a href="${projet.github}"  target="_blank" rel="noopener" class="text-sky-600 hover:text-sky-800 underline">Dépôt GitHub</a></li>` : '',
    projet.website ? `<li><a href="${projet.website}" target="_blank" rel="noopener" class="text-sky-600 hover:text-sky-800 underline">Site web</a></li>` : '',
  ].join('');

  const imageHtml = projet.image
    ? `<img src="${projet.image}" alt="Image du projet" class="w-full h-auto rounded-2xl border border-slate-200 shadow-sm object-cover max-h-80" onerror="this.style.display='none'">`
    : '';

  conteneur.innerHTML = `
    <div class="p-8 space-y-6">
      <!-- En-tête -->
      <div class="flex items-start justify-between flex-wrap gap-4">
        <div>
          <span class="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            ${escHtml(projet.categorie)}
          </span>
          <h2 class="text-3xl font-bold text-slate-900 mt-3">${escHtml(projet.titre)}</h2>
          ${projet.date ? `<p class="text-slate-400 text-sm mt-1">Ajouté le ${formatDate(projet.date)}</p>` : ''}
        </div>
        <div class="flex gap-3 flex-shrink-0">
          <a href="add-project.html?id=${projet.id}"
             class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            Modifier
          </a>
          <a href="list-project.html"
             class="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
            ← Retour
          </a>
        </div>
      </div>

      <!-- Image -->
      ${imageHtml}

      <!-- Description -->
      <p class="text-slate-700 leading-7">${escHtml(projet.description)}</p>

      <!-- Technologies -->
      <div class="space-y-3">
        <h3 class="text-xl font-semibold text-slate-900">Technologies utilisées :</h3>
        <ul class="list-disc list-inside space-y-2 text-slate-700">${techsHtml}</ul>
      </div>

      <!-- Liens -->
      ${liensHtml ? `
      <div class="space-y-3">
        <h3 class="text-xl font-semibold text-slate-900">Liens :</h3>
        <ul class="list-disc list-inside space-y-2 text-slate-700">${liensHtml}</ul>
      </div>` : ''}
    </div>
  `;
});

/** Formate une date ISO en français. */
function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/** Échappe les caractères HTML pour éviter les injections XSS. */
function escHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str || ''));
  return div.innerHTML;
}
