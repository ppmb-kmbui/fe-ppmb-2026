import Image from "next/image";

import { LoginFormContainer, MobileAuthFooter, MobileAuthHeader } from "@/components/auth";
import { Header } from "@/components/layout";

interface LoginPageProps {
  searchParams: Promise<{ registered?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { registered } = await searchParams;
  const successMessage =
    registered === "1" ? "Akun berhasil dibuat, silakan masuk." : undefined;

  return (
    <div className="flex min-h-svh flex-col bg-background bg-[linear-gradient(to_bottom,#210736,#4d1e74)] lg:h-svh lg:overflow-hidden lg:bg-none">
      <div className="hidden lg:block">
        <Header />
      </div>
      <MobileAuthHeader className="lg:hidden" />
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:overflow-hidden lg:px-[60px] lg:py-6">
        <div className="flex w-full items-center justify-between">
          <div className="w-full lg:w-[47.4%]">
            <LoginFormContainer successMessage={successMessage} />
          </div>
          <div className="relative hidden aspect-[583/778] w-[min(41.9%,56.2vh)] shrink-0 overflow-hidden lg:block">
            <Image
              src="/assets/astronaut-login.webp"
              alt=""
              fill
              priority
              sizes="42vw"
              className="object-cover"
            />
          </div>
        </div>
      </main>
      <MobileAuthFooter className="lg:hidden" />
    </div>
  );
}
