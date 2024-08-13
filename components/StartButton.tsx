"use client"
import Link from "next/link";

const redirect_uri = process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "http://localhost:3000"
const AUTH_URL =
  `https://accounts.spotify.com/authorize?client_id=${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${redirect_uri}/spin&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`

export default function Button() {
  return (
    <Link href={AUTH_URL} className="bg-[#5856D6]/80 text-white px-8 py-2 rounded hover:bg-[#5856D6] transition-colors">start</Link>
  );
}