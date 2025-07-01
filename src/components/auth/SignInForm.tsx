"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { EmailInput } from "./EmailInput";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  keepLoggedIn: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function SignInForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", keepLoggedIn: false },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setError("");
    // Simulate async sign-in
    setTimeout(() => {
      setLoading(false);
      // setError("Invalid credentials"); // Uncomment to simulate error
    }, 1200);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="olivia@email.com"
                  {...field}
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="********"
                  {...field}
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name="keepLoggedIn"
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                id="keepLoggedIn"
              />
            )}
          />
          <label
            htmlFor="keepLoggedIn"
            className="text-sm text-muted-foreground select-none cursor-pointer"
          >
            Keep me Logged in.
          </label>
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <Button
          type="submit"
          className="w-full mt-2 bg-[#15949C] hover:bg-[#15949C]/90 text-white"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
        <div className="flex justify-center mt-2">
          <a href="#" className="text-xs text-red-600 hover:underline">
            Forgot password?
          </a>
        </div>
      </form>
    </Form>
  );
}
