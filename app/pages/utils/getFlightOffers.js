import axios from "axios";

// Amadeus API Credentials (Ensure these are stored securely in environment variables)
const TOKEN_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
const AMADEUS_API_URL = "https://test.api.amadeus.com/v2/shopping/flight-offers";
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
 * Search for flights using Amadeus API
 * @param {Object} flightData - Flight search parameters
 * @returns {Promise<Object>} Flight search results
 */
export const searchFlights = async (flightData) => {
  try {
    // Get a valid access token
    const token = await getValidAccessToken();
    console.log("🔍 Searching flights...");

    // Fetch flight offers from the Amadeus API
    const response = await axios.get(AMADEUS_API_URL, {
      params: flightData,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/vnd.amadeus+json",
      },
    });

    // Check if we only got the count and a link to the actual flight details
    if (response.data.meta.count > 0) {
      const flightDetailsLink = response.data.meta.links.self;

      // If there's a link, fetch the flight details from that URL
      if (flightDetailsLink) {
        const flightDetailsResponse = await axios.get(flightDetailsLink, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("✅ Flight details fetched successfully");
        return flightDetailsResponse.data; // Return flight details
      }
    }

    // Return the search result with count and other metadata
    console.log("✅ Flight search successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching flight data:", error);

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