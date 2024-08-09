"use client"

import useAuth from "@/hooks/useAuth"

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
  console.log(accessToken);
  return <h1></h1>
}