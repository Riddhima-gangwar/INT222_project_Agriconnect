import { Link, useLocation } from "wouter";
import { useAuth } from "./auth-provider";
import { Button } from "@/components/ui/button";
import { Leaf, Menu, MessageSquare, Briefcase, LayoutDashboard, Store } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useState } from "react";
import { useTheme } from "./theme-provider";
import { Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}

function Navbar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const navLinks = user
    ? [
        { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
        { href: "/marketplace", label: "Marketplace", icon: <Store className="w-4 h-4 mr-2" /> },
        { href: "/contracts", label: "Contracts", icon: <Briefcase className="w-4 h-4 mr-2" /> },
        { href: "/messages", label: "Messages", icon: <MessageSquare className="w-4 h-4 mr-2" /> },
      ]
    : [
        { href: "/marketplace", label: "Marketplace", icon: <Store className="w-4 h-4 mr-2" /> },
      ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary-foreground/10 bg-primary text-primary-foreground shadow-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8 mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group" data-testid="link-home">
            <div className="bg-secondary text-secondary-foreground p-1.5 rounded-md group-hover:bg-accent transition-colors">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl hidden sm:inline-block tracking-tight font-serif">AgriConnect</span>
          </Link>
          <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = location.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors flex items-center px-3 py-2 rounded-md ${
                    isActive 
                      ? "bg-primary-foreground/15 text-primary-foreground font-semibold" 
                      : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  }`}
                  data-testid={`link-${link.label.toLowerCase()}`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} data-testid="button-theme-toggle" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user ? (
            <div className="hidden md:flex items-center gap-4 ml-2 pl-4 border-l border-primary-foreground/20">
              <Link href="/profile" className="flex items-center gap-2 hover:bg-primary-foreground/10 px-3 py-1.5 rounded-full transition-colors" data-testid="link-profile">
                <Avatar className="h-8 w-8 border border-primary-foreground/20">
                  <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-bold">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start leading-none text-primary-foreground">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-primary-foreground/70 capitalize">{user.role}</span>
                </div>
              </Link>
              <Button variant="outline" onClick={logout} data-testid="button-logout" size="sm" className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Log out
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 ml-2 pl-4 border-l border-primary-foreground/20">
              <Link href="/login">
                <Button variant="ghost" data-testid="link-login" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">Log in</Button>
              </Link>
              <Link href="/register">
                <Button data-testid="link-register" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">Sign up</Button>
              </Link>
            </div>
          )}

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground hover:bg-primary-foreground/10" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] border-border bg-background">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">Main navigation for AgriConnect</SheetDescription>
              <div className="flex flex-col gap-6 py-6 h-full">
                <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-xl text-primary font-serif">AgriConnect</span>
                </Link>
                
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const isActive = location.startsWith(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`text-lg font-medium px-4 py-3 rounded-md flex items-center transition-colors ${
                          isActive 
                            ? "bg-primary text-primary-foreground" 
                            : "text-foreground/80 hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        {link.icon}
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-auto flex flex-col gap-4 border-t border-border pt-6">
                  {user ? (
                    <>
                      <Link href="/profile" className="flex items-center gap-3 px-4 bg-muted/30 py-3 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                        <Avatar className="h-10 w-10 border border-border">
                          <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
                          <AvatarFallback className="bg-secondary text-secondary-foreground font-bold">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-foreground">{user.name}</div>
                          <div className="text-sm text-muted-foreground capitalize">{user.role}</div>
                        </div>
                      </Link>
                      <Button variant="outline" className="w-full justify-start border-border" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full border-border">Log in</Button>
                      </Link>
                      <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Sign up</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 md:py-16 mt-auto">
      <div className="container mx-auto px-4 md:px-8 max-w-screen-2xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-secondary text-secondary-foreground p-1.5 rounded-md">
                <Leaf className="h-6 w-6" />
              </div>
              <span className="font-bold text-2xl font-serif">AgriConnect</span>
            </Link>
            <p className="text-sm text-primary-foreground/70 max-w-xs leading-relaxed mt-2">
              The assured contract farming marketplace connecting reliable growers with serious buyers for a more predictable agricultural supply chain.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-secondary font-serif text-lg">Platform</h3>
            <ul className="flex flex-col gap-3 text-sm text-primary-foreground/80">
              <li><Link href="/marketplace" className="hover:text-secondary transition-colors">Marketplace</Link></li>
              <li><Link href="/how-it-works" className="hover:text-secondary transition-colors">How it Works</Link></li>
              <li><Link href="/pricing" className="hover:text-secondary transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-secondary font-serif text-lg">Legal</h3>
            <ul className="flex flex-col gap-3 text-sm text-primary-foreground/80">
              <li><Link href="/terms" className="hover:text-secondary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/contracts/templates" className="hover:text-secondary transition-colors">Contract Templates</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-secondary font-serif text-lg">Support</h3>
            <ul className="flex flex-col gap-3 text-sm text-primary-foreground/80">
              <li><Link href="/help" className="hover:text-secondary transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-secondary transition-colors">Contact Us</Link></li>
              <li><Link href="/status" className="hover:text-secondary transition-colors">System Status</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} AgriConnect. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <span className="flex items-center gap-1">Grounded in trust <Leaf className="h-3 w-3 text-secondary" /> Grown with care</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
