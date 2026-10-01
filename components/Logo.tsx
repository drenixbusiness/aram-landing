import Image from "next/image";
import logo from "@/public/aram-logo.png";

export default function Logo({ className, priority }: { className: string; priority?: boolean }) {
  return (
    <Image
      src={logo}
      alt="ARAM Logistics Inc"
      className={`logo ${className}`}
      loading={priority ? "eager" : "lazy"}
      sizes="240px"
    />
  );
}
