// app/pages/utils/amadeus.js

import axios from "axios";

// URL for Amadeus API (TEST environment)
const AMADEUS_API_URL = "https://test.api.amadeus.com/v2/shopping/flight-offers"; 

// Function to search for flights using the Amadeus API
export const searchFlights = async (accessToken, flightData) => {
  try {
    // Sending GET request to the Amadeus API to fetch flight offers
    const response = await axios.get(AMADEUS_API_URL, {
      params: flightData,
      headers: {
        Authorization: `Bearer ${accessToken}`, // Authorization header with access token
        "Content-Type": "application/json", // Set content type to JSON
      },
      
    });

    // Return the data from the API response
    return response.data;
  } catch (error) {
    // Log error details for debugging
    console.error("Error fetching flight data:", {
      message: error.message, // Error message
      response: error.response?.data, // Error response data if available
      config: error.config, // Error configuration details
    });

    // Handle specific error cases based on status codes
    if (error.response?.status === 401) {
      throw new Error("Unauthorized: Check your access token."); // If unauthorized
    } else if (error.response?.status === 400) {
      throw new Error("Bad request: Check the flight search parameters."); // If bad request
    } else {
      throw new Error("An unexpected error occurred while fetching flights."); // For other errors
    }
  }
};
