import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    store: 'Organic Khabar Bangladesh',
    service: 'Next.js App Router Server-Side Handler',
    time: new Date().toISOString(),
    supportedCurrencies: ['BDT'],
    supportedPaymentMethods: ['bKash', 'Nagad', 'Rocket', 'CashOnDelivery'],
  });
}
