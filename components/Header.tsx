import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { HeaderNav } from "./HeaderNav";
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
        <Link href="/" className="whitespace-nowrap text-xl font-bold tracking-tight sm:text-2xl">
          🍲 Better Cook
        </Link>
        <HeaderNav
          signedIn={!!userId}
          cartCount={cartCount}
          authSlot={userId ? <SignOutButton /> : <SignInButton />}
        />
      </div>
    </header>
  );
}
