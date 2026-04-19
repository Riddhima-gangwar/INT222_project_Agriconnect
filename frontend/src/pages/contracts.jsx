import { Layout } from "@/components/layout";
import { useAuth } from "@/components/auth-provider";
import {
  useListContracts,
  getListContractsQueryKey,
} from "@workspace/api-client-react";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Briefcase, Calendar, MapPin, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default function Contracts() {
  const { user } = useAuth();
  const { data: contracts, isLoading } = useListContracts(undefined, {
    query: {
      queryKey: getListContractsQueryKey(),
    },
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 font-medium px-2.5 py-0.5"
          >
            Pending Approval
          </Badge>
        );
      case "negotiating":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 font-medium px-2.5 py-0.5"
          >
            Negotiating
          </Badge>
        );
      case "active":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 font-bold px-2.5 py-0.5"
          >
            Active
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 font-medium px-2.5 py-0.5"
          >
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive" className="font-medium px-2.5 py-0.5">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="font-medium px-2.5 py-0.5">
            {status}
          </Badge>
        );
    }
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case "paid":
        return (
          <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded uppercase tracking-wider">
            Paid
          </span>
        );
      case "partial":
        return (
          <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded uppercase tracking-wider">
            Partial
          </span>
        );
      case "unpaid":
        return (
          <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase tracking-wider">
            Unpaid
          </span>
        );
      default:
        return null;
    }
  };

  // Filter contracts by status
  const filterContracts = (statusGroup) => {
    if (!contracts) return [];
    if (statusGroup === "all") return contracts;
    if (statusGroup === "active")
      return contracts.filter(
        (c) =>
          c.status === "active" ||
          c.status === "negotiating" ||
          c.status === "pending",
      );
    if (statusGroup === "completed")
      return contracts.filter((c) => c.status === "completed");
    if (statusGroup === "cancelled")
      return contracts.filter((c) => c.status === "cancelled");
    return contracts;
  };

  return (
    <Layout>
      <div className="bg-primary/5 py-10 border-b border-border/40">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold font-serif tracking-tight text-foreground">
            Contracts & Agreements
          </h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
            Manage your agricultural proposals, active growing contracts, and
            fulfillment history.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-8 bg-muted/50 p-1.5 rounded-xl h-auto">
            <TabsTrigger
              value="active"
              className="rounded-lg text-base py-2.5 px-6 data-[state=active]:shadow-sm data-[state=active]:bg-background"
              data-testid="tab-active"
            >
              Active & Pending
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="rounded-lg text-base py-2.5 px-6 data-[state=active]:shadow-sm data-[state=active]:bg-background"
              data-testid="tab-completed"
            >
              Completed
            </TabsTrigger>
            <TabsTrigger
              value="cancelled"
              className="rounded-lg text-base py-2.5 px-6 data-[state=active]:shadow-sm data-[state=active]:bg-background"
              data-testid="tab-cancelled"
            >
              Cancelled
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="rounded-lg text-base py-2.5 px-6 data-[state=active]:shadow-sm data-[state=active]:bg-background"
              data-testid="tab-all"
            >
              All
            </TabsTrigger>
          </TabsList>

          {["active", "completed", "cancelled", "all"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-0">
              {isLoading ? (
                <div className="flex flex-col justify-center items-center py-32 space-y-4">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="text-muted-foreground">Loading agreements...</p>
                </div>
              ) : filterContracts(tab).length > 0 ? (
                <div className="grid gap-6">
                  {filterContracts(tab).map((contract) => (
                    <ContractCard
                      key={contract.id}
                      contract={contract}
                      userRole={user?.role}
                      statusBadge={getStatusBadge(contract.status)}
                      paymentBadge={getPaymentBadge(contract.paymentStatus)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-card rounded-3xl border border-dashed border-border/60 shadow-sm">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Briefcase className="h-8 w-8 text-muted-foreground opacity-50" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-3 text-foreground">
                    No {tab !== "all" ? tab : ""} contracts found
                  </h3>
                  <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                    You don't have any agreements matching this status.
                  </p>
                  {user?.role === "buyer" ? (
                    <Button size="lg" className="rounded-full px-8" asChild>
                      <Link href="/marketplace">Find Crops to Contract</Link>
                    </Button>
                  ) : (
                    <Button size="lg" className="rounded-full px-8" asChild>
                      <Link href="/crops/new">List a New Crop</Link>
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
}

function ContractCard({ contract, userRole, statusBadge, paymentBadge }) {
  const otherPartyName =
    userRole === "farmer" ? contract.buyerName : contract.farmerName;
  const otherPartyRole = userRole === "farmer" ? "Buyer" : "Grower";
  const totalValue = contract.quantity * contract.agreedPrice;

  return (
    <Card className="overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl group">
      <CardHeader className="bg-card p-6 border-b border-border/40 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            {statusBadge}
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
              #{contract.id.substring(0, 8).toUpperCase()}
            </span>
          </div>
          <h3 className="text-2xl font-bold font-serif text-foreground mb-1 group-hover:text-primary transition-colors">
            {contract.cropTitle}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {otherPartyRole}:
            </span>{" "}
            {otherPartyName}
          </div>
        </div>
        <div className="md:text-right bg-muted/20 md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none">
          <div className="flex items-center md:justify-end gap-2 mb-1">
            <div className="text-2xl font-bold text-foreground font-serif">
              $
              {totalValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            {paymentBadge && <div className="ml-2">{paymentBadge}</div>}
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            {contract.quantity.toLocaleString()} {contract.unit}{" "}
            <span className="opacity-50 mx-1">×</span> ${contract.agreedPrice}/
            {contract.unit}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-card">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary-foreground flex items-center justify-center shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Target Delivery
            </div>
            <div className="font-medium text-foreground text-base">
              {format(new Date(contract.deliveryDate), "MMMM d, yyyy")}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Delivery Location
            </div>
            <div
              className="font-medium text-foreground text-base truncate"
              title={contract.deliveryLocation}
            >
              {contract.deliveryLocation}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 bg-muted/30 flex flex-col sm:flex-row items-center justify-between border-t border-border/40 gap-4">
        <div className="text-sm text-muted-foreground font-medium">
          Updated {format(new Date(contract.updatedAt), "MMM d, yyyy")}
        </div>
        <Button
          variant="default"
          className="w-full sm:w-auto rounded-full bg-foreground text-background hover:bg-foreground/90 shadow-none"
          asChild
        >
          <Link
            href={`/contracts/${contract.id}`}
            data-testid={`btn-view-contract-${contract.id}`}
          >
            Manage Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
