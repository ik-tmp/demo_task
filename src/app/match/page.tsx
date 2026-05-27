import { MatchFunnel } from "@/components/match/match-funnel";
import { companions } from "@/lib/companions";

export default function MatchPage() {
  return <MatchFunnel companions={companions} />;
}
