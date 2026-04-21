import { Layout } from "@/components/layout";
import { useAuth } from "@/components/auth-provider";
import {
  useGetContract,
  getGetContractQueryKey,
  useUpdateContract,
  useListMessages,
  getListMessagesQueryKey,
  getListContractsQueryKey,
  useSendMessage,
} from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  ArrowLeft,
  Send,
  CheckCircle2,
  XCircle,
  FileText,
  Download,
  Calendar,
  MapPin,
  Scale,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import { format } from "date-fns";
import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function ContractDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const { data: contract, isLoading: isContractLoading } = useGetContract(id, {
    query: {
      queryKey: getGetContractQueryKey(id),
      enabled: !!id,
    },
  });

  const { data: messages, isLoading: isMessagesLoading } = useListMessages(
    { contractId: id },
    {
      query: {
        queryKey: getListMessagesQueryKey({ contractId: id }),
        enabled: !!id,
        refetchInterval: 10000, // Poll for new messages
      },
    },
  );

  const updateContractMutation = useUpdateContract();
  const sendMessageMutation = useSendMessage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isContractLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">
            Loading contract details...
          </p>
        </div>
      </Layout>
    );
  }

  if (!contract) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center max-w-lg">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
          <h2 className="text-3xl font-bold font-serif mb-3 text-foreground">
            Contract Not Found
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            This agreement doesn't exist or you don't have access to it.
          </p>
          <Button size="lg" className="rounded-full px-8" asChild>
            <Link href="/contracts">Back to Contracts</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const isFarmer = user?.role === "farmer";
  const otherPartyName = isFarmer ? contract.buyerName : contract.farmerName;
  const otherPartyId = isFarmer ? contract.buyerId : contract.farmerId;
  const totalValue = contract.quantity * contract.agreedPrice;

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 border-amber-200 px-3 py-1"
          >
            Pending Approval
          </Badge>
        );
      case "negotiating":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1"
          >
            In Negotiation
          </Badge>
        );
      case "active":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-200 px-3 py-1 font-bold shadow-sm"
          >
            Active Contract
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-slate-100 text-slate-800 border-slate-300 px-3 py-1"
          >
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive" className="px-3 py-1">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="px-3 py-1">
            {status}
          </Badge>
        );
    }
  };

  const handleUpdateStatus = (status) => {
    updateContractMutation.mutate(
      { id, data: { status } },
      {
        onSuccess: (updatedData) => {
          queryClient.setQueryData(getGetContractQueryKey(id), updatedData);
          queryClient.invalidateQueries({
            queryKey: getListContractsQueryKey(),
          });
          toast({
            title: "Contract Updated",
            description: `Contract status changed to ${status}.`,
          });
        },
        onError: (error) => {
          toast({
            title: "Update Failed",
            description: error.message || "Failed to update contract status",
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendMessageMutation.mutate(
      {
        data: {
          contractId: id,
          receiverId: otherPartyId,
          content: message.trim(),
        },
      },
      {
        onSuccess: () => {
          setMessage("");
          queryClient.invalidateQueries({
            queryKey: getListMessagesQueryKey({ contractId: id }),
          });
        },
      },
    );
  };

  return (
    <Layout>
      <div className="bg-primary/5 border-b border-border/40 py-8">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <Button variant="ghost" size="sm" className="mb-6 -ml-4" asChild>
            <Link href="/contracts">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Contracts
            </Link>
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {getStatusBadge(contract.status)}
                <span className="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  #{contract.id.substring(0, 8).toUpperCase()}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold font-serif tracking-tight text-foreground leading-tight">
                {contract.cropTitle}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-lg text-muted-foreground">
                Agreement between you and{" "}
                <strong className="text-foreground">{otherPartyName}</strong>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 shrink-0">
              {contract.status === "pending" && isFarmer && (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleUpdateStatus("cancelled")}
                    disabled={updateContractMutation.isPending}
                    data-testid="btn-reject-contract"
                  >
                    <XCircle className="mr-2 h-5 w-5" /> Reject
                  </Button>
                  <Button
                    size="lg"
                    className="rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg"
                    onClick={() => handleUpdateStatus("active")}
                    disabled={updateContractMutation.isPending}
                    data-testid="btn-accept-contract"
                  >
                    <CheckCircle2 className="mr-2 h-5 w-5" /> Accept Proposal
                  </Button>
                </>
              )}
              {contract.status === "pending" && !isFarmer && (
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full"
                  onClick={() => handleUpdateStatus("cancelled")}
                  disabled={updateContractMutation.isPending}
                  data-testid="btn-cancel-contract"
                >
                  Cancel Proposal
                </Button>
              )}
              {contract.status === "active" && (
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-green-600/30 text-green-700 hover:bg-green-50"
                  onClick={() => handleUpdateStatus("completed")}
                  disabled={updateContractMutation.isPending}
                  data-testid="btn-complete-contract"
                >
                  <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" /> Mark
                  as Completed
                </Button>
              )}
              <Button
                variant="secondary"
                size="lg"
                className="rounded-full shadow-sm"
                data-testid="btn-download-pdf"
              >
                <Download className="mr-2 h-5 w-5" /> Export PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-3xl border-border/60 shadow-sm overflow-hidden">
              <div className="bg-muted/30 px-8 py-5 border-b border-border/60 flex items-center gap-3">
                <FileText className="h-5 w-5 text-secondary" />
                <h2 className="text-xl font-bold font-serif text-foreground">
                  Terms of Agreement
                </h2>
              </div>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Scale className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        Contracted Volume
                      </p>
                      <p className="font-bold text-2xl text-foreground">
                        {contract.quantity.toLocaleString()}{" "}
                        <span className="text-lg font-medium text-muted-foreground">
                          {contract.unit}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/20 text-secondary-foreground flex items-center justify-center shrink-0">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        Unit Price
                      </p>
                      <p className="font-bold text-2xl text-foreground">
                        ₹{contract.agreedPrice.toFixed(2)}{" "}
                        <span className="text-lg font-medium text-muted-foreground">
                          / {contract.unit}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-background border border-border/60 shadow-sm text-foreground flex items-center justify-center shrink-0">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        Target Delivery
                      </p>
                      <p className="font-medium text-lg text-foreground">
                        {format(
                          new Date(contract.deliveryDate),
                          "MMMM d, yyyy",
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-background border border-border/60 shadow-sm text-foreground flex items-center justify-center shrink-0">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        Delivery Location
                      </p>
                      <p
                        className="font-medium text-lg text-foreground truncate"
                        title={contract.deliveryLocation}
                      >
                        {contract.deliveryLocation}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-foreground uppercase tracking-wider mb-1">
                      Total Contract Value
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Payment status:{" "}
                      <span className="font-bold capitalize text-foreground">
                        {contract.paymentStatus}
                      </span>
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-foreground font-serif">
                    ₹
                    {totalValue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>

                {contract.terms && (
                  <div className="pt-2">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">
                      Special Conditions
                    </h3>
                    <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 text-foreground leading-relaxed whitespace-pre-line">
                      {contract.terms}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chat Interface */}
            <Card className="flex flex-col h-[600px] rounded-3xl border-border/60 shadow-sm overflow-hidden">
              <div className="bg-muted/30 px-6 py-4 border-b border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 text-secondary-foreground font-bold font-serif flex items-center justify-center text-lg">
                    {otherPartyName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">
                      {otherPartyName}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Direct Negotiation Channel
                    </p>
                  </div>
                </div>
              </div>

              <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 bg-card">
                {isMessagesLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : messages && messages.length > 0 ? (
                  messages.map((msg) => {
                    const isMe = msg.senderId === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[85%] p-4 text-[15px] leading-relaxed shadow-sm ${isMe ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm" : "bg-muted rounded-2xl rounded-tl-sm border border-border/50 text-foreground"}`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground mt-2 mx-1">
                          {format(new Date(msg.createdAt), "MMM d, h:mm a")}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <Send className="h-6 w-6 opacity-40" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-lg mb-1">
                        Start the conversation
                      </p>
                      <p className="max-w-xs mx-auto">
                        Discuss terms, coordinate delivery, or ask questions
                        directly here.
                      </p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              <div className="p-4 bg-background border-t border-border/60">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <Input
                    placeholder={`Message ${otherPartyName}...`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 h-14 bg-muted/30 border-border rounded-xl text-base px-4 focus-visible:ring-primary focus-visible:border-primary"
                    data-testid="input-message"
                  />

                  <Button
                    type="submit"
                    size="icon"
                    className="h-14 w-14 rounded-xl shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                    disabled={!message.trim() || sendMessageMutation.isPending}
                    data-testid="btn-send-message"
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </form>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-3xl border-border/60 shadow-sm">
              <div className="bg-muted/30 px-6 py-5 border-b border-border/60">
                <h2 className="text-lg font-bold font-serif text-foreground">
                  Record Timeline
                </h2>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="relative pl-6 border-l-2 border-border space-y-8">
                  <div className="relative">
                    <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-background border-2 border-secondary top-1"></div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Contract Initiated
                    </p>
                    <p className="font-medium text-foreground">
                      {format(new Date(contract.createdAt), "MMMM d, yyyy")}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Proposal submitted via platform
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-background border-2 border-primary top-1"></div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Last Update
                    </p>
                    <p className="font-medium text-foreground">
                      {format(new Date(contract.updatedAt), "MMMM d, yyyy")}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Status changed to {contract.status}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border/60 shadow-sm bg-secondary/5 border-secondary/20">
              <CardContent className="p-6">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-secondary" /> Smart
                  Guarantee
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This contract is protected by AgriConnect's resolution
                  framework. If terms are not met, support is available to
                  mediate.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
