import { HomeLayout } from "@/components/layout/home";
import { baseOptions } from "@/lib/layout.shared";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="mt-24">{children}</div>
    </HomeLayout>
  );
}
