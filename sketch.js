// --- 1. CONFIGURATION FIREBASE (La tienne) ---
const firebaseConfig = {
  apiKey: "AIzaSyD9bzSuQY8CR9RVnQMu6WI4plznzQrfBC4",
  authDomain: "date-d927b.firebaseapp.com",
  projectId: "date-d927b",
  storageBucket: "date-d927b.appspot.com",
  messagingSenderId: "353304192798",
  appId: "1:353304192798:web:1511fa87bfbf11bdda0b0f",
  measurementId: "G-T4N8PMNC3G"
};

// Initialisation
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();


// --- 2. FONCTIONS D'AFFICHAGE ---

// Fonction pour montrer/cacher les détails (date/note) dans le formulaire
function basculerDetails() {
    const isChecked = document.getElementById("estVisite").checked;
    const detailsDiv = document.getElementById("detailsVisite");
    
    if (isChecked) {
        detailsDiv.style.display = "block";
    } else {
        detailsDiv.style.display = "none";
    }
}

// Fonction pour ajouter un musée
function ajouterMusee() {
    const nom = document.getElementById('nomMusee').value;
    const expo = document.getElementById('nomExpo').value;
    const prix = document.getElementById('prixMusee').value;
    const estVisite = document.getElementById('estVisite').checked;

    if (!nom) { alert("Il faut au moins le nom du musée !"); return; }

    // Préparation des données
    let data = {
        nom: nom,
        expo: expo,
        prix: prix,
        estVisite: estVisite,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Si c'est visité, on ajoute les détails
    if (estVisite) {
        data.dateVisite = document.getElementById('dateVisite').value;
        data.note = document.getElementById('noteVisite').value;
        data.commentaire = document.getElementById('commentaire').value;
    }

    // Envoi vers Firebase
    db.collection('musees').add(data).then(() => {
        // Reset du formulaire
        document.getElementById('nomMusee').value = '';
        document.getElementById('nomExpo').value = '';
        document.getElementById('prixMusee').value = '';
        document.getElementById('commentaire').value = '';
        document.getElementById('estVisite').checked = false;
        basculerDetails(); // On recache la zone
        alert("C'est enregistré ! 🏛️");
    });
}

// Fonction pour récupérer et afficher les musées
function chargerMusees() {
    const divAVisiter = document.getElementById('listeAVisiter');
    const divVisites = document.getElementById('listeVisites');

    // On écoute la base de données en temps réel
    db.collection('musees').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        divAVisiter.innerHTML = '';
        divVisites.innerHTML = '';

        snapshot.forEach(doc => {
            const data = doc.data();
            const id = doc.id;

            if (data.estVisite) {
                // --- CAS 1 : DÉJÀ VISITÉ (Affichage en liste en bas) ---
                let etoiles = "⭐".repeat(data.note || 1);
                
                const row = document.createElement('div');
                row.className = 'visite-row';
                row.innerHTML = `
                    <div>
                        <strong>${data.nom}</strong> (${data.expo})<br>
                        <small>📅 ${data.dateVisite || 'Date inconnue'} | 💸 ${data.prix}€</small><br>
                        <em>"${data.commentaire || ''}"</em>
                    </div>
                    <div style="text-align:right; font-size: 1.2em;">
                        ${etoiles}
                    </div>
                `;
                divVisites.appendChild(row);

            } else {
                // --- CAS 2 : À VISITER (Affichage Carte à droite) ---
                const card = document.createElement('div');
                card.className = 'card-tinder';
                card.innerHTML = `
                    <span class="card-tag">${data.expo || 'Général'}</span>
                    <h3>${data.nom}</h3>
                    <p>💸 ${data.prix ? data.prix + ' €' : 'Gratuit ?'}</p>
                    <button class="btn-check" onclick="passerEnVisite('${id}')">✅ Je l'ai fait !</button>
                    <button style="background:none; border:none; color:red; float:right; cursor:pointer;" onclick="supprimerMusee('${id}')">🗑️</button>
                `;
                divAVisiter.appendChild(card);
            }
        });

        if(divAVisiter.innerHTML === '') divAVisiter.innerHTML = "<p>Rien de prévu pour l'instant...</p>";
        if(divVisites.innerHTML === '') divVisites.innerHTML = "<p>Pas encore de visites notées.</p>";
    });
}

// Fonction pour passer une carte de "À faire" vers "Fait"
function passerEnVisite(id) {
    const note = prompt("Note sur 5 ? (1-5)");
    const date = prompt("Quelle date ? (AAAA-MM-JJ)", new Date().toISOString().split('T')[0]);
    const comment = prompt("Un petit mot ?");

    if(note) {
        db.collection('musees').doc(id).update({
            estVisite: true,
            note: note,
            dateVisite: date,
            commentaire: comment
        });
    }
}

function supprimerMusee(id) {
    if(confirm("Supprimer ?")) {
        db.collection('musees').doc(id).delete();
    }
}

// Lancer le chargement au démarrage
document.addEventListener('DOMContentLoaded', chargerMusees);
