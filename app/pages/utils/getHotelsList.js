// utils/getHotelsList.js
import axios from "axios";

// Amadeus API Credentials (Ensure these are stored securely in environment variables)
const TOKEN_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
const AMADEUS_API_URL_HOTELS = "https://test.api.amadeus.com/v3/reference-data/locations/hotels/by-city"; // URL for searching hotels by city
const CLIENT_ID = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_SECRET;

// Token cache to prevent unnecessary API calls
let cachedToken = null;
let tokenExpiryTime = null;

/**
 * Fetch a new access token from Amadeus API
 * @returns {Promise<string>} A valid access token
 */
const fetchAccessToken = async () => {
  try {
    const response = await axios.post(
      TOKEN_URL,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    // Cache the token and set the expiry time
    cachedToken = response.data.access_token;
    tokenExpiryTime = Date.now() + response.data.expires_in * 1000;

    console.log("✅ Token refreshed successfully");
    return cachedToken;
  } catch (error) {
    console.error("❌ Error fetching access token:", error.response?.data || error.message);
    throw new Error("Failed to fetch access token. Please check your Amadeus API credentials.");
  }
};

/**
 * Get a valid access token, using the cached one if still valid
 * @returns {Promise<string>} A valid access token
 */
const getValidAccessToken = async () => {
  if (cachedToken && tokenExpiryTime > Date.now()) {
    console.log("✅ Using cached token");
    return cachedToken;
  }
  return fetchAccessToken();
};

/**
 * Search for hotels by city using Amadeus API
 * @param {Object} searchParams - Additional search parameters (city, radius, radiusUnit, amenities, ratings, etc.)
 * @returns {Promise<Object>} Hotel search results
 */
const getHotelsByCity = async (searchParams) => {
  try {
    const {
      cityCode,
      radius = 10, // Default radius 10 km
      radiusUnit = "metric", // Default unit: metric (kilometers)
      chainCodes,
      amenities,
      ratings,
      hotelSource = "ALL", // Default hotel source: ALL
    } = searchParams;

    if (!cityCode) {
      throw new Error("❌ City code is required. Please provide a valid city code.");
    }

    // Get a valid access token
    const token = await getValidAccessToken();
    console.log("🔍 Searching hotels by city...");

    // Prepare the parameters for the API request
    const params = {
      cityCode, // The city code (IATA code) to search hotels in
      radius,   // Maximum distance (in kilometers or miles)
      radiusUnit, // Unit of measurement (metric or imperial)
      chainCodes: chainCodes ? chainCodes.join(",") : undefined, // Comma-separated list of hotel chain codes
      amenities: amenities ? amenities.join(",") : undefined, // List of amenities
      ratings: ratings ? ratings.join(",") : undefined, // Hotel stars (e.g., '3,4')
      hotelSource, // Source (e.g., 'BEDBANK', 'DIRECTCHAIN', 'ALL')
    };

    // Clean up any undefined parameters
    Object.keys(params).forEach((key) => params[key] === undefined && delete params[key]);

    // Fetch hotel offers from the Amadeus API
    const response = await axios.get(AMADEUS_API_URL_HOTELS, {
      params,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/vnd.amadeus+json",
      },
      timeout: 10000, // 10 seconds timeout
    });

    // Check if we got valid results
    if (response.data.data && response.data.data.length > 0) {
      console.log("✅ Hotel search successful:", response.data);
      return response.data.data;
    } else {
      console.log("❓ No hotels found with the provided parameters.");
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching hotel data:", error);

    if (error.response) {
      console.error("🛑 API Response Error:", {
        status: error.response.status,
        data: error.response.data,
      });

      switch (error.response.status) {
        case 401:
          throw new Error("🔑 Unauthorized: Invalid or expired access token.");
        case 400:
          throw new Error("📌 Bad Request: Check your search parameters.");
        case 404:
          throw new Error("❓ No results found: Try changing search criteria.");
        default:
          throw new Error(`⚠️ API Error: ${error.response.data.error_description || "Unexpected error."}`);
      }
    } else {
      throw new Error("🚨 Network error: Unable to connect to Amadeus API.");
    }
  }
};

export default getHotelsByCity;
