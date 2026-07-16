import { ShaderBackground } from "@/components/ui/hero/hero-section";
import { AuthCard } from "@/components/features/auth/auth-card";

export default function LandingPage() {
  return (
    <ShaderBackground>
      <main className="relative z-20 flex min-h-screen items-center justify-center px-6 py-16">
        <AuthCard />
      </main>
    </ShaderBackground>
  );
}
