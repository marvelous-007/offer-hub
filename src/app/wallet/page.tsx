"use client";

import dynamic from "next/dynamic";
import { PublicRoute } from "@/components/auth/public-route";

const WalletConnectPage = dynamic(
   () => import("../../components/onboarding/ConnectWalletPage"),
   { ssr: false }
);

export default function WalletPage() {
   return (
      <PublicRoute>
         <WalletConnectPage />
      </PublicRoute>
   );
}