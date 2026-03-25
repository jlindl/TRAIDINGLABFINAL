"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Image as ImageIcon, 
  Wand2, 
  Zap, 
  History, 
  X, 
  Activity,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Columns,
  ShieldAlert
} from "lucide-react";
import MessageList from "./lab/message-list";
import ResearchPanel from "./lab/research-panel";

import SessionSidebar from "./lab/session-sidebar";

export default function LabAssistantView({ 
  onRunBacktest,
  onUpgrade 
}: { 
  onRunBacktest?: (strategy: any) => void,
  onUpgrade?: () => void
}) {
  const [showResearch, setShowResearch] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [researchWidth, setResearchWidth] = useState(380);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // useChat returns status, messages, and sendMessage in this stable version
  const { messages, status, sendMessage, setMessages, error } = useChat({
    id: currentSessionId || "lab-assistant",
  });

  const isRateLimited = error?.message?.includes("RATE_LIMIT_EXCEEDED") || (error as any)?.status === 429;

  // Load session messages
  const handleSelectSession = async (id: string) => {
    try {
      setCurrentSessionId(id);
      const res = await fetch(`/api/lab/sessions/${id}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        // Map DB messages to UIMessage format
        const uiMessages = data.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          parts: [{ type: 'text', text: m.content }] as any,
          experimental_attachments: m.attachments,
          createdAt: new Date(m.created_at)
        }));
        setMessages(uiMessages);
      }
    } catch (err) {
      console.error("Failed to load session:", err);
    }
  };

  const isNewChatRef = useRef(false);
  const handleNewChat = () => {
    isNewChatRef.current = true;
    setCurrentSessionId(crypto.randomUUID());
  };

  // Inject welcome message for fresh chats
  useEffect(() => {
    if (isNewChatRef.current && messages.length === 0 && status === 'ready') {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "Welcome to the Lab Assistant. I am specialized in high-level strategy research and chart analysis. Upload a screenshot of your charts or describe a strategy to begin.",
        } as any
      ]);
      isNewChatRef.current = false;
    }
  }, [currentSessionId, messages.length, status, setMessages]);

  // Initial mount: Start a new chat if none exists
  useEffect(() => {
    if (!currentSessionId) {
      handleNewChat();
    }
  }, [currentSessionId]);

  const isLoading = status === "streaming" || status === "submitted";

  // INTERNAL REACT LOOP: If the AI generated a tool but no text, force it to summarize!
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === 'assistant') {
        const hasTools = lastMessage.parts?.some((p: any) => p.type && p.type.startsWith('tool-'));
        const hasText = lastMessage.parts?.some((p: any) => p.type === 'text') || !!(lastMessage as any).content;
        
        if (hasTools && !hasText) {
          setTimeout(() => {
             (sendMessage as any)({ text: "_INTERNAL_CONTINUE_LOOP_" }, { 
               body: { id: currentSessionId }
             });
          }, 500);
        }
      }
    }
  }, [isLoading, messages, currentSessionId, sendMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input && attachments.length === 0) return;

    // Use standard sendMessage signature for v4: sendMessage(input, options)
    await (sendMessage as any)({ text: input }, {
      experimental_attachments: attachments,
      body: { id: currentSessionId }
    });
    
    setInput("");
    setAttachments([]);
    
    // If it was a new session, the backend will have created one.
    // We might want to refresh the sidebar here, but we'll rely on currentSessionId state
    // which the sidebar is watching. 
    // However, for the VERY FIRST message of a new chat, 
    // we don't know the new session ID yet until the first turn finishes.
    // The Sidebar fetches on currentSessionId change.
  };

  return (
    <div className="flex h-full w-full gap-0 overflow-hidden bg-[#050505] rounded-3xl border border-white/5 shadow-2xl relative">
      {/* Session History Sidebar */}
      <div className="relative h-full flex items-center">
        <motion.div
          animate={{ width: isSidebarCollapsed ? 0 : 280 }}
          transition={{ type: "spring", damping: 20, stiffness: 150 }}
          className="h-full relative overflow-hidden"
        >
          <SessionSidebar 
            currentSessionId={currentSessionId}
            onSelectSession={handleSelectSession}
            onNewChat={handleNewChat}
            isCollapsed={isSidebarCollapsed}
          />
        </motion.div>
        
        {/* Toggle Button - Positioned to stay visible even when width is 0 */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className={`absolute top-1/2 z-50 h-8 w-6 flex items-center justify-center bg-[#080808]/80 backdrop-blur-md border border-white/5 text-white/40 hover:text-white hover:border-neon/50 transition-all -translate-y-1/2 ${
            isSidebarCollapsed 
              ? "left-0 rounded-r-xl border-l-0" 
              : "right-0 translate-x-1/2 rounded-full h-6 w-6"
          }`}
          title={isSidebarCollapsed ? "Show History" : "Hide History"}
        >
          {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 gap-4 overflow-hidden p-4 px-6">
        <div className="flex flex-1 flex-col gap-4 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                 <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 border border-neon/20">
                   <Zap className="h-3.5 w-3.5 text-neon" />
                 </div>
                 {currentSessionId ? "Research Session" : "Lab Assistant"}
              </h2>
              <div className="h-4 w-px bg-white/5 mx-2" />
              <p className="text-xs text-white/40 font-mono tracking-tighter uppercase">Quant R&D Node v1.0</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={() => setResearchWidth(researchWidth === 380 ? 600 : 380)}
                className={`rounded-xl border h-9 w-9 flex items-center justify-center transition-all ${
                  researchWidth > 380 ? "bg-neon/20 border-neon/40 text-neon" : "bg-white/5 border-white/5 text-white/40 hover:text-white"
                }`}
                title="Expand Results"
              >
                <Columns className="h-4 w-4" />
              </button>
              
              <button 
                type="button"
                onClick={() => setShowResearch(!showResearch)}
                className={`rounded-xl border h-9 px-4 text-[10px] font-bold transition-all flex items-center gap-2 uppercase tracking-widest ${
                  showResearch ? "bg-neon/10 border-neon/20 text-neon shadow-[0_0_15px_rgba(0,255,136,0.1)]" : "bg-white/5 border-white/5 text-white/40 hover:text-white"
                }`}
              >
                <Activity className="h-3.5 w-3.5" />
                {showResearch ? "Hide Evidence" : "Show Evidence"}
              </button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 glass-edge bg-white/[0.01] overflow-hidden flex flex-col relative rounded-2xl border border-white/5 shadow-inner">
             <MessageList 
               messages={messages as any} 
               isLoading={isLoading} 
               error={error} 
               onRunBacktest={onRunBacktest}
             />

             {/* Input Area */}
             <div className="p-4 border-t border-white/5 bg-[#080808]/80 backdrop-blur-xl">
                {attachments.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {attachments.map((file, i) => (
                      <div key={i} className="group relative h-12 w-12 rounded-lg border border-white/10 overflow-hidden bg-white/5">
                        <img src={URL.createObjectURL(file)} alt="upload" className="h-full w-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                           <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={onFormSubmit} className="relative group">
                   <input 
                     type="text" 
                     value={input}
                     onChange={handleInputChange}
                     disabled={isRateLimited}
                     placeholder={isRateLimited ? "Daily quota reached." : "Describe a strategy or upload a chart..."} 
                     className="w-full rounded-2xl bg-white/5 border border-white/10 px-12 py-3.5 text-sm text-white placeholder:text-white/20 focus:border-neon focus:outline-none transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)] group-focus-within:border-neon/40 group-focus-within:bg-white/10 disabled:opacity-30"
                   />
                   
                   {isRateLimited && (
                     <div className="absolute inset-0 z-10 flex items-center justify-between px-6 bg-black/60 backdrop-blur-md rounded-2xl border border-red-500/20">
                        <div className="flex items-center gap-3">
                           <ShieldAlert className="h-4 w-4 text-red-400" />
                           <span className="text-xs font-bold text-white/90 uppercase tracking-tighter">Daily Quota Reached</span>
                        </div>
                        <button 
                          type="button"
                          onClick={onUpgrade}
                          className="px-4 py-1.5 bg-neon rounded-lg text-black text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                        >
                          Upgrade for Unlimited
                        </button>
                     </div>
                   )}

                   <button 
                     type="button"
                     disabled={isRateLimited}
                     onClick={() => fileInputRef.current?.click()}
                     className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-neon transition-colors disabled:opacity-0"
                   >
                      <ImageIcon className="h-5 w-5" />
                   </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange} 
                    multiple 
                    accept="image/*" 
                  />
                  
                  <button 
                    type="submit"
                    disabled={isLoading || (!input && attachments.length === 0)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl bg-neon text-black hover:bg-neon-dim transition-all active:scale-95 disabled:opacity-20 disabled:grayscale"
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </form>
                <div className="mt-3 flex items-center justify-between px-2">
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[8px] font-mono text-white/20 uppercase tracking-widest">
                          <Wand2 className="h-2.5 w-2.5" />
                          Multimodal Vision
                      </div>
                      <div className="flex items-center gap-1.5 text-[8px] font-mono text-white/20 uppercase tracking-widest">
                          <History className="h-2.5 w-2.5" />
                          {currentSessionId ? "History Connected" : "New Terminal"}
                      </div>
                   </div>
                   {currentSessionId && (
                      <div className="text-[8px] font-mono text-white/10 uppercase italic">
                         ID: {currentSessionId.substring(0, 8)}
                      </div>
                   )}
                </div>
             </div>
          </div>
        </div>

        <AnimatePresence>
          {showResearch && (
            <motion.div
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: researchWidth }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="overflow-hidden h-full"
            >
              <ResearchPanel 
                symbol={(() => {
                  const lastUserMessage = messages.filter(m => m.role === "user").slice(-1)[0];
                  if (!lastUserMessage) return "BTC";
                  
                  const text = (lastUserMessage as any).content || 
                    (lastUserMessage.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('\n')) || 
                    "";
                    
                  return text.match(/\$([A-Z]{2,6})\b|\b(BTC|ETH|SOL|BNB|XRP|ADA|DOGE|NVDA|TSLA|AAPL|MSFT|GOOGL|AMZN|META)\b/i)?.[0]
                    ?.replace('$', '')
                    ?.toUpperCase() || "BTC";
                })()} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
