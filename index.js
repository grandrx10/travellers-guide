const express = require('express');
require('dotenv').config();
// Create an Express application
const app = express();

// Define a route

// Start the serve


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(express.static('public'));


// let service_account = require('./travellers-guide-c9f6a-firebase-adminsdk-e9vt0-f05726b781.json')
const admin = require('firebase-admin');
// Initialize Firebase

admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": process.env.PROJECT_ID,
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": process.env.AUTH_URI,
    "token_uri": process.env.TOKEN_URI,
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": process.env.CERT_URL,
    "universe_domain": "googleapis.com"
  }),
  databaseURL: 'https://travellers-guide-c9f6a-default-rtdb.firebaseio.com' // URL to your Firebase Realtime Database
});

var locations = [];
var adjacency_list = {};
// Get a reference to the database service
const db = admin.database();
const dataRef = db.ref('map');

// Fetch data from the 'map' node in the database
dataRef.child('adjacency').once('value')
  .then((adjacencySnapshot) => {
    const adjacency = adjacencySnapshot.val();
    if (adjacency !== null) {
      adjacency_list = JSON.parse(adjacency);
    } else {
      console.log("No adjacency data available");
    }
  })
  .catch((error) => {
    console.error("Error reading adjacency data:", error);
  });

dataRef.child('locations').once('value')
  .then((locationsSnapshot) => {
    const locations_data = locationsSnapshot.val();
    if (locations !== null) {
      locations = JSON.parse(locations_data);
    } else {
      console.log("No locations data available");
    }
  })
  .catch((error) => {
    console.error("Error reading locations data:", error);
  });

  app.post("/send_data", (request, response) => {
    response.json({
        status: "success",
        body: JSON.stringify({"locations": locations, "adjacency_list" : adjacency_list})
    })
})
