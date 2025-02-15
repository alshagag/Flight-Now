"use client"; // To enable event handling in React
import Image from "next/image";
import Link from 'next/link';
import './styles/globals.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useState, useEffect } from "react";
import { searchFlights } from "@/app/pages/utils/amadeus"; // Import flight search function

export default function Home() {
  const [origin, setOrigin] = useState(""); // Departure city
  const [destination, setDestination] = useState(""); // Arrival city
  const [departureDate, setDepartureDate] = useState(""); // Departure Date
  const [isOneWay, setIsOneWay] = useState(true); // One-way or round-trip
  const [adults, setAdults] = useState(1); // Number of Adults
  const [children, setChildren] = useState(0); // Number of Children
  const [infants, setInfants] = useState(0); // Number of Infants
  const [travelClass, setTravelClass] = useState(""); // Travel class (Economy, Business, etc.)
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState("");
  const [isHydrated, setIsHydrated] = useState(false); // Ensure hydration

  useEffect(() => {
    setIsHydrated(true); // Set hydration state once component has mounted
  }, []);

  const handleSearch = async () => {
    try {
      const response = await searchFlights("8iyopPrjVSFaG2MrkObbg6P92J4y",{ // Access token Amadeus API 
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate,
        returnDate: isOneWay ? null : returnDate,
        adults,
        children,
        infants,
        travelClass: travelClass === "" ?  "ECONOMY" : travelClass ?? "ECONOMY",
        currencyCode: "GBP"
      });

      setFlights(response.data); // Update flight data
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
        {/* Header with Logo and Navigation */}
        <header className="bg-blue-600 text-white py-4">
          <div className="container mx-auto flex justify-between items-center px-4">
            <div className="flex items-center">
              <Image
                src="/logo.png" // logo path
                alt="Flight Now Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <h1 className="text-[18px] sm:text-[24px] md:text-[30px] font-bold">Flight Now</h1>
            </div>
  
            <nav className="flex gap-4">
              <a href="#" className="hover:underline">Home</a>
              <a href="#" className="hover:underline">Offers</a>
              <a href="/about" className="hover:underline">about</a>
              {/* path to login page */}
              <Link href="/auth/login">
                <button className="bg-white text-blue-600 px-4 py-1 rounded">
                  Login
                </button>
              </Link>
            </nav>
          </div>
        </header>

      {/* Hero Section */}
      <div className="hero-section bg-blue-500 text-white text-center py-32">
        <h1 className="text-4xl font-bold">Discover New Destinations</h1>
        <p className="mt-4">Book your flight today and enjoy a unique travel experience!</p>
        <div className="flex justify-center items-center mt-4"></div>
        <Link href="/auth/login">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
            Get Started
            </button>
        </Link>
      </div>

      {/* Search Form */}
      <div className="container mx-auto px-4 my-8">
        <h2 className="text-center text-2xl font-bold mb-4">Search Flights</h2>
        <div className="bg-white shadow-lg rounded-lg p-6">
          {/* Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="departure-city" className="block text-sm font-medium mb-1">
                <i className="fas fa-plane-departure mr-2"></i> Departure City
              </label>
              <div className="flex">
                <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l">
                  <i className="fas fa-map-marker-alt"></i>
                </button>
                <input
                  id="departure-city"
                  type="text"
                  placeholder="Enter departure city"
                  className="border p-2 flex-1"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />
                <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="arrival-city" className="block text-sm font-medium mb-1">
                <i className="fas fa-plane-arrival mr-2"></i> Arrival City
              </label>
              <div className="flex">
                <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l">
                  <i className="fas fa-map-marker-alt"></i>
                </button>
                <input
                  id="arrival-city"
                  type="text"
                  placeholder="Enter arrival city"
                  className="border p-2 flex-1"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
                <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="departure-date" className="block text-sm font-medium mb-1">
                <i className="fas fa-calendar-alt mr-2"></i> Departure Date
              </label>
              <div className="flex">
                <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l">
                  <i className="fas fa-calendar-alt"></i>
                </button>
                <input
                  id="departure-date"
                  type="date"
                  className="border p-2 flex-1"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                />
              </div>
            </div>
            {!isOneWay && (
              <div>
                <label htmlFor="return-date" className="block text-sm font-medium mb-1">
                  <i className="fas fa-calendar-alt mr-2"></i> Return Date
                </label>
                <div className="flex">
                  <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l">
                    <i className="fas fa-calendar-alt"></i>
                  </button>
                  <input
                    id="return-date"
                    type="date"
                    className="border p-2 flex-1"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Flight Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              <i className="fas fa-plane mr-2"></i> Flight Type
            </label>
            <div className="flex gap-4">
              <button
                className={`px-4 py-2 rounded ${isOneWay ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                onClick={() => setIsOneWay(true)}
              >
                One-way
              </button>
              <button
                className={`px-4 py-2 rounded ${!isOneWay ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                onClick={() => setIsOneWay(false)}
              >
                Round-trip
              </button>
            </div>
          </div>

          {/* Travel Class */}
          <div className="mb-6">
            <label htmlFor="travel-class" className="block text-sm font-medium mb-1">
              <i className="fas fa-cogs mr-2"></i> Travel Class
            </label>
            <select
              id="travel-class"
              className="border p-2 rounded w-full"
              value={travelClass}
              onChange={(e) => setTravelClass(e.target.value)}
            >
              <option selected value="ECONOMY">Economy</option>
              <option value="BUSINESS">Business</option>
              <option value="FIRST">First Class</option>
            </select>
          </div>

          {/* Passengers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="adults" className="block text-sm font-medium mb-1">
                <i className="fas fa-user mr-2"></i> Adults (12+ years)
              </label>
              <div className="flex">
                <button
                  className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l"
                  onClick={() => setAdults(adults > 1 ? adults - 1 : 1)}
                >
                  -
                </button>
                <input
                  id="adults"
                  type="number"
                  min="1"
                  className="border p-2 flex-1 text-center"
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                />
                <button
                  className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r"
                  onClick={() => setAdults(adults + 1)}
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="children" className="block text-sm font-medium mb-1">
                <i className="fas fa-child mr-2"></i> Children (2-12 years)
              </label>
              <div className="flex">
                <button
                  className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l"
                  onClick={() => setChildren(children > 0 ? children - 1 : 0)}
                >
                  -
                </button>
                <input
                  id="children"
                  type="number"
                  min="0"
                  className="border p-2 flex-1 text-center"
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                />
                <button
                  className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r"
                  onClick={() => setChildren(children + 1)}
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="infants" className="block text-sm font-medium mb-1">
                <i className="fas fa-baby mr-2"></i> Infants (0-2 years)
              </label>
              <div className="flex">
                <button
                  className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l"
                  onClick={() => setInfants(infants > 0 ? infants - 1 : 0)}
                >
                  -
                </button>
                <input
                  id="infants"
                  type="number"
                  min="0"
                  className="border p-2 flex-1 text-center"
                  value={infants}
                  onChange={(e) => setInfants(Number(e.target.value))}
                />
                <button
                  className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r"
                  onClick={() => setInfants(infants + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              onClick={handleSearch}
            >
              <i className="fas fa-search mr-2"></i> Search Flights
            </button>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
      </div>

      {/* Flight Results */}
      {flights.length > 0 && (
        <div className="container mx-auto px-4 my-8">
          <h2 className="text-center text-2xl font-bold mb-4">Flight Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flights.map((flight) => (
        <div key={flight.id} className="border p-4 rounded-lg shadow-md mb-4">
          <h3 className="text-lg font-semibold">Flight {flight.id}</h3>
          <p className="text-gray-600">Total Price: {flight.price.total} {flight.price.currency}</p>
          <div className="mt-2">
            {flight.itineraries.map((itinerary, index) => (
              <div key={index} className="border-t mt-2 pt-2">
                <h4 className="text-md font-medium">Duration: {itinerary.duration}</h4>
                {itinerary.segments.map((segment) => (
                  <div key={segment.id} className="mt-2 p-2 bg-gray-100 rounded-md">
                    <p>
                      <strong>From:</strong> {segment.departure.iataCode} ({segment.departure.at})
                    </p>
                    <p>
                      <strong>To:</strong> {segment.arrival.iataCode} ({segment.arrival.at})
                    </p>
                    <p>
                      <strong>Airline:</strong> {flight.validatingAirlineCodes[0]} ({segment.carrierCode} {segment.number})
                    </p>
                    <p>
                      <strong>Aircraft:</strong> {segment.aircraft.code}
                    </p>
                    <p>
                      <strong>Duration:</strong> {segment.duration}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
          </div>
        </div>
      )}

      
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
            <div key={dest.name} className="bg-white shadow-lg rounded-lg p-6">
              <Image
                src={dest.img}
                alt={dest.name}
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{dest.name}</h3>
                <p className="mt-2">{dest.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-4 text-center">
        <p>&copy; 2025 Flight Now Travel Agency. All rights reserved.</p>
      </footer>
    </main>
  );
}