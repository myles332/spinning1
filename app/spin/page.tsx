"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import useAuth from "@/hooks/useAuth"
import SpotifyWebApi from "spotify-web-api-node";
import ArrowRight from "@/assets/ArrowRight.svg";
import PlayPause from "@/assets/PlayPause.svg";

const spotifyApi = new SpotifyWebApi({
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

  const [trackName, setTrackName] = useState("");
  const [coverArtImage, setCoverArtImage] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken])

  useEffect(() => {
    if (!accessToken) return;
    const getTrackAndArtist = (async () => {
      try {
        const trackData = await spotifyApi.getMyCurrentPlayingTrack();
        if (trackData.body.item) {
          console.log(trackData);
          const item = trackData.body.item as any;
          setTrackName(item.name);
          setCoverArtImage(item.album.images[0].url);
          const artistData = await spotifyApi.getArtist(item.artists[0].id);
          console.log(artistData);
        }
        else {
          throw new Error("Track not found.");
        }

      } catch(error) {
        console.log(error);
      }
    });
    getTrackAndArtist();
  }, [accessToken]);

  const handlePlayPause = () => {
    console.log("playpause");
  }

  return (
    <div className="h-screen w-screen bg-[#08182B]">
      <div className="">
        <h1 className="bg-gradient-to-r from-[#006299] to-[#5856D6] text-[2.5rem] text-transparent bg-clip-text inline-block font-semibold">now spinning</h1>
        <div className="flex flex-col items-center justify-center">
          <img src={coverArtImage} className="w-[80svh] h-[80svh] p-8"></img>
          <div className="flex flex-row gap-8">
            <button onClick={handlePlayPause}>
              <img src={ArrowRight.src} className="hover:opacity-100 opacity-75 transition"></img>
            </button>
            <button onClick={handlePlayPause}>
              <img src={PlayPause.src} className="hover:opacity-100 opacity-75 transition"></img>
            </button>
            <button onClick={handlePlayPause}>
              <img src={ArrowRight.src} className="hover:opacity-100 opacity-75 transition rotate-180"></img>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}