// Configuration Firebase
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
  const categorie = document.getElementById('categorieIdee').value;
  const prix = document.getElementById('prixIdee').value;
  const lieu = document.getElementById('lieuIdee').value.trim();

  if (!idee) {
    alert("Propose quelque chose !");
    return;
  }

  db.collection('sorties').add({
    texte: idee,
    date: date,
    categorie: categorie,
    prix: prix,
    lieu: lieu
  }).then(() => {
    // Réinitialiser les champs
    document.getElementById('nouvelleIdee').value = '';
    document.getElementById('dateIdee').value = '';
    document.getElementById('prixIdee').value = '';
    document.getElementById('lieuIdee').value = '';
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
