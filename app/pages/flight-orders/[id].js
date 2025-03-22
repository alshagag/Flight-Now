// pages/flight-orders/[id].js
import { useRouter } from "next/router";

export default function FlightOrderPage() {
  const router = useRouter();
  const { id } = router.query; // Extract flight ID from link

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold my-6">Booking Flight {id}</h1>
      <p>Here you can confirm your booking for flight ID: {id}.</p>

      <button 
        className="bg-green-600 text-white px-4 py-2 mt-4 rounded"
        onClick={() => alert(`Booking confirmed for flight ${id}!`)}
      >
        Confirm Booking
      </button>
    </div>
  );
}