"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import Link from "next/link";


export const formSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export default function SigninClient() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/chat";


  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleCredentialSignIn = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        form.setError("email", {
          message: "Invalid credentials. Please try again.",
        });
      } else if (result?.ok) {
        window.location.href = callbackUrl;
      }
    } catch (err: unknown) {
      form.setError("email", {
        message: err instanceof Error ? err.message : "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-sm p-8 space-y-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-primary">
          Sign In
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCredentialSignIn)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Email Address"
                      className="h-12 rounded-full bg-input/20 border-input text-md font-sans px-4 focus:bg-input/30 transition-colors"
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
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                      className="h-12 rounded-full bg-input/20 border-input text-md font-sans px-4 focus:bg-input/30 transition-colors"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full rounded-full h-12 text-md font-sans font-medium mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>




      </div>
    </div>
  );
}
