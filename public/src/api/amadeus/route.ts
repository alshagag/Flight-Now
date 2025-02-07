import { NextResponse } from 'next/server';
import Amadeus from 'amadeus';

// قم بتهيئة مكتبة Amadeus باستخدام المفاتيح
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY || '',
  clientSecret: process.env.AMADEUS_API_SECRET || '',
});

// واجهة البحث عن الرحلات
export async function POST(req: Request) {
  const body = await req.json();

  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: body.origin, // كود المدينة الأصلية
      destinationLocationCode: body.destination, // كود الوجهة
      departureDate: body.departureDate, // تاريخ المغادرة
      adults: body.adults, // عدد الركاب
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching flight data:', error);
    return NextResponse.json({ error: 'Failed to fetch flight data' }, { status: 500 });
  }
}
