import { useState, useEffect } from "react"
import axios from "axios"

export default function useAuth(code: string) {
  const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}` 
    : "http://localhost:3000";
  const [accessToken, setAccessToken] = useState()
  const [refreshToken, setRefreshToken] = useState()
  const [expiresIn, setExpiresIn] = useState()

  useEffect(() => {
    axios
      .post(`${BASE_URL}/auth/login`, {
        code,
      })
      .then(res => {
        setAccessToken(res.data.accessToken)
        setRefreshToken(res.data.refreshToken)
        setExpiresIn(res.data.expiresIn)
        localStorage.setItem("access_token", res.data.accessToken);
        localStorage.setItem("expires_in", res.data.expiresIn);
        window.history.pushState({}, "", "/spin") // bad, can click back button?
      })
      .catch(() => {
        window.location.href = "/"
      })
  }, [code])

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      axios
        .post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        })
        .then(res => {
          setAccessToken(res.data.accessToken)
          setExpiresIn(res.data.expiresIn)
          localStorage.setItem("access_token", res.data.accessToken);
          localStorage.setItem("expires_in", res.data.expiresIn);
        })
        .catch(() => {
          window.location.href = "/"
        })
    }, (expiresIn - 60) * 1000)

    return () => clearInterval(interval)
  }, [refreshToken, expiresIn])

  return accessToken;
}