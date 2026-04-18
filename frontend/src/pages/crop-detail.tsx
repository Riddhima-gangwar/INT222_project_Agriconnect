import { Layout } from "@/components/layout";
import { useAuth } from "@/components/auth-provider";
import { 
  useGetCrop, 
  getGetCropQueryKey, 
  useCreateContract, 
  CreateContractBody 
} from "@workspace/api-client-react";
import { useParams, Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, ArrowLeft, MapPin, Calendar, Scale, Tag, User, ShieldCheck, CheckCircle2, Sprout, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const proposalSchema = z.object({
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  agreedPrice: z.coerce.number().min(0.01, "Price must be greater than 0"),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  deliveryLocation: z.string().min(3, "Delivery location is required"),
  terms: z.string().optional(),
});

export default function CropDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: crop, isLoading } = useGetCrop(id, {
    query: {
      queryKey: getGetCropQueryKey(id),
      enabled: !!id
    }
  });

  const createContractMutation = useCreateContract();

  const form = useForm<z.infer<typeof proposalSchema>>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      quantity: 0,
      agreedPrice: 0,
      deliveryDate: "",
      deliveryLocation: user?.location || "",
      terms: "",
    },
  });

  // Pre-fill form when crop loads
  useState(() => {
    if (crop) {
      form.reset({
        quantity: crop.quantity,
        agreedPrice: crop.pricePerUnit,
        deliveryDate: crop.harvestDate.substring(0, 10),
        deliveryLocation: user?.location || "",
        terms: "",
      });
    }
  });

  function onSubmit(data: z.infer<typeof proposalSchema>) {
    if (!crop) return;
    
    const payload: CreateContractBody = {
      cropId: crop.id,
      quantity: data.quantity,
      agreedPrice: data.agreedPrice,
      currency: crop.currency,
      deliveryDate: data.deliveryDate,
      deliveryLocation: data.deliveryLocation,
      terms: data.terms,
    };

    createContractMutation.mutate(
      { data: payload },
      {
        onSuccess: (contract) => {
          setIsDialogOpen(false);
          toast({
            title: "Proposal Sent",
            description: "Your contract proposal has been sent to the farmer.",
          });
          setLocation(`/contracts/${contract.id}`);
        },
        onError: (error) => {
          toast({
            title: "Failed to send proposal",
            description: error.message || "An unexpected error occurred",
            variant: "destructive",
          });
        },
      }
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Loading details...</p>
        </div>
      </Layout>
    );
  }

  if (!crop) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center max-w-lg">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Tag className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
          <h2 className="text-3xl font-bold font-serif mb-3 text-foreground">Listing Not Found</h2>
          <p className="text-muted-foreground text-lg mb-8">This agricultural listing doesn't exist or has been removed from the marketplace.</p>
          <Button size="lg" className="rounded-full px-8" asChild>
            <Link href="/marketplace">Return to Marketplace</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const isOwner = user?.id === crop.farmerId;
  const canPropose = user?.role === "buyer" && crop.isAvailable;

  return (
    <Layout>
      <div className="bg-primary pt-10 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary via-transparent to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
          <Button variant="ghost" className="mb-6 -ml-4 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10" asChild>
            <Link href="/marketplace">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-6xl -mt-24 relative z-20">
        <div className="bg-card rounded-3xl shadow-xl border border-border/60 overflow-hidden mb-12">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="w-full lg:w-1/2 relative bg-muted min-h-[300px] lg:min-h-full">
              {crop.imageUrl ? (
                <img src={crop.imageUrl} alt={crop.title} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                  <Sprout className="h-24 w-24 text-primary/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white flex justify-between items-end">
                <div>
                  <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary mb-3 shadow-lg">
                    {crop.category.charAt(0).toUpperCase() + crop.category.slice(1)}
                  </Badge>
                  <div className="flex items-center text-white/90 text-sm font-medium">
                    <MapPin className="w-4 h-4 mr-1.5" />
                    {crop.farmerLocation || 'Location unavailable'}
                  </div>
                </div>
                {!crop.isAvailable && (
                  <Badge variant="destructive" className="shadow-lg">Contracted</Badge>
                )}
              </div>
            </div>
            
            {/* Details Section */}
            <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-12">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold font-serif tracking-tight text-foreground mb-4 leading-tight">{crop.title}</h1>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary font-serif">${crop.pricePerUnit.toFixed(2)}</span>
                  <span className="text-xl font-medium text-muted-foreground">/ {crop.unit}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 py-6 border-y border-border/60 mb-8">
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Available Quantity</div>
                  <div className="text-xl font-semibold text-foreground flex items-center">
                    <Scale className="h-5 w-5 mr-2 text-secondary" />
                    {crop.quantity.toLocaleString()} {crop.unit}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Est. Harvest</div>
                  <div className="text-xl font-semibold text-foreground flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-secondary" />
                    {format(new Date(crop.harvestDate), 'MMM yyyy')}
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                {isOwner ? (
                  <Button variant="outline" className="w-full h-14 text-lg rounded-full border-border" asChild>
                    <Link href={`/crops/${crop.id}/edit`}>Edit Listing</Link>
                  </Button>
                ) : canPropose ? (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full h-14 text-lg rounded-full shadow-lg shadow-primary/20" size="lg" data-testid="btn-propose-contract">
                        Propose Contract
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto rounded-3xl p-8">
                      <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-serif">Contract Proposal</DialogTitle>
                        <DialogDescription className="text-base mt-2">
                          Send a binding proposal to <strong className="text-foreground">{crop.farmerName}</strong> for <strong className="text-foreground">{crop.title}</strong>.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <div className="grid grid-cols-2 gap-5">
                            <FormField
                              control={form.control}
                              name="quantity"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-base">Quantity ({crop.unit})</FormLabel>
                                  <FormControl>
                                    <Input type="number" step="any" {...field} data-testid="input-proposal-quantity" className="h-12 bg-muted/50 border-border/60" />
                                  </FormControl>
                                  <p className="text-xs text-muted-foreground font-medium">Max: {crop.quantity} {crop.unit}</p>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="agreedPrice"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-base">Price / {crop.unit} ($)</FormLabel>
                                  <FormControl>
                                    <Input type="number" step="0.01" {...field} data-testid="input-proposal-price" className="h-12 bg-muted/50 border-border/60" />
                                  </FormControl>
                                  <p className="text-xs text-muted-foreground font-medium">Asking: ${crop.pricePerUnit}</p>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="bg-primary/5 p-5 rounded-2xl flex items-center justify-between border border-primary/10">
                            <div className="text-sm font-bold text-foreground uppercase tracking-wider">Est. Contract Value</div>
                            <div className="text-2xl font-bold text-primary font-serif">
                              ${(form.watch("quantity") * form.watch("agreedPrice")).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </div>
                          </div>

                          <FormField
                            control={form.control}
                            name="deliveryDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base">Required Delivery Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} data-testid="input-proposal-date" className="h-12 bg-muted/50 border-border/60" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="deliveryLocation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base">Delivery Location</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter precise delivery address" {...field} data-testid="input-proposal-location" className="h-12 bg-muted/50 border-border/60" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="terms"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base">Special Terms (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Any specific quality requirements, packaging needs, or payment conditions..." 
                                    className="resize-none h-28 bg-muted/50 border-border/60" 
                                    {...field} 
                                    data-testid="input-proposal-terms"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-border/40">
                            <Button variant="ghost" type="button" onClick={() => setIsDialogOpen(false)} className="rounded-full px-6">Cancel</Button>
                            <Button type="submit" disabled={createContractMutation.isPending} data-testid="btn-submit-proposal" className="rounded-full px-8 shadow-md">
                              {createContractMutation.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                              Send Proposal
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                ) : !user ? (
                  <Button className="w-full h-14 text-lg rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
                    <Link href="/login">Login to Propose Contract</Link>
                  </Button>
                ) : isOwner ? (
                  <Button className="w-full h-14 text-lg rounded-full" variant="outline" disabled>
                    This is your listing
                  </Button>
                ) : user?.role === "farmer" ? (
                  <Button className="w-full h-14 text-lg rounded-full" variant="outline" disabled>
                    Only buyers can propose contracts
                  </Button>
                ) : !crop.isAvailable ? (
                  <Button className="w-full h-14 text-lg rounded-full" variant="outline" disabled>
                    Crop no longer available
                  </Button>
                ) : (
                  <Button className="w-full h-14 text-lg rounded-full" disabled>
                    Not Available
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-20">
          <div className="md:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold font-serif mb-6 text-foreground">About the Harvest</h2>
              <div className="prose max-w-none text-muted-foreground leading-relaxed text-lg bg-card p-8 rounded-3xl border border-border/50 shadow-sm">
                <p className="whitespace-pre-line">{crop.description}</p>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold font-serif mb-6 text-foreground">How Contracting Works</h2>
              <div className="space-y-6">
                <div className="flex gap-5 bg-card p-6 rounded-3xl border border-border/50 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-serif font-bold text-xl">1</div>
                  <div>
                    <h4 className="font-bold text-lg text-foreground mb-1">Submit Proposal</h4>
                    <p className="text-muted-foreground leading-relaxed">Specify your required quantity, price, and delivery terms. The farmer will be notified immediately.</p>
                  </div>
                </div>
                <div className="flex gap-5 bg-card p-6 rounded-3xl border border-border/50 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-serif font-bold text-xl">2</div>
                  <div>
                    <h4 className="font-bold text-lg text-foreground mb-1">Negotiate & Finalize</h4>
                    <p className="text-muted-foreground leading-relaxed">Chat directly with the farmer on our platform to clarify details and reach a mutual agreement.</p>
                  </div>
                </div>
                <div className="flex gap-5 bg-card p-6 rounded-3xl border border-border/50 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-serif font-bold text-xl">3</div>
                  <div>
                    <h4 className="font-bold text-lg text-foreground mb-1">Active Contract</h4>
                    <p className="text-muted-foreground leading-relaxed">Once accepted, track the progress, coordinate logistics, and manage payments securely.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div>
            <Card className="bg-card rounded-3xl border border-border/50 shadow-md sticky top-24">
              <CardHeader className="pb-4">
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 w-fit">
                  <ShieldCheck className="h-3.5 w-3.5" /> Verified Grower
                </div>
                <CardTitle className="text-xl font-serif text-foreground">Grower Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center text-2xl font-bold text-secondary font-serif">
                    {crop.farmerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-lg text-foreground">{crop.farmerName}</div>
                    <div className="text-sm text-muted-foreground font-medium">Joined {format(new Date(), 'yyyy')}</div>
                  </div>
                </div>
                
                <Separator className="bg-border/60" />
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium flex items-center gap-2"><Briefcase className="w-4 h-4" /> Contracts</span>
                    <span className="font-bold text-foreground bg-muted px-2.5 py-0.5 rounded-md">{crop.contractsCount} active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Reliability</span>
                    <span className="font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2.5 py-0.5 rounded-md">&gt; 95%</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button variant="outline" className="w-full rounded-full border-border text-muted-foreground hover:text-foreground">
                    View Full Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
