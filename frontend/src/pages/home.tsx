import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ShieldCheck, Sprout, TrendingUp, Handshake, Users, Leaf, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useListCrops, getListCropsQueryKey } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const { user } = useAuth();
  const { data: crops } = useListCrops(undefined, {
    query: {
      queryKey: getListCropsQueryKey()
    }
  });

  const featuredCrops = crops?.slice(0, 3) || [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-24 pb-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1800&q=80" 
            alt="Rich agricultural farm field at sunset" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent opacity-90"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-8 text-center max-w-4xl pt-10">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
            <div className="inline-flex items-center rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary mb-8 backdrop-blur-md">
              <Sprout className="mr-2 h-4 w-4" />
              Modernizing India's Agricultural Supply Chains
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 font-serif drop-shadow-lg">
              Guaranteed Yields.<br />
              <span className="text-secondary italic">Assured Markets.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Connect directly with serious buyers and reliable farmers. Negotiate fair terms, secure contracts, and build long-term agricultural partnerships rooted in trust.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!user ? (
                <>
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xl shadow-secondary/20" data-testid="hero-cta-register">
                      Join the Network <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/marketplace">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8 border-white/30 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm" data-testid="hero-cta-marketplace">
                      Browse Marketplace
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xl shadow-secondary/20" data-testid="hero-cta-dashboard">
                    Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-secondary text-secondary-foreground py-10 relative z-20 -mt-8 shadow-xl mx-4 md:mx-auto max-w-5xl rounded-2xl">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-secondary-foreground/10">
            <div className="px-4">
              <div className="text-3xl md:text-4xl font-bold font-serif mb-1">5k+</div>
              <div className="text-sm font-medium opacity-80 uppercase tracking-wider">Active Farmers</div>
            </div>
            <div className="px-4">
              <div className="text-3xl md:text-4xl font-bold font-serif mb-1">12k+</div>
              <div className="text-sm font-medium opacity-80 uppercase tracking-wider">Contracts Signed</div>
            </div>
            <div className="px-4">
              <div className="text-3xl md:text-4xl font-bold font-serif mb-1">$40M</div>
              <div className="text-sm font-medium opacity-80 uppercase tracking-wider">Value Traded</div>
            </div>
            <div className="px-4">
              <div className="text-3xl md:text-4xl font-bold font-serif mb-1">98%</div>
              <div className="text-sm font-medium opacity-80 uppercase tracking-wider">Fulfillment Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-sm font-bold text-secondary uppercase tracking-widest mb-3">The Process</h2>
            <h3 className="text-3xl md:text-5xl font-bold font-serif mb-6 text-foreground">Rooted in transparency.</h3>
            <p className="text-muted-foreground text-lg md:text-xl">A secure, streamlined workflow designed to protect the harvest and guarantee the payment.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-border/50 z-0"></div>

            <div className="relative z-10 bg-card border border-border/60 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center mb-8 font-serif text-2xl font-bold shadow-lg shadow-secondary/20">
                1
              </div>
              <h4 className="text-2xl font-serif font-semibold mb-4 text-foreground">Discover & Connect</h4>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Farmers list their upcoming yields. Buyers search the marketplace for specific crops, certified qualities, and precise delivery timelines.
              </p>
            </div>
            
            <div className="relative z-10 bg-primary border border-primary-foreground/10 text-primary-foreground rounded-3xl p-8 shadow-lg shadow-primary/10 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-primary-foreground text-primary flex items-center justify-center mb-8 font-serif text-2xl font-bold">
                2
              </div>
              <h4 className="text-2xl font-serif font-semibold mb-4">Negotiate Terms</h4>
              <p className="text-primary-foreground/80 leading-relaxed text-lg">
                Communicate directly via our platform. Agree on fair pricing, exact quantities, quality standards, and harvest logistics without middlemen.
              </p>
            </div>
            
            <div className="relative z-10 bg-card border border-border/60 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center mb-8 font-serif text-2xl font-bold shadow-lg shadow-secondary/20">
                3
              </div>
              <h4 className="text-2xl font-serif font-semibold mb-4 text-foreground">Secure & Deliver</h4>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Sign a legally binding digital contract. Track the growing progress, manage the final delivery, and release milestone payments securely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Crops */}
      {featuredCrops.length > 0 && (
        <section className="py-24 bg-muted/40 border-y border-border/40">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-bold font-serif mb-4 text-foreground">Fresh from the field</h2>
                <p className="text-lg text-muted-foreground">Explore high-quality yields currently available for forward contracting.</p>
              </div>
              <Link href="/marketplace">
                <Button variant="outline" className="gap-2 rounded-full px-6">
                  View All Crops <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCrops.map((crop) => (
                <Link key={crop.id} href={`/crops/${crop.id}`} className="group block h-full">
                  <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-md">
                    {crop.imageUrl ? (
                      <img 
                        src={crop.imageUrl} 
                        alt={crop.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <Sprout className="h-20 w-20 text-primary/30" />
                      </div>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent"></div>
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <div className="mb-auto flex justify-between">
                        <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary font-medium">
                          {crop.category}
                        </Badge>
                        <Badge variant="outline" className="bg-background/20 text-white border-white/30 backdrop-blur-md">
                          {crop.quantity.toLocaleString()} {crop.unit}
                        </Badge>
                      </div>
                      
                      <h3 className="text-2xl font-bold font-serif text-white mb-2 line-clamp-2 leading-tight">
                        {crop.title}
                      </h3>
                      
                      <div className="flex items-center justify-between text-white/90">
                        <div className="text-sm flex items-center gap-2">
                          <Users className="h-4 w-4" /> {crop.farmerName}
                        </div>
                        <div className="font-bold text-secondary text-xl">
                          ${crop.pricePerUnit.toFixed(2)}<span className="text-sm font-normal text-white/70">/{crop.unit}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-bold text-secondary uppercase tracking-widest mb-3">The Advantage</h2>
              <h3 className="text-3xl md:text-5xl font-bold font-serif mb-8 leading-tight text-foreground">
                Built for the realities of commercial farming
              </h3>
              
              <ul className="space-y-8">
                <li className="flex group">
                  <div className="mr-6 mt-1 flex-shrink-0 w-12 h-12 rounded-2xl bg-muted group-hover:bg-secondary group-hover:text-secondary-foreground text-primary flex items-center justify-center transition-colors">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-serif font-bold mb-2">Price Stability</h4>
                    <p className="text-muted-foreground leading-relaxed text-lg">Lock in prices before harvest to protect against market volatility. Farmers guarantee their income, buyers guarantee their margins.</p>
                  </div>
                </li>
                <li className="flex group">
                  <div className="mr-6 mt-1 flex-shrink-0 w-12 h-12 rounded-2xl bg-muted group-hover:bg-primary group-hover:text-primary-foreground text-primary flex items-center justify-center transition-colors">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-serif font-bold mb-2">Guaranteed Offtake</h4>
                    <p className="text-muted-foreground leading-relaxed text-lg">Grow with confidence knowing your buyer is secured. Buyers get guaranteed supply volume for their operations without the scramble.</p>
                  </div>
                </li>
                <li className="flex group">
                  <div className="mr-6 mt-1 flex-shrink-0 w-12 h-12 rounded-2xl bg-muted group-hover:bg-secondary group-hover:text-secondary-foreground text-primary flex items-center justify-center transition-colors">
                    <Handshake className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-serif font-bold mb-2">Direct Relationships</h4>
                    <p className="text-muted-foreground leading-relaxed text-lg">Cut out unnecessary middlemen who squeeze margins. Build long-term, mutually beneficial relationships directly across the table.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden relative border border-border shadow-2xl">
                <img src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=900&q=80" alt="Farmer in a lush green field" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-8 -left-8 bg-card border border-border p-6 rounded-2xl shadow-xl max-w-[280px] animate-in slide-in-from-bottom-4 duration-1000 delay-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-xl">
                    <Leaf className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-foreground">Verified</div>
                    <div className="text-sm text-muted-foreground">Organic Quality</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic">"Direct contracting gave me the security to invest in better organic inputs."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold font-serif text-primary-foreground mb-6 max-w-3xl mx-auto leading-tight">
            Ready to cultivate a better agricultural future?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Join thousands of growers and buyers building a more resilient, profitable, and transparent food system.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full">
                Get Started Today
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground rounded-full">
                Explore the Market
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
