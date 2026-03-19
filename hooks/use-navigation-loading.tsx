"use client";

import { useRouter } from "next/navigation";
import { useLoading } from "@/components/loading-provider";

export function useNavigationLoading() {
  const router = useRouter();
  const { setLoading } = useLoading();

  const push = (url: string) => {
    setLoading(true);
    router.push(url);
    // Hide loader after a reasonable time
    setTimeout(() => setLoading(false), 1000);
  };

  const replace = (url: string) => {
    setLoading(true);
    router.replace(url);
    setTimeout(() => setLoading(false), 1000);
  };

  const back = () => {
    setLoading(true);
    router.back();
    setTimeout(() => setLoading(false), 1000);
  };

  const forward = () => {
    setLoading(true);
    router.forward();
    setTimeout(() => setLoading(false), 1000);
  };

  return {
    push,
    replace,
    back,
    forward,
  };
}
