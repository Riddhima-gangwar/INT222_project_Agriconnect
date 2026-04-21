import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { Link } from "wouter";
import {
  useListCrops,
  getListCropsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search, MapPin, Calendar, Sprout } from "lucide-react";
import { format } from "date-fns";

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: crops, isLoading } = useListCrops(
    {
      search: debouncedSearch || undefined,
      category: category !== "all" ? category : undefined,
    },
    {
      query: {
        queryKey: getListCropsQueryKey({
          search: debouncedSearch || undefined,
          category: category !== "all" ? category : undefined,
        }),
      },
    },
  );

  return (
    <Layout>
      <div className="bg-primary pt-16 pb-24 relative overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary via-transparent to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold font-serif tracking-tight text-primary-foreground mb-4">
            The Marketplace
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl font-light">
            Discover verified yields, browse forward contracts, and secure your
            supply chain directly from the source.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-10 max-w-7xl -mt-16 relative z-20">
        {/* Filters Card */}
        <div className="bg-card rounded-2xl shadow-xl border border-border p-4 mb-10 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by crop, farmer, or region..."
              className="pl-12 h-14 text-base bg-muted/30 border-none rounded-xl w-full focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-marketplace"
            />
          </div>
          <div className="w-full md:w-64 shrink-0">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                className="h-14 rounded-xl border-none bg-muted/30"
                data-testid="select-category"
              >
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="grains">Grains & Cereals</SelectItem>
                <SelectItem value="vegetables">Vegetables</SelectItem>
                <SelectItem value="fruits">Fruits</SelectItem>
                <SelectItem value="legumes">Legumes</SelectItem>
                <SelectItem value="nuts">Nuts & Seeds</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-32 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium">
              Harvesting data...
            </p>
          </div>
        ) : crops && crops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {crops.map((crop) => (
              <CropCard key={crop.id} crop={crop} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-muted/20 rounded-3xl border border-dashed border-border/60">
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-border">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-3 text-foreground">
              No yields found
            </h3>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              We couldn't find any crops matching your current filters.
            </p>
            {(search || category !== "all") && (
              <Button
                variant="outline"
                size="lg"
                className="mt-8 rounded-full border-primary/20 text-primary hover:bg-primary/5"
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                }}
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

function CropCard({ crop }) {
  return (
    <Link href={`/crops/${crop.id}`} className="group h-full flex outline-none">
      <Card className="flex flex-col w-full h-full overflow-hidden border-border/40 shadow-sm hover:shadow-xl transition-all duration-500 rounded-3xl group-hover:-translate-y-1 bg-card">
        {/* Full Bleed Image Container */}
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {crop.imageUrl ? (
            <img
              src={crop.imageUrl}
              alt={crop.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/5">
              <Sprout className="h-16 w-16 text-primary/20" />
            </div>
          )}

          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 opacity-90 group-hover:opacity-100" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary font-medium px-3 py-1 shadow-sm">
              {crop.category.charAt(0).toUpperCase() + crop.category.slice(1)}
            </Badge>
            {!crop.isAvailable && (
              <Badge variant="destructive" className="shadow-sm">
                Contracted
              </Badge>
            )}
          </div>

          {/* Bottom Overlay Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform transition-transform duration-300">
            <h3
              className="font-bold font-serif text-2xl leading-tight mb-1 drop-shadow-md line-clamp-2"
              title={crop.title}
            >
              {crop.title}
            </h3>
            <p className="text-white/80 text-sm font-medium">
              by {crop.farmerName}
            </p>
          </div>
        </div>

        <CardContent className="p-6 flex-1 flex flex-col bg-background">
          <div className="flex items-end justify-between mb-4 pb-4 border-b border-border/40">
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Asking Price
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-primary font-serif">
                  ₹{crop.pricePerUnit.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">
                  /{crop.unit}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Volume
              </div>
              <div className="font-bold text-foreground">
                {crop.quantity.toLocaleString()}{" "}
                <span className="font-normal text-muted-foreground">
                  {crop.unit}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-auto">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-3 text-secondary shrink-0" />
              <span className="truncate">
                Est. Harvest{" "}
                <strong className="text-foreground ml-1">
                  {format(new Date(crop.harvestDate), "MMM yyyy")}
                </strong>
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-3 text-secondary shrink-0" />
              <span className="truncate">
                {crop.farmerLocation || "Location unavailable"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
