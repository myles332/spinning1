"use client"

import { useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";
import SpotifyWebApi from "spotify-web-api-node";
import ArrowRight from "@/assets/ArrowRight.svg";
import PlayPause from "@/assets/PlayPause.svg";
import { useInterval } from "usehooks-ts";
import axios from "axios";
import Image from "next/image";


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

export default function Spin({accessToken}: {accessToken: string}) {
  const [trackInfo, setTrackInfo] = useState<TrackInfo | null>(null);
  const [playerState, setPlayerState] = useState("");
  const [coverArtImage, setCoverArtImage] = useState("");
  const [description, setDescription] = useState("");
  const [artistImage, setArtistImage] = useState("");
  const [notPlaying, setNotPlaying] = useState(false);
  const [userWhiteListed, setUserWhitelisted] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const CHECK_NEW_SONG_INTERVAL = 10000;
  const SHOW_MESSAGE_INTERVAL = 2000;

  if (typeof window !== "undefined") {
    window.history.replaceState({}, "", "/");
  }
  const getTrackAndArtist = (async () => {
    if (!accessToken) return;
    try {
      const trackData = await spotifyApi.getMyCurrentPlayingTrack();
      if (trackData.statusCode === 200 || trackData.statusCode === 204) {
        setUserWhitelisted(true);
      }
      if (trackData.statusCode === 204) {
        setNotPlaying(true);
      }
      if (trackData.body?.item) {
        const item = trackData.body.item as TrackInfo;
        const artist = await spotifyApi.getArtist(item.artists?.[0]?.id || "");
        setTrackInfo(item);
        setCoverArtImage(item.album?.images[0]?.url || "");
        setPlayerState(trackData.body.is_playing ? 'play' : 'pause');
        setArtistImage(artist.body?.images[0]?.url || "");
      }
    } catch(error) {
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
        const geminiSlug = `/gemini?artist=${trackInfo.artists?.[0]?.name}`;
        const {data, error}: any = await axios.get((
          process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL 
            ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}` 
            : "http://localhost:3000") + geminiSlug);
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

  useInterval(() => {
    if (!trackInfo) {
      setShowMessage(true);
    }
  }, SHOW_MESSAGE_INTERVAL);

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
    <div className="min-h-screen w-full bg-[#08182B] px-4 py-8 md:px-8 md:py-12">
      {trackInfo ? (
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8">
        <div className="w-full md:flex-1 md:max-w-[25%]">
          <h1 className="bg-gradient-to-r from-[#006299] to-[#5856D6] text-2xl md:text-[2.5rem] text-transparent bg-clip-text inline-block font-semibold leading-relaxed pb-2">now spinning</h1>
          <div className="pt-4 md:pt-8">
            <p className="text-white text-2xl md:text-4xl">{trackInfo.name}</p>
            <p className="text-white text-lg md:text-xl">{trackInfo.artists?.[0]?.name}</p>
          </div>
          <Image src={artistImage} alt="artist image" width={320} height={320} className="w-full max-w-[320px] my-4 md:my-8 rounded overflow-hidden"></Image>
        </div>
        <div className="w-full md:flex-1 flex flex-col items-center">
          <a href={trackInfo?.external_urls?.spotify} className="w-full max-w-[80vw] md:max-w-[80vh]">
            <Image 
              src={coverArtImage} 
              alt="Album cover" 
              width={800} 
              height={800} 
              className="w-full h-auto mb-4 md:mb-8 mt-2 md:mt-5 hover:opacity-90 transition cursor-pointer rounded overflow-hidden"
            />
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
        <div className="w-full md:flex-1 md:max-w-[25%]">
          <h1 className="bg-gradient-to-r from-[#006299] to-[#5856D6] text-2xl md:text-[2.5rem] text-transparent bg-clip-text inline-block font-semibold leading-relaxed pb-2">{`about ${trackInfo.artists?.[0]?.name}`}</h1>
          <p className="text-white text-base md:text-lg py-4">{description}</p>
        </div>
      </div>
      ) : (
        <div className="min-h-screen w-full bg-[#08182B] flex flex-col justify-center items-center px-4 py-8">
          <Audio 
            height="80"
            width="80"
            color="#5856D6"
            ariaLabel="three-dots-loading"
          />
          {notPlaying && (
            <p className="text-white text-center py-4">We haven't detected a song playing on your spotify. Please choose a song and click play!</p>
          )}
          {(!userWhiteListed && showMessage) && (
            <p className="text-white text-center py-4">
              This app is still in development mode, meaning only Spotify accounts on the approved users list can access it.
              If you would like to be added, please email myles.anderson@princeton.edu.
            </p>
          )}
        </div>
      )}
    </div>
  );
}