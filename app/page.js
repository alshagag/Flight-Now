"use client"; // Enable event handling in React
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { searchFlights } from "@/app/pages/utils/getFlightOffers";
import { searchHotels  } from "@/app/pages/utils/getHotelsList";
import "./styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Home() {
  const [isFlightSearch, setIsFlightSearch] = useState(true); // Flight or Hotel toggle
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
  const [currency, setCurrency] = useState("USD");
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [needHotel, setNeedHotel] = useState(false);  
  const [cityCode, setCityCode] = useState("");
  const [radius, setRadius] = useState("10"); // Default radius in km
  const [radiusUnit, setRadiusUnit] = useState("km");
  const [amenities, setAmenities] = useState("SWIMMING_POOL"); // Default to one selected option
  const [ratings, setRatings] = useState("5"); // Default to 5 stars
  const [hotelSource, setHotelSource] = useState("ALL");
  const [chainCodes, setChainCodes] = useState("");
  const [hotelResults, setHotelResults] = useState([]); // Define hotelResults state
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [roomQuantity, setRoomQuantity] = useState(1); // Default to 1 room
  const [numAdults, setNumAdults] = useState(1); 

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
  
      // Fetch flight offers
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
  
    } catch (err) {
      console.error("Flight search error:", err);
      setError("Failed to fetch flights. Please try again later.");
      setFlights([]);
    } finally {
      setIsLoading(false);
    }
  };

      // Fetch hotel data if needed
  useEffect(() => {
    if (needHotel) {
      handleHotelSearch();
    }
  }, [needHotel]);
  
  const handleHotelSearch = async () => {
    try {
      setIsLoading(true);
  
      if (!cityCode) {
        setError("Please select a destination to search for hotels.");
        return;
      }
  
      let hotelsByCity = []; // Ensure hotelsByCity is initialized
      
      const hotelsByCityRes = await searchHotels (cityCode);
      hotelsByCity = hotelsByCityRes?.data || [];
  
      if (hotelsByCity.length === 0) {
        setError("No hotels found in this city code.");
        return;
      }
  
      console.log('Hotels by city:', hotelsByCity);
  
      // Extract hotel IDs from the response to limit the search
      const hotelIds = hotelsByCity.map(hotel => hotel.hotelId).slice(0, 5);
  
      const hotelData = {
        cityCode: 
        radius,
        radiusUnit,
        amenities,
        ratings,
        hotelSource,
        chainCodes,
        hotelIds,
      };
  
      // Call the API to fetch detailed hotel offers
      const hotelResponse = await searchHotels (hotelData);
  
      console.log('Hotel Response:', hotelResponse);
  
      if (hotelResponse?.data) {
        setHotels(hotelResponse.data);
      } else {
        setError("No hotels found for the selected criteria.");
        setHotels([]);
      }
    } catch (err) {
      console.error("Hotel search error:", err);
      setError("Failed to fetch hotels. Please try again later.");
      setHotels([]);
    } finally {
      setIsLoading(false);
    }
  };

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
      <h2 className="text-center text-2xl font-bold mb-4">
        {isFlightSearch ? 'Search Flights' : 'Search Hotels'}
      </h2>
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Toggle buttons for Flight/Hotel */}
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 rounded-l ${isFlightSearch ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setIsFlightSearch(true)}
          >
            Flights
          </button>
          <button
            className={`px-4 py-2 rounded-r ${!isFlightSearch ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setIsFlightSearch(false)}
          >
            Hotels
          </button>
        </div>

        {isFlightSearch ? (
          // Flight Search Fields
          <>
            {/* Flight Search Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="departure-city" className="block text-sm font-medium mb-1">
                  <i className="fas fa-plane-departure mr-2"></i> Departure City (Required)
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
                    required
                  />
                  <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="arrival-city" className="block text-sm font-medium mb-1">
                  <i className="fas fa-plane-arrival mr-2"></i> Arrival City (Required)
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
                  className={`px-4 py-2 rounded ${isOneWay ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => setIsOneWay(true)}
                >
                  One-way
                </button>
                <button
                  className={`px-4 py-2 rounded ${!isOneWay ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
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
                    required
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
                  <i className="fas fa-baby-carriage mr-2"></i> Infants (Under 2)
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

            <div className="flex justify-center">
            {/* Search Flights Button */}
            <button
                className="w-full bg-blue-600 text-white py-2 rounded"
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? "Searching..." : "Search Flights"}
              </button>
            </div>
          </>
        ) : (

         // Hotel Search Form // *
          <>
        <div className="container mt-5">
        <form>
        {/* Basic Required Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        {/* City Code */}
        <div>
          <label htmlFor="city-code" className="block text-sm font-medium mb-1">
            <i className="fas fa-city mr-2"></i> City Code (Required)
          </label>
          <div className="flex">
            <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l">
              <i className="fas fa-map-marker-alt"></i>
            </button>
            <input
              id="city-code"
              type="text"
              value={cityCode}
              onChange={(e) => setCityCode(e.target.value)}
              placeholder="Enter city code"
              required
              className="border p-2 flex-1 rounded-r"
            />
          </div>
        </div>

        {/* Check-in Date */}
        <div>
          <label htmlFor="check-in-date" className="block text-sm font-medium mb-1">
            <i className="fas fa-calendar-day mr-2"></i> Check-In Date
          </label>
          <div className="flex">
            <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l">
              <i className="fas fa-calendar-alt"></i>
            </button>
            <input
              id="check-in-date"
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="border p-2 flex-1 rounded-r"
            />
          </div>
        </div>

        {/* Check-out Date */}
        <div>
          <label htmlFor="check-out-date" className="block text-sm font-medium mb-1">
            <i className="fas fa-calendar-day mr-2"></i> Check-Out Date
          </label>
          <div className="flex">
            <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l">
              <i className="fas fa-calendar-alt"></i>
            </button>
            <input
              id="check-out-date"
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="border p-2 flex-1 rounded-r"
            />
          </div>
        </div>

        {/* Number of Adults */}
        <div>
          <label htmlFor="num-adults" className="block text-sm font-medium mb-1">
            <i className="fas fa-user mr-2"></i> Number of Adults (12+ years)
          </label>
          <div className="flex">
            <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l">
              <i className="fas fa-users"></i>
            </button>
            <input
              id="num-adults"
              type="number"
              value={numAdults}
              onChange={(e) => setNumAdults(e.target.value)}
              min="1"
              className="border p-2 flex-1 rounded-r"
            />
          </div>
        </div>
      </div>


    {/* Number of Rooms */}
    <div className="mb-6">
      <label htmlFor="room-quantity" className="block text-sm font-medium mb-1">
        <i className="fas fa-door-open mr-2"></i> Number of Rooms
      </label>
      <input
        id="room-quantity"
        type="number"
        min="1"
        className="border p-2 w-full"
        value={roomQuantity}
        onChange={(e) => setRoomQuantity(e.target.value)}
      />
    </div>

    {/* Ratings */}
    <div className="mb-6">
      <label htmlFor="ratings" className="block text-sm font-medium mb-1">
        <i className="fas fa-star mr-2"></i> Hotel Rating
      </label>
      <select
        id="ratings"
        value={ratings}
        onChange={(e) => setRatings(e.target.value)}
        className="border p-2 w-full"
      >
        <option value="">Select Rating</option>
        <option value="1">⭐ 1 Star</option>
        <option value="2">⭐⭐ 2 Stars</option>
        <option value="3">⭐⭐⭐ 3 Stars</option>
        <option value="4">⭐⭐⭐⭐ 4 Stars</option>
        <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
      </select>
    </div>

    {/* Amenities */}
    <div className="mb-6">
      <label htmlFor="amenities" className="block text-sm font-medium mb-1">
        <i className="fas fa-cogs mr-2"></i> Amenities
      </label>
      <select
        id="amenities"
        className="border p-2 w-full"
        value={amenities}
        onChange={(e) => setAmenities([...e.target.selectedOptions].map(option => option.value))}
      >
        <option value="SWIMMING_POOL">Swimming Pool</option>
        <option value="SPA">Spa</option>
        <option value="FITNESS_CENTER">Fitness Center</option>
        <option value="AIR_CONDITIONING">Air Conditioning</option>
        <option value="RESTAURANT">Restaurant</option>
        <option value="PARKING">Parking</option>
        <option value="PETS_ALLOWED">Pets Allowed</option>
        <option value="AIRPORT_SHUTTLE">Airport Shuttle</option>
        <option value="BUSINESS_CENTER">Business Center</option>
        <option value="DISABLED_FACILITIES">Disabled Facilities</option>
        <option value="WIFI">Wi-Fi</option>
        <option value="MEETING_ROOMS">Meeting Rooms</option>
        <option value="NO_KID_ALLOWED">No Kid Allowed</option>
        <option value="TENNIS">Tennis</option>
        <option value="GOLF">Golf</option>
        <option value="KITCHEN">Kitchen</option>
        <option value="ANIMAL_WATCHING">Animal Watching</option>
        <option value="BABY_SITTING">Baby Sitting</option>
        <option value="BEACH">Beach</option>
        <option value="CASINO">Casino</option>
        <option value="JACUZZI">Jacuzzi</option>
        <option value="SAUNA">Sauna</option>
        <option value="SOLARIUM">Solarium</option>
        <option value="MASSAGE">Massage</option>
        <option value="VALET_PARKING">Valet Parking</option>
        <option value="BAR_OR_LOUNGE">Bar or Lounge</option>
        <option value="KIDS_WELCOME">Kids Welcome</option>
        <option value="NO_PORN_FILMS">No Porn Films</option>
        <option value="MINIBAR">Minibar</option>
        <option value="TELEVISION">Television</option>
        <option value="WI_FI_IN_ROOM">Wi-Fi in Room</option>
        <option value="ROOM_SERVICE">Room Service</option>
        <option value="GUARDED_PARKING">Guarded Parking</option>
        <option value="SERV_SPEC_MENU">Special Menu</option>
      </select>
    </div>
          
      {/* Submit Hoteles Button */}
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded"
                onClick={handleHotelSearch}
                disabled={isLoading}
              >
                {isLoading ? "Searching..." : "Search Hotels"}
            </button>
          </div>
        </form>
      </div>
          </>
        )}

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
{hotelResults?.length > 0 ? (
  <div className="mt-8">
    <h3 className="text-xl font-bold mb-4">Available Hotels</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hotelResults.map((hotel) => (
        <div key={hotel?.hotelId || hotel?.id} className="bg-white shadow-lg rounded-lg p-4">
          <h4 className="font-semibold text-lg">{hotel?.name ?? "Unknown Hotel"}</h4>

          {/* Display hotel address */}
          <p className="text-sm text-gray-500">
            Address: {hotel?.address?.countryCode ?? "N/A"} |
            Distance: {hotel?.distance?.value ?? "N/A"} {hotel?.distance?.unit ?? "N/A"}
          </p>

          {/* Display hotel rating */}
          <div className="mt-2">
            <span className="inline-block text-sm text-gray-600">Rating: </span>
            <span className="inline-block text-sm font-semibold">{hotel?.rating ?? "N/A"}</span>
          </div>

          {/* Display hotel amenities */}
          <div className="mt-2">
            <span className="inline-block text-sm text-gray-600">Amenities: </span>
            <span className="inline-block text-sm font-semibold">
              {hotel?.amenities?.length > 0 ? hotel?.amenities.join(", ") : "No amenities listed"}
            </span>
          </div>

          {/* Show last update date */}
          <div className="mt-2">
            <span className="inline-block text-sm text-gray-600">Last Updated: </span>
            <span className="inline-block text-sm font-semibold">{hotel?.lastUpdate ?? "N/A"}</span>
          </div>

          {/* Book Now Button */}
          <div className="mt-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md w-full"
              onClick={() => alert(`Booking ${hotel?.name ?? "Unknown Hotel"}`)}
            >
              Book Now
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
) : (
  <div className="mt-8 text-center">
    <h3 className="text-xl font-bold">No hotels found for your search.</h3>
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
