"use client"

import Landing from "@/components/Landing"
import Spin from "@/components/Spin"
import useAuth from "@/hooks/useAuth";

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  let accessToken: string | null = null;
  if (searchParams.code) {
    accessToken = useAuth(searchParams.code as string) || null;
  }
  return (
    accessToken ? <Spin accessToken={accessToken}/> : <Landing />
  );
}
