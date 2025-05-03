"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export function RecoverySentCard() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gray-50 pt-32 overflow-hidden">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="flex flex-col items-center space-y-2 text-center">
          <div className="relative mb-4">
            <div className="h-24 w-24 text-teal-400">
              <EnvelopeIcon />
            </div>
            <div className="absolute -right-2 -top-2 rounded-full bg-teal-500 p-1 text-white">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Check your email</h1>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            We&apos;ve sent an email with the next steps, check your inbox and
            follow along.
          </p>
          <Button
            asChild
            className="w-full bg-[#002642] text-white hover:bg-[#00315c]"
          >
            <Link href="/login">Return to login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function EnvelopeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      <path
        d="M22 8.608V16.75C22 17.9926 20.9926 19 19.75 19H4.25C3.00736 19 2 17.9926 2 16.75V8.608L11.514 13.865C11.8159 14.0461 12.1841 14.0461 12.486 13.865L22 8.608Z"
        fill="currentColor"
      />
      <path
        d="M22 7.25V7.392L12 12.865L2 7.392V7.25C2 6.00736 3.00736 5 4.25 5H19.75C20.9926 5 22 6.00736 22 7.25Z"
        fill="currentColor"
      />
    </svg>
  );
}
