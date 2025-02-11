import { useEffect, useState } from "react";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("/api/bookings", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setBookings(data));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>{booking.details}</li>
        ))}
      </ul>
    </div>
  );
}
