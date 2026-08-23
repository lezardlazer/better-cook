import { signOut } from "@/auth";
import { BRUTAL_PILL } from "@/lib/ui";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button type="submit" className={`bg-white px-3 py-2 text-sm ${BRUTAL_PILL}`}>
        Déconnexion
      </button>
    </form>
  );
}
