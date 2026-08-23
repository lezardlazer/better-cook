import { auth } from "@/auth";
import { ImportFlow } from "@/components/ImportFlow";
import { SignInGate } from "@/components/SignInGate";

export default async function NewRecipePage() {
  const session = await auth();
  if (!session?.user?.id) return <SignInGate />;

  return <ImportFlow />;
}
