/**
 * add-project.js — Formulaire d'ajout et de modification d'un projet
 * - Mode ajout  : URL sans paramètre  → ?id=
 * - Mode édition : URL avec ?id=<id>
 * Anoor's Portfolio v2
 */

document.addEventListener('DOMContentLoaded', () => {
  const params  = new URLSearchParams(window.location.search);
  const id      = params.get('id');
  const modeEdit = !!id;

  const form         = document.getElementById('form-projet');
  const titreH2      = document.getElementById('form-titre');
  const btnSubmit    = document.getElementById('btn-submit');
  const previewImage = document.getElementById('preview-image');
  const inputImage   = document.getElementById('image');

  let imageActuelle = ''; // URL ou data-URL de l'image courante

  // ── Mode édition : pré-remplissage du formulaire ──────────────────────────
  if (modeEdit) {
    const projet = getProjetParId(id);

    if (!projet) {
      // Projet introuvable → retour à la liste
      window.location.href = 'list-project.html';
      return;
    }

    titreH2.textContent  = 'Modifier le projet';
    btnSubmit.textContent = 'Enregistrer les modifications';

    document.getElementById('titre').value        = projet.titre;
    document.getElementById('description').value  = projet.description;
    document.getElementById('technologies').value = projet.technologies.join(', ');
    document.getElementById('categorie').value    = projet.categorie;
    document.getElementById('github').value       = projet.github  || '';
    document.getElementById('website').value      = projet.website || '';

    imageActuelle = projet.image || '';
    if (imageActuelle) {
      previewImage.src = imageActuelle;
      previewImage.classList.remove('hidden');
    }
  }

  // ── Prévisualisation de l'image sélectionnée ─────────────────────────────
  inputImage.addEventListener('change', (e) => {
    const fichier = e.target.files[0];
    if (!fichier) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      imageActuelle = ev.target.result;
      previewImage.src = imageActuelle;
      previewImage.classList.remove('hidden');
    };
    reader.readAsDataURL(fichier);
  });

  // ── Soumission du formulaire ──────────────────────────────────────────────
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validerFormulaire()) return;

    const techsRaw = document.getElementById('technologies').value;
    const technologies = techsRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const donnees = {
      titre:       document.getElementById('titre').value.trim(),
      description: document.getElementById('description').value.trim(),
      technologies,
      categorie:   document.getElementById('categorie').value,
      github:      document.getElementById('github').value.trim(),
      website:     document.getElementById('website').value.trim(),
      image:       imageActuelle,
    };

    if (modeEdit) {
      modifierProjet(id, donnees);
      window.location.href = 'list-project.html?succes=modifie';
    } else {
      ajouterProjet(donnees);
      window.location.href = 'list-project.html?succes=ajoute';
    }
  });

  // ── Validation ────────────────────────────────────────────────────────────
  function validerFormulaire() {
    let valide = true;

    const champsRequis = [
      { id: 'titre',       msg: 'Le titre est requis.' },
      { id: 'description', msg: 'La description est requise.' },
    ];

    champsRequis.forEach(({ id: champId, msg }) => {
      const input  = document.getElementById(champId);
      const erreur = document.getElementById(`erreur-${champId}`);
      const vide   = !input.value.trim();

      erreur.textContent = vide ? msg : '';
      erreur.classList.toggle('hidden', !vide);

      if (vide) {
        input.classList.remove('border-slate-300', 'focus:ring-blue-500');
        input.classList.add('border-red-400', 'focus:ring-red-400');
        valide = false;
      }
    });

    return valide;
  }

  // Effacer les erreurs à la saisie
  ['titre', 'description'].forEach((champId) => {
    document.getElementById(champId).addEventListener('input', () => {
      const input = document.getElementById(champId);
      document.getElementById(`erreur-${champId}`).classList.add('hidden');
      input.classList.remove('border-red-400', 'focus:ring-red-400');
      input.classList.add('border-slate-300', 'focus:ring-blue-500');
    });
  });
});
