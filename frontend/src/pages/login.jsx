import { Link, useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginUser } from "@workspace/api-client-react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Leaf, Loader2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const loginMutation = useLoginUser();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data) {
    loginMutation.mutate(
      { data },
      {
        onSuccess: (response) => {
          login(response);
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
          setLocation("/dashboard");
        },
        onError: (error) => {
          toast({
            title: "Login failed",
            description: error.message || "Invalid email or password",
            variant: "destructive",
          });
        },
      },
    );
  }

  return (
    <div className="min-h-[100dvh] w-full flex bg-background">
      {/* Image Side */}
      <div className="hidden lg:block lg:w-1/2 relative bg-primary overflow-hidden">
        <img
          src="/images/auth-farm.jpg"
          alt="Lush green organic farm"
          className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-between p-12 lg:p-20 text-primary-foreground">
          <Link href="/" className="flex items-center gap-2 w-fit group">
            <div className="bg-secondary text-secondary-foreground p-2 rounded-lg group-hover:bg-accent transition-colors">
              <Leaf className="h-6 w-6" />
            </div>
            <span className="font-bold text-3xl font-serif tracking-tight">
              AgriConnect
            </span>
          </Link>

          <div>
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6 leading-tight">
              Cultivating trust in the agricultural market.
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-md">
              Secure contracts, transparent pricing, and guaranteed delivery for
              farmers and buyers alike.
            </p>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 md:px-20 lg:px-24">
        {/* Mobile Header */}
        <div className="lg:hidden flex justify-center mb-10 mt-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <Leaf className="h-6 w-6" />
            </div>
            <span className="font-bold text-2xl font-serif text-primary">
              AgriConnect
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-foreground tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-muted-foreground text-lg">
              Enter your details to sign in to your account.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email" className="text-base font-medium">
                      Email address
                    </Label>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="farmer@example.com"
                        {...field}
                        data-testid="input-email"
                        className="h-12 text-base bg-muted/50 border-border/60 focus:bg-background"
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
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="password"
                        className="text-base font-medium"
                      >
                        Password
                      </Label>
                      <Link
                        href="#"
                        className="text-sm font-semibold text-primary hover:text-secondary transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        {...field}
                        data-testid="input-password"
                        className="h-12 text-base bg-muted/50 border-border/60 focus:bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/20 mt-4"
                disabled={loginMutation.isPending}
                data-testid="button-login"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="pt-6 text-center text-muted-foreground border-t border-border">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-primary hover:text-secondary transition-colors"
              data-testid="link-signup"
            >
              Sign up today
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
