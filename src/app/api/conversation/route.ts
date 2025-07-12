import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_KEY = process.env.ELEVENLABS_API_KEY!;

export async function POST(req: NextRequest) {
  const { message, session_id } = await req.json();

  try {
    const response = await axios.post(
      'https://elevenlabs.io/app/talk-to?agent_id=agent_01jzqknh0ke8gb10w3pcwjb6fz',
      { message, session_id },
      {
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
