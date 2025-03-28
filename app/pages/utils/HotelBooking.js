import { useState } from "react";

const HotelBooking = ({ offerId }) => {
  const [guestName, setGuestName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const bookingData = {
      offerId: offerId,
      guests: [{ name: guestName, contact: { phone: "+123456789", email: "guest@example.com" } }],
      payment: {
        number: cardNumber,
        expiryDate: expiryDate,
        cvv: cvv,
        vendorCode: "VI", // Visa (Example)
      },
    };

    try {
      const response = await fetch("/api/bookHotel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setMessage("✅ Booking successful!");
    } catch (error) {
      setMessage("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-700 mb-4">🏨 Book Your Hotel</h2>
      {message && <p className="text-center mb-4">{message}</p>}

      <form onSubmit={handleBooking} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="MM/YY"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
            className="w-1/2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            required
            className="w-1/2 p-2 border border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
};

export default HotelBooking;