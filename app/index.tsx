import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { getToken } from "../utils/api";
import '../global.css'

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      setIsLoggedIn(!!token);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return null;

  return isLoggedIn ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/login" />
  );
}
