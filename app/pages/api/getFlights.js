import { callAmadeusAPI } from "../../lib/amadeusApi";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { origin, destination, date, adults } = req.query;
    const endpoint = `/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${date}&adults=${adults}&max=5`;

    const flights = await callAmadeusAPI(endpoint);
    res.status(200).json(flights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
import { callAmadeusAPI } from "../../lib/amadeusApi";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { origin, destination, date, adults } = req.query;
    const endpoint = `/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${date}&adults=${adults}&max=5`;

    const flights = await callAmadeusAPI(endpoint);
    res.status(200).json(flights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
