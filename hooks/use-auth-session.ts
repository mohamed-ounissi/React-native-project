import { useEffect, useState } from "react";
import { router } from "expo-router";
import { isLocalSessionActive } from "@/app/(auth)/utils";

type AuthRoute = "/(auth)/login" | "/(tabs)";

export const getInitialAuthRoute = async (): Promise<AuthRoute> => {
  const isLoggedIn = await isLocalSessionActive();
  return isLoggedIn ? "/(tabs)" : "/(auth)/login";
};

export const useInitialAuthRoute = () => {
  const [initialRoute, setInitialRoute] = useState<AuthRoute | null>(null);

  useEffect(() => {
    const resolveInitialRoute = async () => {
      const route = await getInitialAuthRoute();
      setInitialRoute(route);
    };

    void resolveInitialRoute();
  }, []);

  return initialRoute;
};

export const useRedirectIfAuthenticated = () => {
  useEffect(() => {
    const checkSession = async () => {
      const isLoggedIn = await isLocalSessionActive();
      if (isLoggedIn) {
        router.replace("/(tabs)");
      }
    };

    void checkSession();
  }, []);
};

export const useRequireAuth = () => {
  useEffect(() => {
    const guardTabs = async () => {
      const isLoggedIn = await isLocalSessionActive();
      if (!isLoggedIn) {
        router.replace("/(auth)/login");
      }
    };

    void guardTabs();
  }, []);
};
