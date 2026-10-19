import { NextRequest, NextResponse } from 'next/server';

// POST /api/sheets
// Forwards order data to Google Apps Script Web App → Google Sheets
export async function POST(req: NextRequest) {
  try {
    const SHEETS_WEBHOOK_URL =
      process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
      'https://script.google.com/macros/s/AKfycbyCB9GMx151wodvqD9qS2b-FEN6AgECTtvhXEVPsIyGxkut0c21yLd03t6YE0HI7mnmwQ/exec';

    const body = await req.json();

    const response = await fetch(SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('[Sheets] Apps Script error:', text);
      return NextResponse.json(
        { success: false, message: 'Failed to write to Google Sheets.', details: text },
        { status: 500 }
      );
    }

    const result = await response.json().catch(() => ({ status: 'ok' }));
    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    console.error('[Sheets] Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
