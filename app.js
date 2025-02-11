const Amadeus = require('amadeus');
const express = require('express');
require('dotenv').config();

const app = express();

// Ensure API credentials are loaded
if (!process.env.API_KEY || !process.env.API_SECRET) {
  console.error("Missing API credentials!");
  process.exit(1); // Stop the app if no credentials are found
}

// Initialize the Amadeus SDK using keys from the .env file
const amadeus = new Amadeus({
  clientId: process.env.API_KEY,
  clientSecret: process.env.API_SECRET,
});

const port = 4000;

// Use static middleware to serve static files
app.use(express.static('public'));

// API endpoint for flight search
app.get('/api/flight', async (req, res) => {
  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: 'NYC',
      destinationLocationCode: 'LON',
      departureDate: '2025-02-08',
      adults: 1,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching flight data:', error);
    res.status(500).send('Failed to fetch flight data');
  }
});

// Start the server on port 4000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});