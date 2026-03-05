import { Stack } from "expo-router";

import "../global.css"
import HoloAuthProvider from "@/contexts/holoauthcontext";

export default function RootLayout() {
  return (
  <HoloAuthProvider>
    <Stack />
  </HoloAuthProvider>
);
}
