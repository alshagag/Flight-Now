// app/page.js

"use client"; // To enable event handling in React
import Image from "next/image";
import './styles/globals.css';

import { useState, useEffect } from "react";
import { searchFlights } from "@/app/pages/utils/amadeus"; // Import flight search function

export default function Home() {
  const [origin, setOrigin] = useState(""); // Departure city
  const [destination, setDestination] = useState(""); // Arrival city
  const [departureDate, setDepartureDate] = useState(""); // Departure Date
  const [returnDate, setReturnDate] = useState(""); // Return Date
  const [adults, setAdults] = useState(1); // Number of Adults
  const [children, setChildren] = useState(0); // Number of Children
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState("");
  const [isHydrated, setIsHydrated] = useState(false); // Ensure hydration

  // UseEffect hook to avoid issues with SSR by ensuring code runs only after the component mounts in the client
  useEffect(() => {
    setIsHydrated(true); // Set hydration state once component has mounted
  }, []);

  const handleSearch = async () => {
    console.log("Search flights using the following data:");
    console.log(`Departure city: ${origin}`);
    console.log(`Arrival city: ${destination}`);
    console.log(`Departure date: ${departureDate}`);
    console.log(`Return date: ${returnDate}`);
    console.log(`Number of adults: ${adults}`);
    console.log(`Number of children: ${children}`);
    
    try {
      const response = await searchFlights({
        origin,
        destination,
        departureDate,
        returnDate,
        adults,
        children,
      });

      setFlights(response); // Update flight data
      setError(""); // Clear any previous errors
    } catch (err) {
      setError("Failed to fetch flights. Please try again later.");
      setFlights([]); // Clear the flight data
    }
  };

  if (!isHydrated) {
    return null; // Prevent rendering until hydration is complete
  }

  return (
    <main>
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 text-center">
        <h1 className="text-2xl font-bold">Flight Now Travel Agency</h1>
        <nav className="flex justify-center mt-2 gap-4">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Flights</a>
          <a href="#" className="hover:underline">Offers</a>
          <button className="bg-white text-blue-600 px-4 py-1 rounded">Login</button>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="hero-section text-center text-white py-32">
        <h1 className="text-4xl font-bold">Discover New Destinations</h1>
        <p className="mt-4">Book your flight today and enjoy a unique travel experience!</p>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 my-8">
        <h2 className="text-center text-2xl font-bold mb-4">Search Flights & Hotels</h2>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button className="bg-blue-600 text-white px-6 py-2 rounded">Flights</button>
        <button className="bg-gray-300 px-6 py-2 rounded">Hotels</button>
      </div>

      {/* Form Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Departure City */}
        <div>
          <label htmlFor="departure-city" className="block text-sm font-medium mb-1">Departure City</label>
          <input
            id="departure-city"
            type="text"
            placeholder="Enter departure city"
            className="border p-2 rounded w-full"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
        </div>

        {/* Arrival City */}
        <div>
          <label htmlFor="arrival-city" className="block text-sm font-medium mb-1">Arrival City</label>
          <input
            id="arrival-city"
            type="text"
            placeholder="Enter arrival city"
            className="border p-2 rounded w-full"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        {/* Departure Date */}
        <div>
          <label htmlFor="departure-date" className="block text-sm font-medium mb-1">Departure Date</label>
          <input
            id="departure-date"
            type="date"
            className="border p-2 rounded w-full"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
          />
        </div>

        {/* Return Date */}
        <div>
          <label htmlFor="return-date" className="block text-sm font-medium mb-1">Return Date</label>
          <input
            id="return-date"
            type="date"
            className="border p-2 rounded w-full"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Adults */}
          <div>
            <label htmlFor="adults" className="block text-sm font-medium mb-1">Adults</label>
            <input
              id="adults"
              type="number"
              min="1"
              className="border p-2 rounded w-full"
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))} // Convert string to number
            />
          </div>

          {/* Children */}
          <div>
            <label htmlFor="children" className="block text-sm font-medium mb-1">Children</label>
            <input
              id="children"
              type="number"
              min="0"
              className="border p-2 rounded w-full"
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))} // Convert string to number
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            onClick={handleSearch}
          >
            Search Flights
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>

      {/* Popular Destinations */}
      <div className="container mx-auto px-4 my-8">
        <h2 className="text-center text-2xl font-bold mb-4">Popular Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: "Paris",
              img: "https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
              desc: "The capital of love and art.",
            },
            {
              name: "London",
              img: "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
              desc: "A city rich in history and culture.",
            },
            {
              name: "New York",
              img: "https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
              desc: "The city of dreams.",
            },
          ].map((dest) => (
            <div key={dest.name} className="bg-white shadow rounded overflow-hidden">
              <Image
                src={dest.img}
                alt={dest.name}
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{dest.name}</h3>
                <p className="text-gray-500">{dest.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Flight Now Travel Agency</p>
          <nav>
            <a href="#" className="mx-2 hover:underline">Privacy Policy</a>
            <a href="#" className="mx-2 hover:underline">Terms of Service</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
