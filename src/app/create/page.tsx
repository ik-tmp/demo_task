import { CreateFunnel } from "@/components/create/create-funnel";
import { companions } from "@/lib/companions";

export default function CreatePage() {
  return <CreateFunnel companions={companions} />;
}
