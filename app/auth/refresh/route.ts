import { NextResponse } from "next/server";
const SpotifyWebApi = require("spotify-web-api-node");


export async function POST(request: Request) {
  const req = await request.json();
  const refreshToken = req.refreshToken
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  })

  spotifyApi
    .refreshAccessToken()
    .then((data: any) => {
      return NextResponse.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      })
    })
    .catch((err: any) => {
      console.log(err)
      return NextResponse.json({ status: 400 })
    })
}