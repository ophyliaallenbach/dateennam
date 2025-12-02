const firebaseConfig = {
  apiKey: "AIzaSyD9bzSuQY8CR9RVnQMu6WI4plznzQrfBC4",
  authDomain: "date-d927b.firebaseapp.com",
  projectId: "date-d927b",
  storageBucket: "date-d927b.firebasestorage.app",
  messagingSenderId: "353304192798",
  appId: "1:353304192798:web:1511fa87bfbf11bdda0b0f",
  measurementId: "G-T4N8PMNC3G"
};
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function ajouterIdee() {
  const idee = document.getElementById('nouvelleIdee').value.trim();
  if (!idee) {
    alert("Propose quelque chose !");
    return;
  }
  db.collection('sorties').add({ texte: idee }).then(() => {
    document.getElementById('nouvelleIdee').value = '';
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
      const p = document.createElement('p');
      p.textContent = data.texte;

      // Bouton supprimer
      const btn = document.createElement('button');
      btn.textContent = "Supprimer";
      btn.style.marginLeft = "10px";
      btn.onclick = () => {
        db.collection('sorties').doc(doc.id).delete().then(afficherIdees);
      };
      p.appendChild(btn);

      sortiesDiv.appendChild(p);
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  afficherIdees();

  // Ajout de l'option "Entrée" pour valider plus vite
  document.getElementById('nouvelleIdee').addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
      ajouterIdee();
    }
  });
});
