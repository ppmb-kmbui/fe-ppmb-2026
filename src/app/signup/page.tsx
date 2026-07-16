import {
  MobileAuthHeader,
  SignupFormContainer,
} from "@/components/auth";
import { Header } from "@/components/layout";

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background bg-[linear-gradient(to_bottom,#210736,#4d1e74)] lg:bg-none">
      <div className="hidden lg:block">
        <Header />
      </div>
      <MobileAuthHeader className="lg:hidden" />
      <main className="flex flex-1 justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-[60px]">
        <div className="w-full max-w-[1392px]">
          <SignupFormContainer />
        </div>
      </main>
    </div>
  );
}
