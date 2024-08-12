"use client"

import { useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";
import useAuth from "@/hooks/useAuth"
import SpotifyWebApi from "spotify-web-api-node";
import ArrowRight from "@/assets/ArrowRight.svg";
import PlayPause from "@/assets/PlayPause.svg";
import { useInterval } from "usehooks-ts";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import exp from "constants";

interface Artist {
  name?: string,
  id?: string,
}
interface TrackInfo {
  name?: string,
  artists?: Artist[],
  album?: {
    images: { url: string }[],
  },
  external_urls?: { spotify?: string },
}

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
  const [trackInfo, setTrackInfo] = useState<TrackInfo | null>(null);
  const [playerState, setPlayerState] = useState("");
  const [coverArtImage, setCoverArtImage] = useState("");
  const [description, setDescription] = useState("");
  const [artistImage, setArtistImage] = useState("");
  const [notPlaying, setNotPlaying] = useState(false);
  const CHECK_NEW_SONG_INTERVAL = 10000;

  const router = useRouter();
  let accessToken;
  let expiresIn;
  if (typeof window !== "undefined") {
    accessToken = localStorage.getItem("access_token");
    expiresIn = parseInt(localStorage.getItem("expires_in") || "");
    router.replace("/spin");
  }
  if (!accessToken || !expiresIn || expiresIn < 60) {
    const code = searchParams.code;
    accessToken = useAuth(code as string) || null;
  }

  const getTrackAndArtist = (async () => {
    if (!accessToken) return;
    try {
      const trackData = await spotifyApi.getMyCurrentPlayingTrack();
      if (trackData.body?.item) {
        const item = trackData.body.item as TrackInfo;
        const artist = await spotifyApi.getArtist(item.artists?.[0]?.id || "");
        setTrackInfo(item);
        setCoverArtImage(item.album?.images[0]?.url || "");
        setPlayerState(trackData.body.is_playing ? 'play' : 'pause');
        setArtistImage(artist.body?.images[0]?.url || "");
      }
      else {
        throw new Error("Track not found.");
      }

    } catch(error) {
      if (error?.toString() === "Error: Track not found.") {
        setNotPlaying(true);
      }
      console.log(error);
    }
  });

  useEffect(() => {
    if (!accessToken) return;
    try {
      spotifyApi.setAccessToken(accessToken);
    } catch (error) {
      console.log(error);
    }
  }, [accessToken])

  useEffect(() => {
    if (!accessToken) return;
    getTrackAndArtist();
  }, [accessToken]);

  useEffect(() => {
    const getDescription = async () => {
      try {
        if (!trackInfo) return;
        const {data, error}: any = await axios.get(`http://localhost:3000/gemini?artist=${trackInfo.artists?.[0]?.name}`);
        if (error) throw new Error(error);
        if (data.text) {
          setDescription(data.text);
        }
      } catch (err) {
        console.log(err);
      }
    }
    getDescription();
  }, [artistImage]); // only call gemini if the artist changes

  useInterval(() => {
    getTrackAndArtist();
  }, CHECK_NEW_SONG_INTERVAL);

  const handlePlayPause = (playerState: string) => {
    try {
      if (playerState === 'play') {
        spotifyApi.pause();
        setPlayerState('pause');
      }
      else if (playerState === 'pause') {
        spotifyApi.play();
        setPlayerState('play');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSkipAhead = () => {
    try {
      spotifyApi.skipToNext();
    } catch (error) {
      console.log(error);
    }
  }

  const handleSkipBack = () => {
    try {
      spotifyApi.skipToPrevious();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="h-screen w-screen bg-[#08182B]">
      {trackInfo ? (
        <div className="h-[70svh] flex flex-row justify-center items-start py-12">
          <div className="flex-1 max-w-[25%] px-4">
            <h1 className="bg-gradient-to-r from-[#006299] to-[#5856D6] text-[2.5rem] text-transparent bg-clip-text inline-block font-semibold">now spinning</h1>
            <div className="pt-8">
              <p className="text-white text-4xl">{trackInfo.name}</p>
              <p className="text-white text-xl">{trackInfo.artists?.[0]?.name}</p>
            </div>
            <Image src={artistImage} alt="artist image" width={320} height={320} className="my-8 rounded overflow-hidden"></Image>
          </div>
          <div className="flex flex-col items-center mx-8">
            <a href={trackInfo?.external_urls?.spotify}>
              <img src={coverArtImage} className="w-[80svh] h-[80svh] mb-8 mt-5 hover:opacity-90 transition cursor-pointer rounded overflow-hidden"></img>
            </a>
            <div className="flex flex-row gap-8">
              <button onClick={handleSkipBack}>
                <img src={ArrowRight.src} className="hover:opacity-100 opacity-75 transition"></img>
              </button>
              <button onClick={() => handlePlayPause(playerState)}>
                <img src={PlayPause.src} className="hover:opacity-100 opacity-75 transition"></img>
              </button>
              <button onClick={handleSkipAhead}>
                <img src={ArrowRight.src} className="hover:opacity-100 opacity-75 transition rotate-180"></img>
              </button>
            </div>
          </div>
          <div className="flex-1 max-w-[25%] px-4">
            <h1 className="bg-gradient-to-r from-[#006299] to-[#5856D6] text-[2.5rem] text-transparent bg-clip-text inline-block font-semibold">{`about ${trackInfo.artists?.[0]?.name}`}</h1>
            <p className="text-white text-lg py-4">{description}</p>
          </div>
        </div>
      ) : (
        <div className="h-screen flex flex-col justify-center items-center">
          <Audio 
            height="80"
            width="80"
            color="#5856D6"
            ariaLabel="three-dots-loading"
          />
          {notPlaying && (
            <p className="text-white py-4">We haven't detected a song playing on your spotify. Please choose a song and click play!</p>
          )}
        </div>
      )}
    </div>
  );
}