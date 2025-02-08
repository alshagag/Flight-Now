// pages/api/flights/index.tsx

import { NextResponse } from 'next/server';
import Amadeus from 'amadeus';

// Initialize Amadeus library with keys
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY || '',
  clientSecret: process.env.AMADEUS_API_SECRET || '',
});

// Flight search API
export async function POST(req: Request) {
  const body = await req.json();

  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: body.origin, // Original city code
      destinationLocationCode: body.destination, // API code FOR destination city 
      departureDate: body.departureDate, // Departure Date
      adults: body.adults, // Number of passengers
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching flight data:', error);
    return NextResponse.json({ error: 'Failed to fetch flight data' }, { status: 500 });
  }
}
