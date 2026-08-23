import { signIn } from "@/auth";
import { BRUTAL_PILL } from "@/lib/ui";

export function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <button type="submit" className={`bg-[#FFD53D] px-4 py-2 text-sm ${BRUTAL_PILL}`}>
        Se connecter avec Google
      </button>
    </form>
  );
}
