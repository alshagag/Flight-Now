
// app/pages/utils/getHotelsList.js
import axios from "axios";

// Amadeus API Credentials
const TOKEN_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
const AMADEUS_API_URL_HOTELS_BY_CITY = "https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city";
const AMADEUS_API_URL_HOTEL_OFFERS = "https://test.api.amadeus.com/v3/shopping/hotel-offers";
const AMADEUS_API_URL_BOOK_HOTEL = "https://test.api.amadeus.com/v1/booking/hotel-orders";

const CLIENT_ID = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_SECRET;

// Token caching
let cachedToken = null;
let tokenExpiryTime = 0;

// Function to fetch a valid access token from Amadeus API
const getValidAccessToken = async () => {
  if (cachedToken && tokenExpiryTime > Date.now()) {
    console.log("✅ Using cached token");
    return cachedToken;
  }

  try {
    const { data } = await axios.post(
      TOKEN_URL,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    cachedToken = data.access_token;
    tokenExpiryTime = Date.now() + data.expires_in * 1000;
    console.log("🔑 Token refreshed successfully");

    return cachedToken;
  } catch (error) {
    console.error("❌ Error fetching access token:", error.response?.data || error.message);
    throw new Error("Failed to fetch access token. Please check your Amadeus API credentials.");
  }
};

// Function to fetch hotels by city code
export const getHotelsByCity = async (cityCode) => {
  if (!cityCode) throw new Error("❌ City code is required.");

  const token = await getValidAccessToken();

  try {
    const { data } = await axios.get(AMADEUS_API_URL_HOTELS_BY_CITY, {
      params: { cityCode },
      headers: { Authorization: `Bearer ${token}` },
    });

    return data.data.map((hotel) => hotel.hotelId) || [];
  } catch (error) {
    console.error("❌ Error fetching hotels:", error.response?.data || error.message);
    throw new Error("❌ Failed to fetch hotels.");
  }
};

// Function to fetch multiple hotel offers based on hotel IDs
export const getMultiHotelOffers = async (hotelIds) => {
  if (!Array.isArray(hotelIds) || hotelIds.length === 0) {
    throw new Error("❌ Hotel IDs are required.");
  }

  const token = await getValidAccessToken();

  try {
    const { data } = await axios.get(AMADEUS_API_URL_HOTEL_OFFERS, {
      params: { hotelIds: hotelIds.join(",") },
      headers: { Authorization: `Bearer ${token}` },
    });

    return data.data || [];
  } catch (error) {
    console.error("❌ Error fetching hotel offers:", error.response?.data || error.message);
    throw new Error("❌ Failed to fetch hotel offers.");
  }
};

// Function to book a hotel room
export const bookHotelRoom = async (bookingData) => {
  if (!bookingData || typeof bookingData !== "object") {
    throw new Error("❌ Invalid booking data.");
  }

  const token = await getValidAccessToken();

  try {
    const { data } = await axios.post(AMADEUS_API_URL_BOOK_HOTEL, bookingData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });

    return data;
  } catch (error) {
    console.error("❌ Error booking hotel:", error.response?.data || error.message);
    throw new Error("❌ Failed to complete booking.");
  }
};

// Main function to search for hotels
export const searchHotels = async (cityCode) => {
  if (!cityCode) throw new Error("❌ City code is required.");

  const hotelIds = await getHotelsByCity(cityCode);
  if (!hotelIds.length) {
    console.log("❌ No hotels found in the city.");
    return [];
  }

  return await getMultiHotelOffers(hotelIds);
};

// Adding the fetchHotels function to work with the API route
export const fetchHotels = async (cityCode) => {
  try {
    const response = await fetch(`/api/hotels?cityCode=${cityCode}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch hotel data');
    }

    return data;
  } catch (error) {
    console.error("Error fetching hotel data:", error);
  }
};

