import axios from "axios";

// Amadeus API Credentials (Ensure these are stored securely in environment variables)
const TOKEN_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
const AMADEUS_API_URL_HOTELS = "https://test.api.amadeus.com/v3/shopping/hotel-offers"; // URL for Hotels
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
 * Helper function to calculate checkInDate from checkOutDate
 * @param {string} checkOutDate - The check-out date (e.g., '2023-11-22')
 * @returns {string} checkInDate - The calculated check-in date (the day before checkOutDate)
 */
const getCheckInDateFromCheckOut = (checkOutDate) => {
  // Ensure the checkOutDate is valid
  if (!checkOutDate || isNaN(new Date(checkOutDate).getTime())) {
    throw new Error("❌ Invalid check-out date provided. Please check the date format.");
  }

  const checkOut = new Date(checkOutDate); // Convert checkOutDate to Date object
  checkOut.setDate(checkOut.getDate() -1 ); // Subtract 1 day to get checkInDate
  return checkOut.toISOString().split('T')[0]; // Return the date in 'YYYY-MM-DD' format
};

/**
 * Search for hotels using Amadeus API by hotelIds
 * @param {Object} searchParams - Additional search parameters (hotelIds, adults, checkInDate, checkOutDate, etc.)
 * @returns {Promise<Object>} Hotel search results
 */
export const getMultiHotelOffers = async (searchParams) => {
  try {
    // Destructure parameters from searchParams
        const { hotelIds, _, checkOutDate, adults, countryOfResidence } = searchParams;

    // Ensure checkOutDate is provided and valid
    if (!checkOutDate || isNaN(new Date(checkOutDate).getTime())) {
      throw new Error("❌ Check-out date is required. Please provide a valid check-out date.");
    }

    // Get a valid access token
    const token = await getValidAccessToken();
    console.log("🔍 Searching hotels...");

    // Calculate checkInDate based on checkOutDate
    const checkInDate = getCheckInDateFromCheckOut(checkOutDate);

    // Fetch hotel offers from the Amadeus API
    const response = await axios.get(AMADEUS_API_URL_HOTELS, {
      params: {
        "hotelIds" : hotelIds.map(hotelId => hotelId.trim()).join(","), // Comma-separated list of hotelIds
        adults,
      },
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/vnd.amadeus+json",
      },
      timeout: 10000 // 10 seconds timeout
    });

    // Check if we got valid results
    if (response.data.offers && response.data.offers.length > 0) {
      console.log("✅ Hotel search successful:", response.data);
      return response.data;
    } else {
      console.log("❓ No hotels found with the provided parameters.");
      return response.data;
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
