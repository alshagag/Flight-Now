// app/pages/api/amadeusCORS.js
import axios from "axios";

const TOKEN_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
const HOTELS_BY_CITY_URL = "https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city";

const CLIENT_ID = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_SECRET;

let cachedToken = null;
let tokenExpiryTime = null;

const getValidAccessToken = async () => {
  if (cachedToken && tokenExpiryTime > Date.now()) {
    return cachedToken;
  }

  const response = await axios.post(
    TOKEN_URL,
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }).toString(),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  cachedToken = response.data.access_token;
  tokenExpiryTime = Date.now() + response.data.expires_in * 1000;
  return cachedToken;
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { cityCode } = req.query;
  if (!cityCode) {
    return res.status(400).json({ error: "City code is required" });
  }

  try {
    const token = await getValidAccessToken();
    const response = await axios.get(HOTELS_BY_CITY_URL, {
      params: { cityCode },
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching hotels:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to fetch hotels" });
  }
}
