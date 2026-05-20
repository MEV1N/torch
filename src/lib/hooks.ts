"use client";

import { useEffect, useState } from "react";

/**
 * Hook that returns true after the component has mounted on the client.
 * Use this to prevent Framer Motion SSR hydration mismatches.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
