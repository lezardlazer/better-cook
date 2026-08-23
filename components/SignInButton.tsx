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
      <button
        type="submit"
        className={`whitespace-nowrap bg-[#FFD53D] px-3 py-2 text-sm sm:px-4 ${BRUTAL_PILL}`}
      >
        <span className="hidden sm:inline">Se connecter avec Google</span>
        <span className="sm:hidden">Connexion</span>
      </button>
    </form>
  );
}
