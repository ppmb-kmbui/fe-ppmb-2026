import { SignupForm } from "@/components/auth";
import { Header } from "@/components/layout";

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Header />
      <main className="flex flex-1 justify-center px-[60px] py-10">
        <div className="w-full max-w-[1392px]">
          <SignupForm />
        </div>
      </main>
    </div>
  );
}
