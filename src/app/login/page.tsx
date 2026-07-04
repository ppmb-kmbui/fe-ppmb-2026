import Image from "next/image";

import { LoginForm } from "@/components/auth";
import { Header } from "@/components/layout";

export default function LoginPage() {
  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background">
      <Header />
      <main className="flex flex-1 items-center justify-center overflow-hidden px-[60px] py-6">
        <div className="flex w-full items-center justify-between">
          <div className="w-full lg:w-[47.4%]">
            <LoginForm />
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
    </div>
  );
}
