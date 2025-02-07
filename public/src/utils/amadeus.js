// src/utils/amadeus.js
import axios from "axios";

const AMADEUS_API_URL = "https://test.api.amadeus.com/v2/shopping/flight-offers"; // Link Sandbox

export const searchFlights = async (accessToken, flightData) => {
  try {
    const response = await axios.post(AMADEUS_API_URL, flightData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    // Log error details
    console.error("Error fetching flight data:", {
      message: error.message,
      response: error.response?.data,
      config: error.config,
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      throw new Error("Unauthorized: Check your access token.");
    } else if (error.response?.status === 400) {
      throw new Error("Bad request: Check the flight search parameters.");
    } else {
      throw new Error("An unexpected error occurred while fetching flights.");
    }
  }
};

