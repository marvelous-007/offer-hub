"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SignInForm } from "./SignInForm";
import { OAuthButton } from "./OAuthButton";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

export function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-4xl p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Welcome back
        </h1>
        <div className="space-y-4">
          <OAuthButton
            icon={<FaApple />}
            label="Sign in with Apple"
            onClick={() => {}}
          />
          <OAuthButton
            icon={<FcGoogle />}
            label="Sign in with Google"
            onClick={() => {}}
          />
        </div>
        <div className="flex items-center my-6">
          <Separator className="flex-1" />
          <span className="mx-4 text-muted-foreground text-sm font-medium">
            Or
          </span>
          <Separator className="flex-1" />
        </div>
        <SignInForm />
        <div className="mt-8 text-center text-sm">
          Don&apos;t have an account?{" "}
          <a href="#" className="text-primary font-medium hover:underline">
            Sign up
          </a>
        </div>
      </Card>
    </div>
  );
}
