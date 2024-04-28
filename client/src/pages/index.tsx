import Loading from "@/components/reusables/Loading";
import { useAuth } from "@/context/auth/AuthContextProvider";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (state.isLoggedIn) {
      router.push("/chat");
    } else {
      router.push("/auth/login");
    }
  }, []);

  return <>{state.loading ? <Loading /> : ""}</>;
}
