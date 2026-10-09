"use client";

import { useEffect, useState } from "react";

import { Header } from "@/components/layout/header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function getUser() {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message || "Failed to load profile"
          );
          return;
        }

        setName(data.user.name || "");
        setEmail(data.user.email || "");
      } catch (error) {
        console.error(
          "Failed to load profile:",
          error
        );

        setError(
          "Something went wrong while loading your profile."
        );
      } finally {
        setIsLoading(false);
      }
    }

    getUser();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      setError("Name is required.");
      setMessage("");
      return;
    }

    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "/api/auth/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to update profile."
        );
        return;
      }

      setName(data.user.name);
      setEmail(data.user.email);

      setMessage(
        "Profile updated successfully."
      );

      window.dispatchEvent(
        new Event("profile-updated")
      );
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <Header pageTitle="Settings" />

      <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 md:px-8">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Profile</CardTitle>

              <CardDescription>
                How your name appears across LifeOps AI.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <p className="text-sm text-ink-secondary">
                Loading profile...
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="settings-name">
                    Name
                  </Label>

                  <Input
                    id="settings-name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <Label htmlFor="settings-email">
                    Email
                  </Label>

                  <Input
                    id="settings-email"
                    type="email"
                    value={email}
                    disabled
                  />

                  <p className="mt-1 text-xs text-ink-faint">
                    Email cannot be changed here.
                  </p>
                </div>

                {error && (
                  <p
                    className="text-sm text-red-600"
                    role="alert"
                  >
                    {error}
                  </p>
                )}

                {message && (
                  <p
                    className="text-sm text-green-600"
                    role="status"
                  >
                    {message}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  disabled={isSaving}
                >
                  {isSaving
                    ? "Saving..."
                    : "Save changes"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Account</CardTitle>

              <CardDescription>
                Your LifeOps AI account information.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-ink-secondary">
                  Account status
                </span>

                <span className="font-medium text-green-600">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-ink-secondary">
                  Authentication
                </span>

                <span className="font-medium text-ink">
                  Password + JWT
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}