import { notFound } from "next/navigation";
import { getCompanion } from "@/lib/companions";
import { VignetteFunnel } from "@/components/browse/vignette-funnel";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CompanionPage({ params }: Props) {
  const { id } = await params;
  const companion = getCompanion(id);
  if (!companion) notFound();
  return <VignetteFunnel companion={companion} />;
}
