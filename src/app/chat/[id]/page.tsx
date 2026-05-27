import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCompanion, companions } from "@/lib/companions";
import { FirstChat } from "@/components/chat/first-chat";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return companions.map((c) => ({ id: c.id }));
}

export default async function ChatPage({ params }: Props) {
  const { id } = await params;
  const companion = getCompanion(id);
  if (!companion) notFound();
  return (
    <Suspense
      fallback={
        <main className="grid h-[100dvh] w-full place-items-center bg-ink-deep text-copy-muted">
          <span className="text-sm">loading…</span>
        </main>
      }
    >
      <FirstChat companion={companion} />
    </Suspense>
  );
}
