import { SignInButton } from "./SignInButton";

export function SignInGate() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-lg font-semibold">
        Connecte-toi pour accéder à tes recettes.
      </p>
      <SignInButton />
    </div>
  );
}
