import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const HotelDetails = () => {
  const router = useRouter();
  const { id } = router.query; // Get hotel offer ID from URL
  const [hotelData, setHotelData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchHotelDetails = async () => {
      try {
        const response = await fetch(`/api/hotelDetails?id=${id}`);
        const data = await response.json();
        setHotelData(data);
      } catch (error) {
        console.error("Error fetching hotel details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id]);

  if (loading) return <p className="text-center mt-10">⏳ Loading hotel details...</p>;

  if (!hotelData) return <p className="text-center mt-10 text-red-500">🚫 Hotel details not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-2xl font-bold">{hotelData.hotel.name}</h1>
      <p className="text-gray-600">📍 {hotelData.hotel.cityCode}</p>
      <p className="text-gray-600">💰 {hotelData.offers[0].price.total} {hotelData.offers[0].price.currency}</p>
      <p className="text-gray-700 mt-4">{hotelData.offers[0].room.description.text}</p>
      
      <a href={hotelData.offers[0].self} target="_blank" rel="noopener noreferrer">
        <button className="bg-blue-600 text-white px-4 py-2 mt-4 rounded-lg w-full hover:bg-blue-700 transition">
          Book Now
        </button>
      </a>
    </div>
  );
};

export default HotelDetails;
