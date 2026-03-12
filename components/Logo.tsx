import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const Logo = ({
  type = "white",
  size = "h-12 md:h-16",
  className,
}: {
  type?: "white" | "green";
  size?: string;
  className?: string;
}) => {
  return (
    <Link href="/" className={cn("flex items-center space-x-2")}>
      <Image
        src={"/assets/images/logo.png"}
        alt="School of Innovation Logo"
        width={1000}
        height={1000}
        className={cn(size, className, "w-auto object-contain")}
        priority
      />
    </Link>
  );
};
