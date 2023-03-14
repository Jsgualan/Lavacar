//require("dotenv").config();
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp({
  credential: applicationDefault(),
  projectId: 'lavacar-ac83',
});

const db = getFirestore();

module.exports = {
  db,
};