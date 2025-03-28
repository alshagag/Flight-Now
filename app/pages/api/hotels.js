// app/pages/api/hotels.js
import { searchHotels } from '../../utils/getHotelsList';

export default async function handler(req, res) {
  try {
    const { cityCode } = req.query;

    if (!cityCode) {
      return res.status(400).json({ error: 'City code is required' });
    }

    const hotels = await searchHotels(cityCode);
    res.status(200).json(hotels);
  } catch (error) {
    console.error('❌ Error fetching hotels:', error);
    res.status(500).json({ error: 'Failed to fetch hotel data' });
  }
}
