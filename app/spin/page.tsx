"use client"

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth"
import SpotifyWebApi from "spotify-web-api-node";
import { access } from "fs";

const SpotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
})

/** Protected page. The main app lives here */
export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const code = searchParams.code;
  const accessToken = useAuth(code as string);
  console.log("TOKEN");
  console.log(accessToken);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    SpotifyApi.setAccessToken(accessToken);
  }, [accessToken])

  useEffect(() => {
    SpotifyApi.searchTracks("Hello Lionel Richie")
      .then((res) => {console.log(res)});
  })
  return <h1>Hi!</h1>
}