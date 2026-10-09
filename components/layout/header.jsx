"use client";

import { useEffect, useState } from "react";
import { Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";

export function Header({ pageTitle, children }) {

  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();

        if (data.success) {
          setUserName(data.user.name);
        }
      } catch (error) {
        console.error("Failed to get user:", error);
      }
    }

    getUser();
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-surface-border bg-surface/95 px-4 backdrop-blur md:px-8">
      <h1 className="font-display text-lg font-semibold text-ink">
        {pageTitle}
      </h1>

      <div className="flex items-center gap-3 sm:gap-3">
        <div className="ml-2">
          {children}
        </div>

        <button
          aria-label="Notifications"
          className="flex h-9 w-9 items-center justify-center rounded-control text-ink-secondary hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ops-500"
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </button>

        <Avatar
          initials={userName ? userName.charAt(0).toUpperCase() : ""}
        />

        <button
          onClick={handleLogout}
          aria-label="Logout"
          className="flex h-9 w-9 items-center justify-center rounded-control text-ink-secondary hover:bg-surface-muted hover:text-ink sm:h-auto sm:w-auto sm:px-3 sm:py-2"
        >
          <LogOut className="h-4 w-4 sm:hidden" />

          <span className="hidden text-sm font-medium sm:inline">
            Logout
          </span>
        </button>
      </div>
    </header>
  );
}