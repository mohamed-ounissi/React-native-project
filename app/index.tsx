import { Redirect } from "expo-router";
import { useInitialAuthRoute } from "@/hooks/use-auth-session";

export default function Index() {
  const initialRoute = useInitialAuthRoute();

  if (!initialRoute) {
    return null;
  }

  return <Redirect href={initialRoute} />;
}
