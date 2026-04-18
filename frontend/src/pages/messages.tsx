import { Layout } from "@/components/layout";
import { useAuth } from "@/components/auth-provider";
import { 
  useListConversations, 
  getListConversationsQueryKey,
  useListMessages,
  getListMessagesQueryKey,
  useSendMessage
} from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Send, Search, MessageSquare, Info } from "lucide-react";
import { format } from "date-fns";
import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function Messages() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations, isLoading: isConvosLoading } = useListConversations(undefined, {
    query: {
      queryKey: getListConversationsQueryKey(),
      refetchInterval: 15000,
    }
  });

  const { data: messages, isLoading: isMessagesLoading } = useListMessages(
    { withUserId: activeUserId || undefined },
    {
      query: {
        queryKey: getListMessagesQueryKey({ withUserId: activeUserId || undefined }),
        enabled: !!activeUserId,
        refetchInterval: 5000,
      }
    }
  );

  const sendMessageMutation = useSendMessage();

  useEffect(() => {
    if (conversations && conversations.length > 0 && !activeUserId) {
      setActiveUserId(conversations[0].userId);
    }
  }, [conversations, activeUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeUserId) return;

    sendMessageMutation.mutate(
      {
        data: {
          receiverId: activeUserId,
          content: message.trim()
        }
      },
      {
        onSuccess: () => {
          setMessage("");
          queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey({ withUserId: activeUserId }) });
          queryClient.invalidateQueries({ queryKey: getListConversationsQueryKey() });
        }
      }
    );
  };

  const activeConvo = conversations?.find(c => c.userId === activeUserId);
  const filteredConvos = conversations?.filter(c => c.userName.toLowerCase().includes(search.toLowerCase()));

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-8 py-8 max-w-6xl h-[calc(100vh-64px)] flex flex-col">
        <h1 className="text-3xl font-bold font-serif tracking-tight text-foreground mb-6">Communications</h1>
        
        <div className="flex-1 flex overflow-hidden rounded-3xl border border-border/60 shadow-sm bg-card min-h-[500px]">
          {/* Sidebar */}
          <div className="w-full md:w-[320px] lg:w-[380px] border-r border-border/60 flex flex-col bg-muted/10 h-full shrink-0">
            <div className="p-5 border-b border-border/60 bg-card">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search conversations..." 
                  className="pl-11 h-12 bg-muted/50 border-border/50 rounded-xl text-base focus-visible:ring-primary focus-visible:bg-background"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {isConvosLoading ? (
                <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : filteredConvos && filteredConvos.length > 0 ? (
                <div className="divide-y divide-border/40">
                  {filteredConvos.map(convo => {
                    const isActive = activeUserId === convo.userId;
                    return (
                      <button
                        key={convo.userId}
                        className={`w-full text-left p-5 flex items-start gap-4 transition-all duration-200 ${
                          isActive 
                            ? 'bg-primary/5 border-l-4 border-l-primary' 
                            : 'border-l-4 border-l-transparent hover:bg-muted/30'
                        }`}
                        onClick={() => setActiveUserId(convo.userId)}
                      >
                        <Avatar className={`h-12 w-12 border ${isActive ? 'border-primary/20 shadow-sm' : 'border-border'}`}>
                          <AvatarFallback className={`${isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary/20 text-secondary-foreground'} font-serif font-bold text-lg`}>
                            {convo.userName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0 overflow-hidden mt-0.5">
                          <div className="flex justify-between items-baseline mb-1.5">
                            <h4 className={`font-bold text-base truncate ${isActive ? 'text-foreground' : 'text-foreground/90'}`}>{convo.userName}</h4>
                            <span className={`text-xs whitespace-nowrap ml-2 ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                              {format(new Date(convo.lastMessageAt), 'MMM d')}
                            </span>
                          </div>
                          <p className={`text-sm truncate ${convo.unreadCount > 0 ? 'font-bold text-foreground' : 'text-muted-foreground leading-relaxed'}`}>
                            {convo.lastMessage}
                          </p>
                        </div>
                        {convo.unreadCount > 0 && (
                          <div className="h-6 w-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold mt-2 shadow-sm">
                            {convo.unreadCount}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center p-10 text-muted-foreground flex flex-col items-center justify-center h-full">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 opacity-40" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-1">No messages</h3>
                  <p className="text-sm">When you contact a farmer or buyer, the conversation will appear here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="hidden md:flex flex-col flex-1 bg-background h-full relative">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent pointer-events-none" />
            
            {activeUserId ? (
              <>
                <div className="px-8 py-5 border-b border-border/60 flex items-center justify-between bg-card z-10 shadow-sm">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border border-border shadow-sm">
                      <AvatarFallback className="bg-primary text-primary-foreground font-serif font-bold text-lg">{activeConvo?.userName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{activeConvo?.userName}</h3>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <p className="text-sm text-muted-foreground capitalize font-medium">{activeConvo?.userRole}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/5">
                    <Info className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-background relative z-10">
                  <div className="text-center pb-6">
                    <span className="bg-muted px-3 py-1 rounded-full text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Beginning of conversation
                    </span>
                  </div>
                  
                  {isMessagesLoading ? (
                    <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                  ) : messages && messages.length > 0 ? (
                    messages.map((msg, idx) => {
                      const isMe = msg.senderId === user?.id;
                      const showTime = idx === 0 || new Date(msg.createdAt).getTime() - new Date(messages[idx-1].createdAt).getTime() > 3600000;
                      
                      return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          {showTime && (
                            <span className="text-xs font-medium text-muted-foreground mb-3 mx-2 bg-muted/50 px-2 py-1 rounded-md">
                              {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                            </span>
                          )}
                          <div className={`max-w-[75%] p-4 text-[15px] leading-relaxed shadow-sm ${
                            isMe 
                              ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm' 
                              : 'bg-muted/40 border border-border/60 rounded-2xl rounded-tl-sm text-foreground'
                          }`}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                      <Leaf className="h-16 w-16 text-primary mb-4" />
                      <p className="text-xl font-serif font-bold text-foreground">Start the conversation</p>
                      <p className="text-muted-foreground mt-2 max-w-sm">Discuss contract terms, coordinate logistics, or build a new relationship.</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-6 bg-card border-t border-border/60 z-10">
                  <form onSubmit={handleSendMessage} className="flex gap-3 bg-muted/30 p-2 rounded-2xl border border-border/60 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                    <Input 
                      placeholder="Type your message..." 
                      className="flex-1 h-14 bg-transparent border-none shadow-none text-base px-4 focus-visible:ring-0"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button type="submit" size="icon" className="h-14 w-14 rounded-xl shrink-0 bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-sm" disabled={!message.trim() || sendMessageMutation.isPending}>
                      {sendMessageMutation.isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-5 w-5" />}
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-background relative z-10">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 border border-border/50 shadow-sm">
                  <MessageSquare className="h-10 w-10 text-muted-foreground opacity-50" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-2">Your Inbox</h3>
                <p className="text-muted-foreground text-lg max-w-md">Select a conversation from the sidebar to view messages or start a new chat from a contract.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
