
// flight-orders/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function FlightOrderDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return; // Wait for id to be available

    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`/api/flight-orders/${id}`);
        setOrder(response.data);
      } catch (err) {
        console.error("Error fetching flight order:", err);
        setError("Failed to fetch flight order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!order) return <p>No flight order found.</p>;

  return (
    <div>
      <h1>Flight Order Details for {id}</h1>
      <p>Itinerary: {order.itinerary}</p>
      <p>Passenger: {order.passengerName}</p>
      <p>Price: {order.price}</p>
      {/* Additional order details and actions */}
    </div>
  );
}
