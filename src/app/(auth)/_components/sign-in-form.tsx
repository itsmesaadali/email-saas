"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/schemas/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";
import { useGoogleLogin } from "@/lib/handle-google";

export function LoginForm(props: React.ComponentProps<"div">) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const { handleGoogleLogin, isGooglePending } = useGoogleLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ✅ Email login
  function onSubmit(value: z.infer<typeof loginSchema>) {
    startTransition(async () => {
      await authClient.signIn.email({
        email: value.email,
        password: value.password,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged in successfully!");
            router.push("/mail");
          },
          onError: ({ error }) => {
            toast.error(error.message);
          },
        },
      });
    });
  }



  return (
    <div
      {...props}
      className={cn(
        "bg-background text-foreground flex flex-col gap-6 border border-dashed p-4 sm:p-6",
      )}
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle >Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      {...field}
                      placeholder="john.doe@example.com"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Password */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Password</FieldLabel>
                    <Input
                      {...field}
                      type="password"
                      placeholder="********"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Email Login Button */}
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Spinner /> Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </Field>

              {/* Divider */}
              <div className="relative text-center text-sm">
                <span className="bg-background text-muted-foreground px-2">
                  or continue with
                </span>
                <div className="absolute inset-0 top-1/2 -z-10 border-t" />
              </div>

              {/* ✅ Google Button */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
              >
                {isGooglePending ? (
                  <>
                    <Spinner /> Redirecting...
                  </>
                ) : (
                  "Continue with Google"
                )}
              </Button>

              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
