"use client"; // Enable event handling in React
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { searchFlights } from "@/app/pages/utils/getFlightOffers";
import { getMultiHotelOffers } from "@/app/pages/utils/getHotelsOffers";
import getHotelsByCity from "@/app/pages/utils/getHotelsList"; 
import { cityMapping } from "@/app/pages/src/components/cityMapping";

import "./styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Home() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split("T")[0]);
  const [returnDate, setReturnDate] = useState("");
  const [isOneWay, setIsOneWay] = useState(true);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [travelClass, setTravelClass] = useState("ECONOMY");
  const [currencyCode, setCurrencyCode] = useState("GBP");
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [needHotel, setNeedHotel] = useState(false);  
  const [checkOutDate, setCheckOutDate] = useState("");
    

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSearch = async () => {
    if (!origin || !destination || !departureDate) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const flightData = {
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate,
        ...(isOneWay ? {} : { returnDate }),
        adults,
        children,
        infants,
        travelClass,
        currencyCode,
        max: 10,
      };

      const response = await searchFlights(flightData);
      const flightOffers = response?.data || [];

      if (flightOffers.length > 0) {
        setFlights(flightOffers);
      } else {
        setError("No flights available for the selected criteria.");
      }

      if (needHotel && checkOutDate) {
        await handleHotelSearch();
      }

    } catch (err) {
      console.error("Flight search error:", err);
      setError("Failed to fetch flights. Please try again later.");
      setFlights([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHotelSearch = async () => {
    try {
      setIsLoading(true);

      if (!destination) {
        setError("Please select a destination to search for hotels.");
        return;
      }

      const hotelsByCity = await getHotelsByCity(destination);
      if (!hotelsByCity || hotelsByCity.length === 0) {
        setError("No hotels found in this destination.");
        return;
      }

      const hotelIds = hotelsByCity.map(hotel => hotel.hotelId).slice(0, 5);

      const hotelData = {
        cityCode : destination,
        hotelIds,
        adults,
        checkInDate: departureDate,
        checkOutDate,
        currency: currencyCode,
      };

      const hotelResponse = await getMultiHotelOffers(hotelData);
      setHotels(hotelResponse?.data || []);
    } catch (err) {
      console.error("Hotel search error:", err);
      setError("Failed to fetch hotels. Please try again later.");
      setHotels([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isHydrated) {
    return null;
  }
  
  return (
    <main>
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center">
            <Image
              src="/logo.png"
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
            <a href="/about" className="hover:underline">About</a>
            <Link href="/auth/login">
              <button className="bg-white text-blue-600 px-4 py-1 rounded">
                Login
              </button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="hero-section bg-blue-500 text-white text-center py-32">
        <h1 className="text-4xl font-bold">Discover New Destinations</h1>
        <p className="mt-4">Book your flight today and enjoy a unique travel experience!</p>
        <Link href="/auth/login">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md mt-4">
            Get Started
          </button>
        </Link>
      </div>

      <div className="container mx-auto px-4 my-8">
        <h2 className="text-center text-2xl font-bold mb-4">Search Flights</h2>
        <div className="bg-white shadow-lg rounded-lg p-6">
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
              <input
                id="departure-date"
                type="date"
                className="border p-2 w-full"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </div>
            {!isOneWay && (
              <div>
                <label htmlFor="return-date" className="block text-sm font-medium mb-1">
                  <i className="fas fa-calendar-alt mr-2"></i> Return Date
                </label>
                <input
                  id="return-date"
                  type="date"
                  className="border p-2 w-full"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
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
              value={travelClass}
              onChange={(e) => setTravelClass(e.target.value)}
              className="border p-2 w-full"
            >
              <option value="ECONOMY">Economy</option>
              <option value="BUSINESS">Business</option>
              <option value="FIRST">First</option>
            </select>
          </div>

    {/* Do you need a hotel? */}
    <div className="mb-6">
      <label className="block text-sm font-medium mb-1">Do you need a hotel?</label>
      <div className="flex gap-4">
        <button
          className={`px-4 py-2 rounded ${needHotel ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setNeedHotel(true)}
        >
          Yes
        </button>
        <button
          className={`px-4 py-2 rounded ${!needHotel ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setNeedHotel(false)}
        >
          No
        </button>
      </div>
    </div>

    {/* Check-out Date (Only when hotel is YES) */}
    {needHotel && (
      <div className="mb-6">
        <label htmlFor="check-out-date" className="block text-sm font-medium mb-1">
          Check-out Date
        </label>
        <input
          id="check-out-date"
          type="date"
          className="border p-2 w-full"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
        />
      </div>
    )}

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
          <button
            className="w-full bg-blue-600 text-white py-2 rounded"
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search Flights"}
          </button>

          {/* Error Handling */}
          {error && (
            <div className="mt-4 text-red-500 text-center">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}
        </div>
      </div>

          {/* Flight Results */}
  {flights.length > 0 ? (
    <div className="container mx-auto px-4 my-8">
      <h2 className="text-center text-2xl font-bold mb-4">Available Flights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flights.map((flight, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">
              {flight.itineraries[0].segments[0].departure.iataCode} →{" "}
              {flight.itineraries[flight.itineraries.length - 1].segments[
                flight.itineraries[flight.itineraries.length - 1].segments.length - 1
              ].arrival.iataCode}
            </h3>

            {/* Display itinerary details */}
            {flight.itineraries.map((itinerary, itinIndex) => {
              // Extract duration using Regex
              const durationMatch = itinerary.duration.match(/(\d+)H(\d+)?/);
              const hours = durationMatch ? durationMatch[1] : "0";
              const minutes = durationMatch && durationMatch[2] ? durationMatch[2] : "00";

              // Display travel path
              const travelPath = itinerary.segments
                .flatMap(({ departure, arrival }, segIndex, segments) => {
                  if (segIndex === segments.length - 1) {
                    return [departure.iataCode, arrival.iataCode];
                  }
                  return [departure.iataCode];
                })
                .join(" → ");

              return (
                <div key={itinIndex} className="flex flex-col mt-2">
                  <small className="text-gray-500">
                    {itinIndex === 0 ? "Outbound" : "Return"}
                  </small>
                  <span className="font-semibold">{travelPath}</span>
                  <div className="text-sm text-gray-700">
                    Duration: {hours}h {minutes}m
                  </div>
                </div>
              );
            })}

            {/* Display price */}
            <span className="bg-blue-500 text-white rounded-full px-4 py-1 text-sm font-semibold mt-3 inline-block">
              {flight.price.total} {flight.price.currency}
            </span>

            {/* Book details button */}
            <button className="bg-blue-600 text-white px-4 py-2 mt-4 rounded w-full">
            <Link href={`/flight-orders/${flight.id}`}>Book Now</Link>
            </button>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <p className="text-center text-gray-600 text-lg mt-6">No results found.</p>
  )}

{/* Hotel Search Results */}
{hotels?.length > 0 && (
  <div className="container mx-auto px-4 my-8">
    <h2 className="text-center text-3xl font-bold mb-8 text-gray-800">🏨 Recommended Hotels</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {hotels.map((hotel, index) => {
        // Skip hotels with invalid offers or data
        if (!hotel.offers || hotel.offers.length === 0) {
          return null; // Skip this hotel if no valid offers are found
        }

        // Extracting necessary hotel data
        const hotelOffer = hotel.offers[0];
        const hotelImage = hotel?.hotel?.media?.[0]?.url || "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg"; // Placeholder if no image
        const cityName = cityMapping[hotel.cityCode] || hotel.cityCode; // Get the city name from the map or fallback to cityCode

        return (
          <div key={index} className="bg-white shadow-xl rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
            <img src={hotelImage} alt={hotel.name} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-2xl font-semibold mb-2 text-blue-600">{hotel.name}</h3>
        
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <i className="fa-solid fa-map-pin mr-2"></i>
                <span>{cityName}</span>
              </div>
        
              {hotelOffer ? (
                <>
                  <div className="my-4">
                    <div className="flex items-center text-gray-600 mb-2">
                      <i className="fa-solid fa-sterling-sign mr-2"></i> 
                      <span className="block text-md font-medium">Price: <span className="font-semibold">{hotelOffer.price?.total} {hotelOffer.price?.currency || "GBP"}</span></span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <i className="fa-solid fa-bed mr-2"></i> 
                      <span className="block text-md font-medium">Room: {hotelOffer.room?.description?.text || "No description available"}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <i className="fa-solid fa-calendar-day mr-2"></i>
                      <span className="block text-md font-medium">Check-In: {hotelOffer.checkInDate}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <i className="fa-solid fa-calendar-days mr-2"></i> 
                      <span className="block text-md font-medium">Check-Out: {hotelOffer.checkOutDate}</span>
                    </div>

                    {hotelOffer.price?.variations?.changes?.map((priceChange, priceIndex) => (
                      <div key={priceIndex} className="flex items-center text-gray-600 text-sm mb-2">
                        <i className="fa-solid fa-tag mr-2"></i> 
                        <span className="block text-sm font-medium">Price Change: {priceChange.total} {hotelOffer.price?.currency} (from {priceChange.startDate} to {priceChange.endDate})</span>
                      </div>
                    ))}
                  </div>

                  <a href={hotelOffer.self} target="_blank" rel="noopener noreferrer">
                    <button className="bg-blue-600 text-white px-4 py-2 mt-4 rounded-lg w-full hover:bg-blue-700 transition-colors">
                      View Details
                    </button>
                  </a>
                </>
              ) : (
                <p className="text-red-500 mt-2">🚫 No available offers</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}




{/* Hotel room Results */}

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