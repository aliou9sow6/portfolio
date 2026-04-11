/**
 * projects-store.js — Couche données : CRUD projets via localStorage
 * Anoor's Portfolio v2
 */

const CLE_STOCKAGE = 'anoors_projets_v2';

// Données initiales de départ (seed)
const PROJETS_INITIAUX = [
  {
    id: '1',
    titre: 'Application de Dashboard',
    description: 'Dashboard analytique pour un magasin en ligne. Les utilisateurs peuvent visualiser les ventes, les performances des produits et les tendances du marché à travers des graphiques interactifs et des tableaux de bord personnalisables.',
    image: '../shared/img/dashboard.jpg',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    categorie: 'Web App',
    github: 'https://github.com',
    website: 'https://www.example.com',
    date: '2024-01-15',
  },
  {
    id: '2',
    titre: 'Site E-commerce',
    description: "Plateforme de vente en ligne complète avec gestion des produits, panier d'achat et système de paiement sécurisé.",
    image: '../shared/img/e-commerce.jpg',
    technologies: ['React', 'Node.js'],
    categorie: 'E-commerce',
    github: 'https://github.com',
    website: 'https://www.example.com',
    date: '2024-03-20',
  },
  {
    id: '3',
    titre: 'App Fitness Mobile',
    description: 'Application mobile de suivi fitness permettant aux utilisateurs de suivre leurs entraînements, calories et progrès quotidiens.',
    image: '../shared/img/fitness.jpg',
    technologies: ['Python', 'Django'],
    categorie: 'Mobile',
    github: 'https://github.com',
    website: 'https://www.example.com',
    date: '2024-05-10',
  },
];

/**
 * Récupère tous les projets depuis localStorage.
 * Si vide, initialise avec les données de départ.
 * @returns {Array}
 */
function getProjets() {
  const donnees = localStorage.getItem(CLE_STOCKAGE);
  if (!donnees) {
    localStorage.setItem(CLE_STOCKAGE, JSON.stringify(PROJETS_INITIAUX));
    return PROJETS_INITIAUX;
  }
  return JSON.parse(donnees);
}

/**
 * Persiste le tableau de projets dans localStorage.
 * @param {Array} projets
 */
function sauvegarderProjets(projets) {
  localStorage.setItem(CLE_STOCKAGE, JSON.stringify(projets));
}

/**
 * Trouve un projet par son identifiant.
 * @param {string} id
 * @returns {Object|null}
 */
function getProjetParId(id) {
  return getProjets().find((p) => p.id === id) || null;
}

/**
 * Ajoute un nouveau projet.
 * @param {Object} donnees  — { titre, description, image, technologies, categorie, github, website }
 * @returns {Object} projet créé
 */
function ajouterProjet(donnees) {
  const projets = getProjets();
  const nouveau = {
    ...donnees,
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
  };
  projets.push(nouveau);
  sauvegarderProjets(projets);
  return nouveau;
}

/**
 * Met à jour un projet existant.
 * @param {string} id
 * @param {Object} donnees — champs à modifier
 * @returns {Object|null} projet modifié ou null si introuvable
 */
function modifierProjet(id, donnees) {
  const projets = getProjets();
  const index = projets.findIndex((p) => p.id === id);
  if (index === -1) return null;
  projets[index] = { ...projets[index], ...donnees };
  sauvegarderProjets(projets);
  return projets[index];
}

/**
 * Supprime un projet par son identifiant.
 * @param {string} id
 */
function supprimerProjet(id) {
  const projets = getProjets().filter((p) => p.id !== id);
  sauvegarderProjets(projets);
}
