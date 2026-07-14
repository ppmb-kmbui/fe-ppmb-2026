import Image from "next/image";

import { MobileAdminFooter } from "./MobileFooter";
import { MobileAdminHeader } from "./MobileAdminHeader";

export function MobileAdminPage() {
  return (
      <div className="flex min-h-screen flex-col bg-[image:var(--gradient-dashboard)] bg-cover md:hidden">
        <MobileAdminHeader />

        <main className="flex flex-1 items-center justify-center px-6">
          <div className="flex w-full max-w-sm flex-col items-center text-center">
            <Image
              src="/assets/astronaut-login.webp"
              alt="Astronaut"
              width={240}
              height={321}
              className="shrink-0 h-auto w-[55vw] min-w-[170px] max-w-[260px]"
              priority
            />

            <h2 className="mt-10 max-w-xs font-heading text-h6 sm:text-h5 text-center text-yellow-500">
              "Ups, layar radarmu terlalu kecil!{"\u00A0"}🔭"
            </h2>

            <p className="mt-5 max-w-sm text-center text-b4 sm:text-b3 text-foreground">
              <span className="text-b3">
                Halaman Admin
              </span>{" "}
              sedang mengorbit di luar jangkauan layar ini.
              <br />
              Buka versi desktop untuk memantau seluruh misi.
            </p>
          </div>
        </main>

        <MobileAdminFooter />
      </div>
  );
}