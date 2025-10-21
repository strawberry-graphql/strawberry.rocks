import "./button-link.css";
import Link from "next/link";

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
}

export function ButtonLink({ href, children }: ButtonLinkProps) {
  return (
    <Link href={href} className="button-link typography-label">
      {children}
      <span className="background" />
    </Link>
  );
}
