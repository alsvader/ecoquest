import { notFound } from "next/navigation";
import { MISSION_IDS, isMissionId } from "@/data/expedition";
import { MissionClient } from "./mission-client";

export function generateStaticParams() {
  return MISSION_IDS.map((id) => ({ id }));
}

export default async function MissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isMissionId(id)) notFound();
  return <MissionClient missionId={id} />;
}
