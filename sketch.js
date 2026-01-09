// ==========================================
// 1. CONFIGURATION FIREBASE (C'est la tienne !)
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyD9bzSuQY8CR9RVnQMu6WI4plznzQrfBC4",
  authDomain: "date-d927b.firebaseapp.com",
  projectId: "date-d927b",
  storageBucket: "date-d927b.appspot.com",
  messagingSenderId: "353304192798",
  appId: "1:353304192798:web:1511fa87bfbf11bdda0b0f",
  measurementId: "G-T4N8PMNC3G"
};

// On vérifie si Firebase n'est pas déjà lancé pour éviter les erreurs
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();


// ==========================================
// 2. GESTION DES IDÉES DE SORTIES (PAGE INDEX)
// ==========================================

function ajouterIdee() {
  const idee = document.getElementById('nouvelleIdee').value.trim();
  const date = document.getElementById('dateIdee').value;
  const prix = document.getElementById('prixIdee').value;
  const lieu = document.getElementById('lieuIdee').value.trim();

  // Récupérer les catégories
  const checkboxes = document.querySelectorAll('#categories input[type="checkbox"]:checked');
  const categories = Array.from(checkboxes).map(cb => cb.value).slice(0,3);

  if (!idee) { alert("Propose quelque chose !"); return; }

  // Envoi vers Firebase (Collection 'sorties')
  db.collection('sorties').add({
    texte: idee,
    date: date,
    prix: prix,
    lieu: lieu,
    categories: categories,
    timestamp: firebase.firestore.FieldValue.serverTimestamp() // Pour trier par date d'ajout
  }).then(() => {
    // Reset du formulaire
    document.getElementById('nouvelleIdee').value = '';
    document.getElementById('dateIdee').value = '';
    document.getElementById('prixIdee').value = '';
    document.getElementById('lieuIdee').value = '';
    document.querySelectorAll('#categories input[type="checkbox"]').forEach(cb => cb.checked = false);
    afficherIdees();
  });
}

function afficherIdees() {
  const sortiesDiv = document.getElementById('sorties');
  if (!sortiesDiv) return; // Sécurité si on est sur la page Album

  // On récupère les données triées par texte (ou timestamp si tu préfères)
  db.collection('sorties').orderBy('texte').get().then(snapshot => {
    sortiesDiv.innerHTML = '';
    
    if (snapshot.empty) {
      sortiesDiv.innerHTML = "<p style='width:100%; text-align:center;'>Pas encore d'idées... proposez-en une 👆</p>";
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Création de la carte HTML
      const card = document.createElement('div');
      card.className = 'carte';
      
      card.innerHTML = `
        <h3>${data.texte}</h3>
        <p>📅 ${data.date || 'Non précisée'}</p>
        <p>📂 ${data.categories && data.categories.length > 0 ? data.categories.join(', ') : 'Aucune'}</p>
        <p>💸 ${data.prix ? data.prix + '€' : 'Non précisé'}</p>
        <p>📍 ${data.lieu || 'Non précisé'}</p>
      `;

      // Bouton Supprimer
      const btn = document.createElement('button');
      btn.textContent = "Supprimer";
      btn.style.marginTop = "10px";
      btn.onclick = () => {
        if(confirm("Supprimer cette idée ?")) {
           db.collection('sorties').doc(doc.id).delete().then(afficherIdees);
        }
      };
      card.appendChild(btn);

      sortiesDiv.appendChild(card);
    });
  });
}


// ==========================================
// 3. GESTION DE L'ALBUM PHOTO (PAGE ALBUM)
// ==========================================

function ajouterPhoto() {
  const url = document.getElementById('urlPhoto').value.trim();
  const titre = document.getElementById('titrePhoto').value.trim();

  if (!url) { alert("Il faut coller un lien d'image !"); return; }

  // Envoi vers Firebase (Nouvelle collection 'album')
  db.collection('album').add({
    url: url,
    titre: titre || "Souvenir",
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    document.getElementById('urlPhoto').value = '';
    document.getElementById('titrePhoto').value = '';
    afficherPhotos();
  });
}

