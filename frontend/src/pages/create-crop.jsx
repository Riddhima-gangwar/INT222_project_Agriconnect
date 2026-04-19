import { Layout } from "@/components/layout";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateCrop } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Leaf, Scale, MapPin } from "lucide-react";
import { Link } from "wouter";
import { ImageUpload } from "@/components/image-upload";

const cropSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  unit: z.string().min(1, "Unit is required"),
  pricePerUnit: z.coerce.number().min(0.01, "Price must be greater than 0"),
  currency: z.string().default("USD"),
  harvestDate: z.string().min(1, "Harvest date is required"),
  imageUrl: z.string().optional().nullable(),
});

export default function CreateCrop() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createCropMutation = useCreateCrop();

  const form = useForm({
    resolver: zodResolver(cropSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      quantity: 0,
      unit: "tons",
      pricePerUnit: 0,
      currency: "USD",
      harvestDate: "",
      imageUrl: "",
    },
  });

  function onSubmit(data) {
    createCropMutation.mutate(
      { data },
      {
        onSuccess: (crop) => {
          toast({
            title: "Crop listed successfully!",
            description: "Your crop is now visible in the marketplace.",
          });
          setLocation(`/crops/${crop.id}`);
        },
        onError: (error) => {
          toast({
            title: "Failed to list crop",
            description: error.message || "An unexpected error occurred",
            variant: "destructive",
          });
        },
      },
    );
  }

  return (
    <Layout>
      <div className="bg-primary/5 py-10 border-b border-border/40">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <Button variant="ghost" size="sm" className="mb-6 -ml-4" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>
          </Button>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground tracking-tight">
              List a New Harvest
            </h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-xl">
              Provide details about your upcoming yield to attract serious
              buyers and secure forward contracts.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-10 max-w-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Main Details */}
            <Card className="rounded-3xl border-border shadow-sm overflow-hidden">
              <div className="bg-muted/30 px-8 py-6 border-b border-border flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                  <Leaf className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-serif text-foreground">
                    Basic Information
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    What are you growing this season?
                  </p>
                </div>
              </div>
              <CardContent className="p-8 space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Listing Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Premium Organic Hass Avocados"
                          {...field}
                          data-testid="input-title"
                          className="h-12 bg-muted/30 text-base border-border"
                        />
                      </FormControl>
                      <FormDescription>
                        Make it descriptive and attractive to buyers.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              data-testid="select-category"
                              className="h-12 bg-muted/30 text-base border-border"
                            >
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="grains">
                              Grains & Cereals
                            </SelectItem>
                            <SelectItem value="vegetables">
                              Vegetables
                            </SelectItem>
                            <SelectItem value="fruits">Fruits</SelectItem>
                            <SelectItem value="legumes">Legumes</SelectItem>
                            <SelectItem value="nuts">Nuts & Seeds</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="harvestDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Estimated Harvest Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            data-testid="input-harvest-date"
                            className="h-12 bg-muted/30 text-base border-border"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Detailed Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the quality, farming practices, soil conditions, and any organic certifications..."
                          className="resize-none h-32 bg-muted/30 text-base border-border p-4"
                          {...field}
                          data-testid="input-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Pricing & Volume */}
            <Card className="rounded-3xl border-border shadow-sm overflow-hidden">
              <div className="bg-muted/30 px-8 py-6 border-b border-border flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/20 text-secondary-foreground rounded-2xl flex items-center justify-center">
                  <Scale className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-serif text-foreground">
                    Volume & Pricing
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Set your expectations for contracting.
                  </p>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Available Quantity
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            step="any"
                            {...field}
                            data-testid="input-quantity"
                            className="h-12 bg-muted/30 text-base border-border"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Measurement Unit
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              data-testid="select-unit"
                              className="h-12 bg-muted/30 text-base border-border"
                            >
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="tons">Tons (t)</SelectItem>
                            <SelectItem value="kg">Kilograms (kg)</SelectItem>
                            <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                            <SelectItem value="bushels">Bushels</SelectItem>
                            <SelectItem value="boxes">Boxes</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pricePerUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Asking Price (USD)
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                              $
                            </span>
                            <Input
                              type="number"
                              min="0.01"
                              step="0.01"
                              {...field}
                              data-testid="input-price"
                              className="pl-8 h-12 bg-muted/30 text-base border-border"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Media */}
            <Card className="rounded-3xl border-border shadow-sm overflow-hidden mb-8">
              <div className="bg-muted/30 px-8 py-6 border-b border-border flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-serif text-foreground">
                    Visuals
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    A good photo increases buyer interest.
                  </p>
                </div>
              </div>
              <CardContent className="p-8">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          onClear={() => field.onChange("")}
                          folder="crops"
                          label="Upload a high-quality photo of your farm or crop"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
              <Button
                variant="ghost"
                type="button"
                size="lg"
                className="rounded-full"
                onClick={() => setLocation("/dashboard")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                className="rounded-full px-10 shadow-lg"
                disabled={createCropMutation.isPending}
                data-testid="button-submit-crop"
              >
                {createCropMutation.isPending && (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                )}
                Publish Listing
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
}
