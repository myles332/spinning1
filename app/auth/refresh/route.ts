import { NextResponse } from "next/server";
const SpotifyWebApi = require("spotify-web-api-node");


export async function POST(request: Request) {
  const req = await request.json();
  const refreshToken = req.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL 
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/spin` 
      : "http://localhost:3000/spin",
    clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    refreshToken,
  });

  try {
    const data = await spotifyApi.refreshAccessToken();
    return NextResponse.json({
      accessToken: data.body.accessToken,
      expiresIn: data.body.expiresIn,
    });
  } catch(error) {
    console.log(error);
    return NextResponse.json({ status: 400 });
  }
}