// app/pages/utils/axios.js

import axios from "axios";

const AMADEUS_API_URL = "https://test.api.amadeus.com/v2/shopping/flight-offers";

// Function to search for flights
export const searchFlights = async (accessToken, flightData) => {
  try {
    // Sending a POST request to the Amadeus API
    const response = await axios.post(AMADEUS_API_URL, flightData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,  // Using the access token for authentication
        "Content-Type": "application/json",  // Specifying the content type as JSON
      },
    });
    
    return response.data;  // Returning the data if the request is successful
  } catch (error) {
    // Log detailed error message with stack trace
    console.error("Error fetching flight data:", {
      message: error.message,  // Error message
      stack: error.stack,  // Full stack trace
      response: error.response?.data || "No response data",  // Response data (if any)
      config: error.config,  // Request configuration details
    });

    // Handle specific error cases based on the status code
    if (error.response) {
      if (error.response.status === 401) {
        // Unauthorized error: Check if the access token is correct
        throw new Error("Unauthorized: Check your access token.");
      } else if (error.response.status === 400) {
        // Bad request: This could be an issue with the flight parameters
        throw new Error("Bad request: Check the flight search parameters.");
      } else {
        // General HTTP error with the status code and response data
        throw new Error(`HTTP Error ${error.response.status}: ${error.response.data}`);
      }
    } else {
      // Unexpected error that doesn't have a response
      throw new Error("An unexpected error occurred while fetching flights.");
    }
  }
};


