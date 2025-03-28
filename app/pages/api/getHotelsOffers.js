// utils/getHotelOffers.js
import axios from "axios";

// Amadeus API Credentials (Ensure these are stored securely in environment variables)
const TOKEN_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
const AMADEUS_API_URL_HOTELS = "https://test.api.amadeus.com/v3/shopping/hotel-offers"; // URL for Hotels
const CLIENT_ID = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_SECRET;

let accessToken = null;

async function getAccessToken() {
    if (accessToken) return accessToken;

    try {
        const response = await axios.post(TOKEN_URL, new URLSearchParams({
            grant_type: "client_credentials",
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        }), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        accessToken = response.data.access_token;
        return accessToken;
    } catch (error) {
        console.error("❌ Error fetching access token:", error);
        throw new Error("Failed to retrieve access token");
    }
}

export async function getMultiHotelOffers(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { hotelIds } = req.query;
    if (!hotelIds) {
        return res.status(400).json({ error: 'Missing required parameter: hotelIds' });
    }

    try {
        console.log("🔍 Fetching hotel data for hotelIds:", hotelIds);
        const token = await getAccessToken();
        
        const response = await axios.get(AMADEUS_API_URL_HOTELS, {
            params: { hotelIds },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("✅ Hotel data fetched successfully:", response.data);
        
        const hotels = response.data.data.map(hotel => ({
            id: hotel.hotel.hotelId,
            name: hotel.hotel.name,
            location: {
                latitude: hotel.hotel.latitude,
                longitude: hotel.hotel.longitude,
            },
            available: hotel.available,
            offers: hotel.offers.map(offer => ({
                id: offer.id,
                checkIn: offer.checkInDate,
                checkOut: offer.checkOutDate,
                price: `${offer.price.total} ${offer.price.currency}`,
                room: offer.room.description.text,
                cancellation: offer.policies.cancellation?.description.text || 'No cancellation policy provided',
                bookingLink: offer.self,
            })),
            searchLink: hotel.self,
        }));

        res.status(200).json({ hotels });
    } catch (error) {
        console.error("❌ Error fetching hotel data:", error);
        
        if (error.response) {
            console.error("🛑 API Response Error:", {
                status: error.response.status,
                data: error.response.data,
            });

            const errorMessages = {
                401: "🔑 Unauthorized: Invalid or expired access token.",
                400: "📌 Bad Request: Check your search parameters.",
                404: "❓ No results found: Try changing search criteria.",
            };
            res.status(error.response.status).json({ error: errorMessages[error.response.status] || "Unknown error occurred." });
        } else {
            res.status(500).json({ error: 'Failed to fetch hotel offers' });
        }
    }
}

export default getMultiHotelOffers;
