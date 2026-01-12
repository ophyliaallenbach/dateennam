// --- 1. CONFIGURATION FIREBASE ---
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

// --- 2. AJOUTER UNE IDEE ---
function ajouterIdee() {
    const titre = document.getElementById("nouvelleIdee").value;
    const date = document.getElementById("dateIdee").value;
    const prix = document.getElementById("prixIdee").value;
    const lieu = document.getElementById("lieuIdee").value;

    // Récupérer les catégories cochées
    const checkedBoxes = document.querySelectorAll('#categories input:checked');
    const categories = Array.from(checkedBoxes).map(cb => cb.value);

    if (!titre) {
        alert("Il faut au moins donner un titre à ton idée !");
        return;
    }

    db.collection("date_ideas").add({
        titre: titre,
        date: date,
        prix: prix,
        lieu: lieu,
        categories: categories,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        // Vider le formulaire
        document.getElementById("nouvelleIdee").value = "";
        document.getElementById("dateIdee").value = "";
        document.getElementById("prixIdee").value = "";
        document.getElementById("lieuIdee").value = "";
        document.querySelectorAll('#categories input').forEach(cb => cb.checked = false);
    }).catch((error) => {
        console.error("Erreur: ", error);
        alert("Erreur lors de l'ajout");
    });
}

// --- 3. AFFICHER LES IDEES ---
function chargerIdees() {
    const container = document.getElementById("sorties");

    db.collection("date_ideas").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
        container.innerHTML = ""; // On vide avant de remplir

        if(snapshot.empty) {
            container.innerHTML = "<p>Aucune idée pour le moment... propose un truc !</p>";
            return;
        }

        snapshot.forEach((doc) => {
            const data = doc.data();
            const id = doc.id;

            // Création des badges catégories
            let badges = data.categories ? data.categories.map(cat => 
                `<span style="background:#eee; padding:2px 5px; border-radius:4px; font-size:10px; margin-right:3px;">${cat}</span>`
            ).join('') : '';

            const card = document.createElement("div");
            card.className = "carte";
            card.innerHTML = `
                <h3>${data.titre}</h3>
                <div style="margin:5px 0;">${badges}</div>
                <p style="font-size:14px; color:#555;">
                    📍 ${data.lieu || "Lieu mystère"}<br>
                    📅 ${data.date || "Pas de date"}<br>
                    💸 ${data.prix ? data.prix + "€" : "Gratuit ?"}
                </p>
                <button class="btn-delete" onclick="supprimerIdee('${id}')">Supprimer 🗑️</button>
            `;
            container.appendChild(card);
        });
    });
}

// --- 4. SUPPRIMER UNE IDEE ---
function supprimerIdee(id) {
    if(confirm("Tu veux vraiment supprimer cette idée ?")) {
        db.collection("date_ideas").doc(id).delete();
    }
}

// Lancement au chargement de la page
document.addEventListener("DOMContentLoaded", chargerIdees);