function afficherPhotos() {
  const zonePhotos = document.getElementById('zone-photos');
  if (!zonePhotos) return; // Sécurité si on est sur la page Sorties

  // On récupère les photos triées par date d'ajout
  db.collection('album').orderBy('timestamp', 'desc').get().then(snapshot => {
    zonePhotos.innerHTML = '';

    if (snapshot.empty) {
      zonePhotos.innerHTML = "<p>L'album est vide pour l'instant 📸</p>";
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();
      const angle = Math.random() * 6 - 3; // Rotation aléatoire pour le style

      // Création du bloc HTML
      const div = document.createElement('div');
      div.className = 'photo-card';
      div.style.transform = `rotate(${angle}deg)`;

      div.innerHTML = `
        <button class="btn-suppr" onclick="supprimerPhoto('${doc.id}')">×</button>
        <img src="${data.url}" onerror="this.src='https://via.placeholder.com/200?text=Image+Invalide'">
        <p>${data.titre}</p>
      `;
      
      zonePhotos.appendChild(div);
    });
  });
}

// Fonction pour supprimer une photo via son ID Firebase
function supprimerPhoto(id) {
  if(confirm("Supprimer ce souvenir ?")) {
    db.collection('album').doc(id).delete().then(afficherPhotos);
  }
}


// ==========================================
// 4. LANCEMENT AUTOMATIQUE (SELON LA PAGE)
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
  
  // Si on est sur la page des SORTIES
  if (document.getElementById('sorties')) {
    afficherIdees();
    // Touche Entrée pour valider
    const inputIdee = document.getElementById('nouvelleIdee');
    if(inputIdee) {
        inputIdee.addEventListener('keydown', (e) => {
            if (e.key === "Enter") ajouterIdee();
        });
    }
  }

  // Si on est sur la page de l'ALBUM
  if (document.getElementById('zone-photos')) {
    afficherPhotos();
     // Touche Entrée pour valider
     const inputUrl = document.getElementById('urlPhoto');
     if(inputUrl) {
        inputUrl.addEventListener('keydown', (e) => {
            if (e.key === "Enter") ajouterPhoto();
        });
     }
  }

});// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD9bzSuQY8CR9RVnQMu6WI4plznzQrfBC4",
  authDomain: "date-d927b.firebaseapp.com",
  projectId: "date-d927b",
  storageBucket: "date-d927b.appspot.com",
  messagingSenderId: "353304192798",
  appId: "1:353304192798:web:1511fa87bfbf11bdda0b0f",
  measurementId: "G-T4N8PMNC3G"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function ajouterIdee() {
  const idee = document.getElementById('nouvelleIdee').value.trim();
  const date = document.getElementById('dateIdee').value;
  const prix = document.getElementById('prixIdee').value;
  const lieu = document.getElementById('lieuIdee').value.trim();

  // Récupérer les catégories cochées (max 3)
  const checkboxes = document.querySelectorAll('#categories input[type="checkbox"]:checked');
  const categories = Array.from(checkboxes).map(cb => cb.value).slice(0,3);

  if (!idee) {
    alert("Propose quelque chose !");
    return;
  }

  db.collection('sorties').add({
    texte: idee,
    date: date,
    prix: prix,
    lieu: lieu,
    categories: categories
  }).then(() => {
    // Reset
    document.getElementById('nouvelleIdee').value = '';
    document.getElementById('dateIdee').value = '';
    document.getElementById('prixIdee').value = '';
    document.getElementById('lieuIdee').value = '';
    document.querySelectorAll('#categories input[type="checkbox"]').forEach(cb => cb.checked = false);
    afficherIdees();
  });
}

function afficherIdees() {
  db.collection('sorties').orderBy('texte').get().then(snapshot => {
    const sortiesDiv = document.getElementById('sorties');
    sortiesDiv.innerHTML = '';
    if (snapshot.empty) {
      sortiesDiv.textContent = "Pas encore d'idées... proposez-en une 👆";
      return;
    }
    snapshot.forEach(doc => {
      const data = doc.data();

      const card = document.createElement('div');
      card.className = 'carte';

      const titre = document.createElement('h3');
      titre.textContent = data.texte;
      card.appendChild(titre);

      const infos = [
        `📅 Date : ${data.date || 'Non précisée'}`,
        `📂 Catégories : ${data.categories && data.categories.length > 0 ? data.categories.join(', ') : 'Non précisées'}`,
        `💸 Prix : ${data.prix ? data.prix + '€' : 'Non précisé'}`,
        `📍 Lieu : ${data.lieu || 'Non précisé'}`
      ];

      infos.forEach(txt => {
        const p = document.createElement('p');
        p.textContent = txt;
        card.appendChild(p);
      });

      const btn = document.createElement('button');
      btn.textContent = "Supprimer";
      btn.onclick = () => {
        db.collection('sorties').doc(doc.id).delete().then(afficherIdees);
      };
      card.appendChild(btn);

      sortiesDiv.appendChild(card);
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  afficherIdees();
  document.getElementById('nouvelleIdee').addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
      ajouterIdee();
    }
  });
});
