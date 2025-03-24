import getHotelsByCity from "../../utils/getHotelsList"; // Import the function to fetch hotels
import getCityCode from "../../utils/getCityCode"; // Helper function to get city code from the destination

// API route handler for fetching hotels
export default async (req, res) => {
  const { origin, destination, departureDate, returnDate, adults, children } = req.query;

  // Ensure all required parameters are present
  if (!destination) {
    return res.status(400).json({ error: "❌ Destination is required." });
  }

  try {
    // Get the city code for the destination city (you might use a helper function like getCityCode)
    const cityCode = await getCityCode(destination);  // This function should return a valid city code for the destination.

    // Prepare the search parameters to pass to getHotelsByCity
    const searchParams = {
      cityName: destination,  // Destination city name (to get the city code dynamically)
      radius: 10,             // Default to 10 km radius
      radiusUnit: "metric",   // Default radius unit: kilometers
      adults: parseInt(adults, 10),   // Ensure adults are a number
      children: parseInt(children, 10), // Ensure children is a number
    };

    // Fetch hotels using the helper function
    const hotels = await getHotelsByCity(searchParams);

    // Return the hotel data as the response
    return res.status(200).json(hotels);  // Sending the hotel list in the response
  } catch (error) {
    console.error("❌ Error in getHotels API:", error);
    return res.status(500).json({ error: "❌ Something went wrong while fetching hotel data." });
  }
};
