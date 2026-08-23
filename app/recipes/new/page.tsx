import { auth } from "@/auth";
import { NewRecipeFlow } from "@/components/NewRecipeFlow";
import { SignInGate } from "@/components/SignInGate";

export default async function NewRecipePage() {
  const session = await auth();
  if (!session?.user?.id) return <SignInGate />;

  return <NewRecipeFlow />;
}
