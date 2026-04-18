import { useState } from "react";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterUser, RegisterBodyRole, RegisterBody } from "@workspace/api-client-react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Leaf, Loader2, Sprout, Store, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["farmer", "buyer"] as const, { required_error: "Please select a role" }),
  phone: z.string().optional(),
  location: z.string().optional(),
});

export default function Register() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const registerMutation = useRegisterUser();

  const form = useForm<RegisterBody>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "farmer",
      phone: "",
      location: "",
    },
  });

  function onSubmit(data: RegisterBody) {
    registerMutation.mutate(
      { data },
      {
        onSuccess: (response) => {
          login(response);
          toast({
            title: "Welcome to AgriConnect!",
            description: "Your account has been successfully created.",
          });
          setLocation("/dashboard");
        },
        onError: (error) => {
          toast({
            title: "Registration failed",
            description: error.message || "An error occurred during registration",
            variant: "destructive",
          });
        },
      }
    );
  }

  return (
    <div className="min-h-[100dvh] w-full flex flex-row-reverse bg-background">
      {/* Image Side */}
      <div className="hidden lg:block lg:w-1/2 relative bg-primary overflow-hidden">
        <img 
          src="/images/auth-farm.jpg" 
          alt="Lush green organic farm" 
          className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
        
        <div className="relative z-10 h-full flex flex-col justify-between p-12 lg:p-20 text-primary-foreground">
          <div className="flex justify-end">
            <Link href="/" className="flex items-center gap-2 w-fit group">
              <span className="font-bold text-3xl font-serif tracking-tight">AgriConnect</span>
              <div className="bg-secondary text-secondary-foreground p-2 rounded-lg group-hover:bg-accent transition-colors">
                <Leaf className="h-6 w-6" />
              </div>
            </Link>
          </div>

          <div>
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6 leading-tight">
              Grow your business with confidence.
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-md">
              Join thousands of farmers and buyers transforming the agricultural supply chain through direct, reliable contracts.
            </p>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 md:px-16 lg:px-20 py-12 h-screen overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <Leaf className="h-6 w-6" />
            </div>
            <span className="font-bold text-2xl font-serif text-primary">AgriConnect</span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-foreground tracking-tight mb-2">Create an account</h1>
            <p className="text-muted-foreground text-lg">Join the marketplace for assured farming contracts.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <Label className="text-base font-medium">I am joining as a...</Label>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        <Label
                          htmlFor="role-farmer"
                          className={`cursor-pointer flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-4 transition-all ${
                            field.value === 'farmer' 
                              ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                              : 'border-border/60 bg-muted/30 hover:bg-muted text-muted-foreground'
                          }`}
                        >
                          <RadioGroupItem value="farmer" id="role-farmer" className="sr-only" />
                          <div className={`p-3 rounded-full ${field.value === 'farmer' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                            <Sprout className="h-6 w-6" />
                          </div>
                          <span className="font-bold text-lg font-serif">Farmer</span>
                        </Label>
                        
                        <Label
                          htmlFor="role-buyer"
                          className={`cursor-pointer flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-4 transition-all ${
                            field.value === 'buyer' 
                              ? 'border-secondary bg-secondary/10 text-primary shadow-sm' 
                              : 'border-border/60 bg-muted/30 hover:bg-muted text-muted-foreground'
                          }`}
                        >
                          <RadioGroupItem value="buyer" id="role-buyer" className="sr-only" />
                          <div className={`p-3 rounded-full ${field.value === 'buyer' ? 'bg-secondary text-secondary-foreground' : 'bg-background'}`}>
                            <Store className="h-6 w-6" />
                          </div>
                          <span className="font-bold text-lg font-serif">Buyer</span>
                        </Label>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4 pt-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="name">Full Name</Label>
                      <FormControl>
                        <Input id="name" placeholder="E.g. Green Acres Farm" {...field} data-testid="input-name" className="h-12 bg-muted/50 border-border/60" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="email">Email address</Label>
                      <FormControl>
                        <Input id="email" type="email" placeholder="name@example.com" {...field} data-testid="input-email" className="h-12 bg-muted/50 border-border/60" />
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
                      <Label htmlFor="password">Password</Label>
                      <FormControl>
                        <Input id="password" type="password" {...field} data-testid="input-password" className="h-12 bg-muted/50 border-border/60" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="phone">Phone (Optional)</Label>
                        <FormControl>
                          <Input id="phone" type="tel" {...field} data-testid="input-phone" className="h-12 bg-muted/50 border-border/60" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="location">Location (Optional)</Label>
                        <FormControl>
                          <Input id="location" placeholder="City, State" {...field} data-testid="input-location" className="h-12 bg-muted/50 border-border/60" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/20 mt-6" 
                disabled={registerMutation.isPending}
                data-testid="button-register"
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>Create Account <ArrowRight className="ml-2 h-5 w-5" /></>
                )}
              </Button>
            </form>
          </Form>

          <div className="pt-6 text-center text-muted-foreground border-t border-border">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-primary hover:text-secondary transition-colors" data-testid="link-signin">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
