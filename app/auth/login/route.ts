import Error from "next/error";
import { NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

export async function POST(Request: Request) {
  const req = await Request.json();
  const code = req.code;
  const spotify = new SpotifyWebApi({
    redirectUri: process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL 
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}` 
      : "http://localhost:3000", 
    clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
  })

  try {
    const data = await spotify.authorizationCodeGrant(code);
    return NextResponse.json({
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in,
    });
  } catch (error) {
    return NextResponse.json({ status: 400 });
  }
}