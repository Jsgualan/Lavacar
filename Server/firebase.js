//require("dotenv").config();
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("../firebase.json");

initializeApp({
  credential: cert(serviceAccount),
});

initializeApp({
  credential: applicationDefault(),
  projectId: 'lavacar-ac83',
});

const db = getFirestore();

module.exports = {
  db,
};

