/**
 * list-projects.js — Rendu dynamique de la liste des projets
 * Gère : affichage des cartes, suppression avec confirmation, notifications toast
 * Anoor's Portfolio v2
 */

// Palette de couleurs par catégorie
const COULEURS_CATEGORIE = {
  'Web App':      { bg: 'bg-blue-600/15',    text: 'text-blue-400',    border: 'border-blue-500/20' },
  'E-commerce':   { bg: 'bg-emerald-600/15', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  'Mobile':       { bg: 'bg-violet-600/15',  text: 'text-violet-400',  border: 'border-violet-500/20' },
  'API / Backend':{ bg: 'bg-orange-600/15',  text: 'text-orange-400',  border: 'border-orange-500/20' },
  'Autre':        { bg: 'bg-slate-600/15',   text: 'text-slate-400',   border: 'border-slate-500/20' },
};

function getCouleur(categorie) {
  return COULEURS_CATEGORIE[categorie] || COULEURS_CATEGORIE['Autre'];
}

/**
 * Crée un élément DOM représentant une carte de projet.
 * @param {Object} projet
 * @returns {HTMLElement}
 */
function creerCarteProjet(projet) {
  const couleur = getCouleur(projet.categorie);
  const imageSrc = projet.image || 'https://picsum.photos/400/200?grayscale';

  const div = document.createElement('div');
  div.className =
    'relative group rounded-xl border border-slate-700 bg-slate-800/50 overflow-hidden ' +
    'hover:border-blue-500/40 hover:-translate-y-1.5 transition-all duration-300 ' +
    'hover:shadow-xl hover:shadow-blue-900/30';
  div.dataset.id = projet.id;

  const techsHtml = projet.technologies
    .map(
      (t) =>
        `<span class="text-xs px-2 py-1 rounded-md bg-slate-700/80 text-slate-300 font-medium">${escHtml(t)}</span>`
    )
    .join('');

  div.innerHTML = `
    <!-- Boutons d'actions (visibles au survol) -->
    <div class="absolute top-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <a
        href="add-project.html?id=${projet.id}"
        class="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900/80 backdrop-blur-sm border border-slate-600 text-slate-300 hover:text-blue-400 hover:border-blue-500 transition-all"
        title="Modifier le projet">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
      </a>
      <button
        class="btn-supprimer flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900/80 backdrop-blur-sm border border-slate-600 text-slate-300 hover:text-red-400 hover:border-red-500 transition-all"
        data-id="${projet.id}"
        title="Supprimer le projet">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </button>
    </div>

    <!-- Lien vers la page détail -->
    <a href="projet-detail.html?id=${projet.id}" class="block">
      <div class="h-44 overflow-hidden bg-slate-700">
        <img
          src="${imageSrc}"
          alt="${escHtml(projet.titre)}"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onerror="this.src='https://picsum.photos/400/200?grayscale'">
      </div>
      <div class="p-5">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-xs font-medium px-2 py-0.5 rounded-full ${couleur.bg} ${couleur.text} border ${couleur.border}">
            ${escHtml(projet.categorie)}
          </span>
        </div>
        <h3 class="text-white font-semibold mb-2 group-hover:text-blue-300 transition-colors line-clamp-1">
          ${escHtml(projet.titre)}
        </h3>
        <p class="text-slate-400 text-sm leading-relaxed line-clamp-2">${escHtml(projet.description)}</p>
        <div class="mt-4 flex gap-2 flex-wrap">${techsHtml}</div>
      </div>
    </a>
  `;

  // Gestionnaire de suppression
  div.querySelector('.btn-supprimer').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    afficherConfirmation(projet.id, projet.titre);
  });

  return div;
}

/**
 * Affiche tous les projets dans la grille.
 */
function afficherProjets() {
  const grille = document.getElementById('projets-grille');
  const compteur = document.getElementById('projets-compteur');
  const etatVide = document.getElementById('etat-vide');

  const projets = getProjets();
  grille.innerHTML = '';

  const nb = projets.length;
  compteur.textContent = `${nb} projet${nb !== 1 ? 's' : ''}`;

  if (nb === 0) {
    etatVide.classList.remove('hidden');
    return;
  }

  etatVide.classList.add('hidden');
  projets.forEach((projet) => grille.appendChild(creerCarteProjet(projet)));
}

// ─── Modal de confirmation de suppression ────────────────────────────────────

function afficherConfirmation(id, titre) {
  document.getElementById('modal-titre-projet').textContent = titre;
  const modal = document.getElementById('modal-confirmation');
  modal.classList.remove('hidden');
  modal.classList.add('flex');

  document.getElementById('btn-confirmer-suppression').onclick = () => {
    supprimerProjet(id);
    fermerModal();
    afficherProjets();
    afficherNotification('Projet supprimé avec succès.', 'success');
  };
}

function fermerModal() {
  const modal = document.getElementById('modal-confirmation');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// ─── Toast notification ───────────────────────────────────────────────────────

/**
 * Affiche une notification toast pendant 3 secondes.
 * @param {string} message
 * @param {'success'|'error'} type
 */
function afficherNotification(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');

  toastMsg.textContent = message;

  // Couleur selon le type
  toast.classList.remove('bg-green-600', 'bg-red-600');
  toast.classList.add(type === 'success' ? 'bg-green-600' : 'bg-red-600');

  // Afficher
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  // Masquer après 3 s
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3000);
}

// ─── Utilitaire ──────────────────────────────────────────────────────────────

/** Échappe le HTML pour éviter les injections XSS. */
function escHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str || ''));
  return div.innerHTML;
}

// ─── Initialisation ───────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  afficherProjets();

  // Fermer modal via le bouton Annuler
  document.getElementById('btn-annuler-suppression').addEventListener('click', fermerModal);

  // Fermer modal en cliquant en dehors
  document.getElementById('modal-confirmation').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) fermerModal();
  });

  // Notification de retour depuis add/edit
  const params = new URLSearchParams(window.location.search);
  const succes = params.get('succes');
  if (succes === 'ajoute') {
    afficherNotification('Projet ajouté avec succès !', 'success');
  } else if (succes === 'modifie') {
    afficherNotification('Projet modifié avec succès !', 'success');
  }
  // Nettoyer l'URL
  if (succes) {
    window.history.replaceState({}, '', window.location.pathname);
  }
});
