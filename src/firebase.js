/*const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const admin = require('firebase-admin')

const serviceAccount = require('../firebase.json')

initializeApp({
    credential: cert(serviceAccount)
})

const db = getFirestore()

module.exports = { db }

const message = {
    tokens: ["daiN_WAcS8KkIb2HLm73yY:APA91bEGE6FYtKTMV_wunmOHbIgqe5giLBWI4jYXpZxfRVf2bs5D-HxiZw-3FYyZCH1H2wkEkEqjQzA2poqMhJNIT0GBf7ro3cz1d7gtGkHq4-7TfDgQuVLKPVQdIdYzFZq3dRu3UbhG"],
    notification: {
      title: "Nueva reserva",
      body: "Se ha solicitado una nueva reserva",
    },
}

function message(message){
    db.sendMessage((message)=>{

    });
}*/

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require('../firebase.json');

initializeApp({
    credential: cert(serviceAccount)
  });

const db = getFirestore();

module.exports = { db }