const express = require("express");
const axios = require("axios");
const admin = require("firebase-admin");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path"); // Add this line
const dotenv = require("dotenv");
dotenv.config();
// Initialize Express app
const app = express();
const port = 4001;

// Enable CORS middleware
app.use(cors());

// Enable body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Firebase Admin SDK
const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"), // Convert escaped newlines to actual newlines
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://earthquake-41704-default-rtdb.firebaseio.com",
});

// Reference to the Firebase database
const db = admin.database();

// Function to check if earthquake data already exists in Firebase
const doesEarthquakeExist = async (earthquake) => {
  const snapshot = await db
    .ref("earthquakes")
    .orderByChild("dateTime")
    .equalTo(earthquake.DateTime)
    .once("value");

  return snapshot.exists();
};

// Function to fetch and store earthquake data
// Function to fetch and store earthquake data
// Function to fetch and store earthquake data
const fetchAndStoreEarthquakeData = async () => {
  try {
    const response = await axios.get(
      "https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json"
    );
    const data = response.data;

    // Process the earthquake data
    for (const earthquake of data.Infogempa.gempa) {
      const earthquakeExists = await doesEarthquakeExist(earthquake);

      if (!earthquakeExists) {
        const dateTime = earthquake.DateTime;
        const wilayah = earthquake.Wilayah;
        const magnitude = earthquake.Magnitude;
        const kedalaman = earthquake.Kedalaman;
        const jam = earthquake.Jam;
        const tanggal = earthquake.Tanggal;
        const coordinates = earthquake.Coordinates;
        const bujur = earthquake.Bujur;
        const lintang = earthquake.Lintang;
        const potensi = earthquake.Potensi;

        // ... (extract other relevant information)

        // Store the earthquake data in Firebase
        const newEarthquakeRef = db.ref("earthquakes");
        const newEarthquakeKey = newEarthquakeRef.push().key;

        const newEarthquakeData = {
          dateTime,
          wilayah,
          magnitude,
          kedalaman,
          jam,
          tanggal,
          bujur,
          lintang,
          potensi,
          coordinates,
          // ... (store other relevant information)
        };

        const updates = {};
        updates[`earthquakes/${newEarthquakeKey}`] = newEarthquakeData;
        db.ref().update(updates);
      } else {
        console.log("Data already exists, not added to Firebase.");
      }
    }

    console.log("Earthquake data stored in Firebase successfully!");
  } catch (error) {
    console.error("Error fetching or storing earthquake data:", error.message);
  }
};

// Watch the BMKG API at an interval
const interval = 900000; // Check data every minute
setInterval(fetchAndStoreEarthquakeData, interval);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));
// Start the Express server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
