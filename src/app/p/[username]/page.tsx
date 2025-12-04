"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

// Dynamically import the PublicProfile component
const PublicProfile = dynamic(() => import("../lib/PublicProfile"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function PublicProfilePage() {
  const params = useParams();

  return <PublicProfile username={params.username as string} />;
}
