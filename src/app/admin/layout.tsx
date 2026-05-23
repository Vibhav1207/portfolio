"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // If it is the login page, no need to check auth
      if (pathname === "/admin/login") {
        setLoading(false);
        return;
      }

      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      setAuthorized(true);
      setLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  // If it's the login page, render normally
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          <p className="text-sm text-white/60">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null; // Prevents flashing of content before redirecting
  }

  return <>{children}</>;
}
