const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.get('/api/hotel-offers', async (req, res) => {
  try {
    const response = await axios.get('https://test.api.amadeus.com/v1/shopping/hotel-offers', {
      params: {
        hotelIds: req.query.hotelIds,
        adults: req.query.adults,
        checkInDate: req.query.checkInDate,
      },
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY', // Amadeus API key
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
