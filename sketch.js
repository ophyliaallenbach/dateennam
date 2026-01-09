// --- 1. SÉCURITÉ : VÉRIFICATION DU LOGIN ---
if (localStorage.getItem("estConnecte") !== "OUI") {
    window.location.href = "login.html";
}

// --- 2. CONFIGURATION FIREBASE (Tes clés à toi) ---
const firebaseConfig = {
  apiKey: "AIzaSyD9bzSuQY8CR9RVnQMu6WI4plznzQrfBC4",
  authDomain: "date-d927b.firebaseapp.com",
  projectId: "date-d927b",
  storageBucket: "date-d927b.appspot.com",
  messagingSenderId: "353304192798",
  appId: "1:353304192798:web:1511fa87bfbf11bdda0b0f",
  measurementId: "G-T4N8PMNC3G"
};

// Initialisation de Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// --- 3. FONCTIONS (Ajouter et Afficher) ---

function ajouterIdee() {
  const idee = document.getElementById('nouvelleIdee').value.trim();
  const date = document.getElementById('dateIdee').value;
  const prix = document.getElementById('prixIdee').value;
  const lieu = document.getElementById('lieuIdee').value.trim();

  // Catégories
  const checkboxes = document.querySelectorAll('#categories input[type="checkbox"]:checked');
  const categories = Array.from(checkboxes).map(cb => cb.value).slice(0,3);

  if (!idee) { alert("Il faut donner un titre !"); return; }

  // Envoi vers Firebase
  db.collection('sorties').add({
    texte: idee,
    date: date,
    prix: prix,
    lieu: lieu,
    categories: categories,
    timestamp: firebase.firestore.FieldValue.serverTimestamp() // Pour trier par ordre d'ajout
  }).then(() => {
    // On vide le formulaire
    document.getElementById('nouvelleIdee').value = '';
    document.getElementById('dateIdee').value = '';
    document.getElementById('prixIdee').value = '';
    document.getElementById('lieuIdee').value = '';
    document.querySelectorAll('#categories input').forEach(cb => cb.checked = false);
    
    // On rafraichit la liste
    afficherIdees();
  });
}

function afficherIdees() {
  const sortiesDiv = document.getElementById('sorties');
  
  // On récupère les sorties depuis Firebase (triées par texte)
  db.collection('sorties').orderBy('texte').get().then(snapshot => {
    sortiesDiv.innerHTML = '';
    
    if (snapshot.empty) {
      sortiesDiv.innerHTML = "<p>Pas encore d'idées... À toi de jouer ! 👆</p>";
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();
      
      const card = document.createElement('div');
      card.className = 'carte';
      card.innerHTML = `
        <h3>${data.texte}</h3>
        <p>📅 ${data.date || 'Non précisée'}</p>
        <p>📂 ${data.categories && data.categories.length > 0 ? data.categories.join(', ') : 'Aucune'}</p>
        <p>💸 ${data.prix ? data.prix + '€' : 'Non précisé'}</p>
        <p>📍 ${data.lieu || 'Non précisé'}</p>
        <button class="btn-delete" onclick="supprimerIdee('${doc.id}')">Supprimer</button>
      `;
      sortiesDiv.appendChild(card);
    });
  });
}

function supprimerIdee(id) {
    if(confirm("Tu veux vraiment supprimer cette idée ?")) {
        db.collection('sorties').doc(id).delete().then(() => {
            afficherIdees();
        });
    }
}

// Lancement au démarrage
window.addEventListener('DOMContentLoaded', () => {
    afficherIdees();
});
