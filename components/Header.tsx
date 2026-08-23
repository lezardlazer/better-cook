import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { BRUTAL_PILL } from "@/lib/ui";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";

export async function Header() {
  const session = await auth();
  const userId = session?.user?.id;

  const cartCount = userId
    ? await prisma.recipe.count({ where: { inCart: true, userId } }).catch(() => 0)
    : 0;

  return (
    <header className="border-b-[3px] border-[#14110F] bg-[#FBF4E6]">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          🍲 Better Cook
        </Link>
        <nav className="flex items-center gap-2">
          {userId ? (
            <>
              <Link
                href="/panier"
                className={`flex items-center gap-1.5 bg-[#9FD8F5] px-4 py-2 text-sm ${BRUTAL_PILL}`}
              >
                🛒 Panier
                {cartCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#14110F] text-xs text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link
                href="/recipes/new"
                className={`bg-[#FFD53D] px-4 py-2 text-sm ${BRUTAL_PILL}`}
              >
                + Ajouter
              </Link>
              <SignOutButton />
            </>
          ) : (
            <SignInButton />
          )}
        </nav>
      </div>
    </header>
  );
}
