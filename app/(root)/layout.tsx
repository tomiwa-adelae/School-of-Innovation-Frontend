import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LiveClassBanner } from "@/components/LiveClassBanner";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      {/* Sits under the fixed header; renders nothing when no class is near. */}
      <div className="pt-20">
        <LiveClassBanner />
        {children}
      </div>
      <Footer />
    </div>
  );
}
