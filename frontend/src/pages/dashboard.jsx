import { Layout } from "@/components/layout";
import { useAuth } from "@/components/auth-provider";
import {
  useGetDashboardSummary,
  getGetDashboardSummaryQueryKey,
  useGetRecentActivity,
  getGetRecentActivityQueryKey,
} from "@workspace/api-client-react";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Sprout,
  Briefcase,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  Activity,
  Plus,
  Store,
  Leaf,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: summary, isLoading: isLoadingSummary } = useGetDashboardSummary(
    {
      query: {
        queryKey: getGetDashboardSummaryQueryKey(),
      },
    },
  );

  const { data: activities, isLoading: isLoadingActivities } =
    useGetRecentActivity({
      query: {
        queryKey: getGetRecentActivityQueryKey(),
      },
    });

  const isFarmer = user?.role === "farmer";

  return (
    <Layout>
      {/* Dashboard Header */}
      <div className="bg-primary/5 border-b border-border/40 py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge
                  variant="outline"
                  className="bg-secondary/10 text-secondary-foreground border-secondary/20"
                >
                  {isFarmer ? "Grower Account" : "Buyer Account"}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold font-serif tracking-tight text-foreground">
                Welcome back, {user?.name.split(" ")[0]}
              </h1>
              <p className="text-lg text-muted-foreground mt-2 max-w-xl">
                Here's what's happening with your agricultural contracts and
                listings.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isFarmer && (
                <Link href="/crops/new">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                    data-testid="btn-add-crop"
                  >
                    <Plus className="mr-2 h-5 w-5" /> List New Crop
                  </Button>
                </Link>
              )}
              <Link href="/marketplace">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-border/80 hover:bg-muted"
                  data-testid="btn-marketplace"
                >
                  Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-10 max-w-7xl">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Active Contracts"
            value={summary?.activeContracts}
            icon={<Briefcase className="h-6 w-6 text-primary" />}
            isLoading={isLoadingSummary}
            trend="+2 this month"
          />

          <StatCard
            title="Pending Proposals"
            value={summary?.pendingContracts}
            icon={<Clock className="h-6 w-6 text-secondary" />}
            isLoading={isLoadingSummary}
            trend="Action required"
          />

          <StatCard
            title="Completed"
            value={summary?.completedContracts}
            icon={<CheckCircle2 className="h-6 w-6 text-green-600" />}
            isLoading={isLoadingSummary}
            trend="All time"
          />

          {isFarmer ? (
            <StatCard
              title="Total Value"
              value={
                summary?.totalRevenue
                  ? `₹${summary.totalRevenue.toLocaleString()}`
                  : "₹0"
              }
              icon={<DollarSign className="h-6 w-6 text-emerald-600" />}
              isLoading={isLoadingSummary}
              trend="Contracted revenue"
            />
          ) : (
            <StatCard
              title="Farmers Connected"
              value={summary?.totalFarmers}
              icon={<Users className="h-6 w-6 text-primary" />}
              isLoading={isLoadingSummary}
              trend="In your network"
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {isFarmer ? (
                <>
                  <Link
                    href="/crops/new"
                    className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Sprout className="w-32 h-32 transform rotate-12" />
                    </div>
                    <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Sprout className="h-7 w-7" />
                    </div>
                    <h3 className="font-bold font-serif text-2xl mb-2 text-foreground">
                      List a Crop
                    </h3>
                    <p className="text-muted-foreground">
                      Publish your upcoming harvest to the marketplace to
                      attract forward contracts.
                    </p>
                  </Link>

                  <Link
                    href="/contracts"
                    className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Briefcase className="w-32 h-32 transform -rotate-12" />
                    </div>
                    <div className="w-14 h-14 bg-secondary/20 text-secondary-foreground rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary transition-colors">
                      <Briefcase className="h-7 w-7" />
                    </div>
                    <h3 className="font-bold font-serif text-2xl mb-2 text-foreground">
                      Manage Contracts
                    </h3>
                    <p className="text-muted-foreground">
                      Review incoming proposals, negotiate terms, and track
                      active agreements.
                    </p>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/marketplace"
                    className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Store className="w-32 h-32 transform rotate-12" />
                    </div>
                    <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Store className="h-7 w-7" />
                    </div>
                    <h3 className="font-bold font-serif text-2xl mb-2 text-foreground">
                      Find Crops
                    </h3>
                    <p className="text-muted-foreground">
                      Search the marketplace for available harvests and reliable
                      growers.
                    </p>
                  </Link>

                  <Link
                    href="/contracts"
                    className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Briefcase className="w-32 h-32 transform -rotate-12" />
                    </div>
                    <div className="w-14 h-14 bg-secondary/20 text-secondary-foreground rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary transition-colors">
                      <Briefcase className="h-7 w-7" />
                    </div>
                    <h3 className="font-bold font-serif text-2xl mb-2 text-foreground">
                      Track Orders
                    </h3>
                    <p className="text-muted-foreground">
                      Monitor delivery timelines, manage payments, and review
                      contract terms.
                    </p>
                  </Link>
                </>
              )}
            </div>

            {/* Empty State / Placeholder Chart */}
            <Card className="rounded-3xl overflow-hidden border-border shadow-sm">
              <CardHeader className="bg-muted/30 border-b border-border pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-serif text-xl">
                      Season Overview
                    </CardTitle>
                    <CardDescription>
                      Metrics will populate as you secure contracts.
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full">
                    View Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-10">
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-10">
                  <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center border border-border/50 shadow-sm">
                    <Leaf className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                  <h4 className="text-lg font-medium text-foreground">
                    Growing your network
                  </h4>
                  <p className="text-muted-foreground max-w-sm">
                    Your business analytics will appear here once you have
                    active contracts in the system.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Activity Feed */}
          <div className="space-y-8">
            <Card className="h-full rounded-3xl border-border shadow-sm flex flex-col">
              <CardHeader className="border-b border-border/50 pb-5">
                <CardTitle className="font-serif text-xl flex items-center gap-2">
                  <Activity className="h-5 w-5 text-secondary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-hidden">
                {isLoadingActivities ? (
                  <div className="p-6 space-y-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex gap-4">
                        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activities && activities.length > 0 ? (
                  <div className="divide-y divide-border/50">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="p-5 flex gap-4 hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted border border-border shrink-0">
                          {activity.type === "contract" && (
                            <Briefcase className="h-4 w-4 text-primary" />
                          )}
                          {activity.type === "message" && (
                            <MessageSquare className="h-4 w-4 text-secondary-foreground" />
                          )}
                          {activity.type === "crop" && (
                            <Sprout className="h-4 w-4 text-green-600" />
                          )}
                          {activity.type === "payment" && (
                            <DollarSign className="h-4 w-4 text-emerald-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground leading-snug mb-1">
                            {activity.description}
                          </p>
                          <time className="text-xs font-mono text-muted-foreground">
                            {format(
                              new Date(activity.createdAt),
                              "MMM d, h:mm a",
                            )}
                          </time>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 flex flex-col items-center justify-center text-center h-full text-muted-foreground">
                    <Clock className="h-12 w-12 mb-4 opacity-20" />
                    <p className="font-medium text-foreground mb-1">
                      Quiet in the fields
                    </p>
                    <p className="text-sm">No recent activity to display.</p>
                  </div>
                )}
              </CardContent>
              {activities && activities.length > 0 && (
                <div className="p-4 border-t border-border bg-muted/10 text-center">
                  <Button
                    variant="link"
                    className="text-primary font-medium w-full"
                  >
                    View Full History
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Badge({ children, variant = "default", className = "" }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}

function StatCard({ title, value, icon, isLoading, trend }) {
  return (
    <Card className="rounded-3xl border-border shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center border border-border/50">
            {icon}
          </div>
          <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border border-border/50">
            {trend}
          </span>
        </div>
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">
            {title}
          </p>
          {isLoading ? (
            <Skeleton className="h-8 w-24 mt-1" />
          ) : (
            <div className="text-3xl font-bold font-serif text-foreground tracking-tight">
              {value !== undefined ? value : 0}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
