import Error from "next/error";
import { NextResponse } from "next/server";
const SpotifyWebApi = require("spotify-web-api-node");

export async function POST(Request: Request) {
  const req = await Request.json();
  const code = req.code;
  const spotify = new SpotifyWebApi({
    redirectUri: "http://localhost:3000/spin", 
    clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
  })

  console.log("HELLOOO?")
  spotify.authorizationCodeGrant(code).then((data: any) => {
    console.log("DATA");
    return NextResponse.json({
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in,
    })
  })
  .catch((error: Error) => {
    console.log(error);
    return NextResponse.json({ status: 400 });
  })
  return NextResponse.json({ status: 500 });
}