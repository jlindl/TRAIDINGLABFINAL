"use client";

import { UIMessage as Message } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Terminal, CheckCircle2, Zap, ShieldAlert } from "lucide-react";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  error?: Error | undefined;
  onRunBacktest?: (strategy: any) => void;
}

export default function MessageList({ messages, isLoading, error, onRunBacktest }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Helper to extract text content from UIMessage parts (v4 standard)
  const getMessageText = (message: Message) => {
    if ((message as any).content && typeof (message as any).content === 'string') return (message as any).content;
    
    if (message.parts && Array.isArray(message.parts)) {
      return message.parts
        .filter(part => part.type === 'text')
        .map(part => (part as any).text)
        .join('\n');
    }
    return "";
  };

  // Filter out internal system loop triggers
  const visibleMessages = messages.filter(m => getMessageText(m) !== "_INTERNAL_CONTINUE_LOOP_");

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar space-y-8">
      {visibleMessages.map((message, idx) => {
        const text = getMessageText(message);
        let toolInvocations = (message as any).toolInvocations || [];
        
        if (toolInvocations.length === 0 && message.parts) {
          toolInvocations = message.parts
            .filter((p: any) => p.type && p.type.startsWith('tool-'))
            .map((p: any) => ({
              state: p.state === 'output-available' || p.output ? 'result' : 'call',
              toolName: p.type.replace('tool-', ''),
              toolCallId: p.toolCallId,
              args: p.input,
              result: p.output
            }));
        }
        
        const isLastVisible = idx === visibleMessages.length - 1;
        const isStreaming = isLastVisible && isLoading && message.role === 'assistant';

        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
              message.role === 'assistant' ? 'bg-neon/10 border-neon/30 text-neon' : 'bg-white/5 border-white/10 text-white/40'
            }`}>
              {message.role === 'assistant' ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
            </div>

            <div className={`flex max-w-[85%] flex-col gap-2 ${message.role === 'user' ? 'items-end' : ''}`}>
               <div className={`rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                 message.role === 'assistant' 
                   ? 'bg-white/[0.03] text-white/90 border border-white/5' 
                   : 'bg-neon/10 text-white border border-neon/20 shadow-[0_0_20px_rgba(0,255,136,0.05)]'
               }`}>
                  {/* Tool Invocations / Research Progress */}
                  {message.role === 'assistant' && toolInvocations.length > 0 && (
                    <div className={`flex flex-col gap-3 min-w-[300px] ${!text ? 'py-2 mb-0' : 'mb-4'}`}>
                       {toolInvocations.map((inv: any, idx: number) => (
                          <div key={idx} className="flex flex-col gap-2">
                             <div className="flex items-center gap-3 text-[11px] font-mono text-white/50 bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                                <Zap className={`h-3 w-3 ${inv.state === 'result' ? 'text-neon' : 'text-white/40 animate-pulse'}`} />
                                <span>
                                  {inv.toolName === 'get_market_data' ? `Fetching Live Data for ${inv.args?.symbol || 'Ticker'}...` : 
                                   inv.toolName === 'finalize_strategy' ? "Formalizing Strategy Contract..." : 
                                   inv.toolName === 'get_saved_strategies' ? "Recalling Strategy History..." :
                                   inv.toolName === 'get_strategy_details' ? `Analyzing "${inv.args?.name || 'Strategy'}"...` :
                                   "Executing Lab Operation..."}
                                </span>
                                {inv.state === 'result' && <CheckCircle2 className="h-3 w-3 text-neon ml-auto" />}
                             </div>
                             
                             {/* Custom UI for specific tool outputs */}
                             {inv.state === 'result' && inv.result && inv.toolName === 'get_saved_strategies' && Array.isArray(inv.result) && (
                               <div className="mt-1 grid grid-cols-1 gap-2">
                                 {inv.result.slice(0, 3).map((strat: any, sIdx: number) => (
                                    <div key={sIdx} className="bg-white/5 border border-white/10 rounded-lg p-3 text-xs w-full">
                                      <div className="font-bold text-white mb-1">{strat.name}</div>
                                      <div className="flex justify-between items-center text-white/50 text-[10px]">
                                        <span>Win Rate: {strat.performance_snapshot?.winRate !== undefined ? ((strat.performance_snapshot.winRate) * 100).toFixed(1) + '%' : 'N/A'}</span>
                                        <span className={(strat.performance_snapshot?.totalReturn || 0) >= 0 ? "text-neon" : "text-red-400"}>
                                          Ret: {strat.performance_snapshot?.totalReturn !== undefined ? ((strat.performance_snapshot.totalReturn) * 100).toFixed(1) + '%' : 'N/A'}
                                        </span>
                                      </div>
                                    </div>
                                 ))}
                                 {inv.result.length === 0 && <div className="text-xs text-white/40 italic px-2">No saved strategies found.</div>}
                                 {inv.result.length > 3 && <div className="text-[10px] text-white/30 px-2 mt-1">+{inv.result.length - 3} more strategies hidden to save space.</div>}
                               </div>
                             )}

                             {inv.state === 'result' && inv.result && inv.toolName === 'get_market_data' && (
                               <div className="mt-1 bg-gradient-to-br from-neon/10 to-transparent border border-neon/20 rounded-lg p-3 text-xs w-full grid grid-cols-2 gap-4">
                                  <div>
                                     <div className="text-white/40 mb-1 font-mono text-[9px] uppercase">Asset</div>
                                     <div className="font-bold text-white text-sm">{inv.args?.symbol}</div>
                                  </div>
                                  <div>
                                     <div className="text-white/40 mb-1 font-mono text-[9px] uppercase">Price</div>
                                     <div className="font-bold text-neon">${inv.result.price?.toLocaleString() || "..."}</div>
                                  </div>
                               </div>
                             )}
                          </div>
                       ))}
                    </div>
                  )}

                  {/* Markdown Content */}
                  <div className="relative">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="mb-4 last:mb-0 last:inline">{children}</p>,
                        h1: ({ children }) => <h1 className="text-lg font-bold text-white mb-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-md font-bold text-white mb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-sm font-bold text-white mb-2">{children}</h3>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="text-white/70">{children}</li>,
                        strong: ({ children }) => <strong className="text-neon font-bold">{children}</strong>,
                        code: ({ children }) => <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono text-neon">{children}</code>,
                      }}
                    >
                      {text}
                    </ReactMarkdown>
                    {isStreaming && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                        className="inline-block w-1.5 h-4 bg-neon ml-1 translate-y-0.5 shadow-[0_0_8px_rgba(85,255,0,0.5)]"
                      />
                    )}
                  </div>

                  {/* Financial Disclaimer Bubble */}
                  {message.role === 'assistant' && (
                    <div className="mt-6 flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5 text-[10px] text-white/30 italic leading-relaxed">
                      <ShieldAlert className="h-3 w-3 mt-0.5 shrink-0 text-white/20" />
                      <span>The quantitative logic provided above is for research and backtesting purposes only. This is not financial advice. Past performance is no guarantee of future results.</span>
                    </div>
                  )}
               </div>
               
               {/* Strategy Finalization Card */}
                {message.role === 'assistant' && (toolInvocations.some((tc: any) => tc.toolName === 'finalize_strategy')) && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-4 w-full glass-edge bg-neon/10 border-neon/30 p-4 rounded-xl border"
                  >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                           <Terminal className="h-4 w-4 text-neon" />
                           <span className="text-[10px] font-mono font-bold text-neon uppercase tracking-widest">Strategy Finalized</span>
                        </div>
                        {toolInvocations.find((tc: any) => tc.toolName === 'finalize_strategy')?.result?.status === 'warning' ? (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                            <span className="text-[8px] font-bold text-yellow-500 uppercase">Fixed</span>
                          </div>
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-neon" />
                        )}
                     </div>
                     <p className="text-xs text-white/60 mb-4 italic truncate">
                        {toolInvocations.find((tc: any) => tc.toolName === 'finalize_strategy')?.args?.name || "Ready for backtesting."}
                     </p>

                     {/* Linter Fixes */}
                     {toolInvocations.find((tc: any) => tc.toolName === 'finalize_strategy')?.result?.fixes?.length > 0 && (
                        <div className="mb-5 bg-black/30 rounded-lg p-2.5 border border-white/5">
                           <div className="text-[8px] uppercase text-white/40 mb-1.5 font-bold tracking-wider">Engine Compatibility Fixes:</div>
                           <ul className="text-[10px] text-neon/90 space-y-1">
                              {toolInvocations.find((tc: any) => tc.toolName === 'finalize_strategy').result.fixes.map((f: string, i: number) => (
                                <li key={i} className="flex gap-2">
                                  <span className="text-neon/40">•</span>
                                  <span>{f}</span>
                                </li>
                              ))}
                           </ul>
                        </div>
                     )}

                     <button 
                       onClick={() => {
                         const toolCall = toolInvocations.find((tc: any) => tc.toolName === 'finalize_strategy');
                         if (toolCall?.args) {
                           // Use the FIXED strategy from result if available, otherwise map args
                           const engineStrategy = toolCall.result?.strategy || {
                             setup: { indicators: toolCall.args.indicators },
                             entry: { 
                               logic: toolCall.args.entryLogic, 
                               shortLogic: toolCall.args.entryShortLogic 
                             },
                             exit: { 
                               logic: toolCall.args.exitLogic, 
                               shortLogic: toolCall.args.exitShortLogic,
                               tpPct: toolCall.args.tpPct,
                               slPct: toolCall.args.slPct,
                               tslPct: toolCall.args.tslPct,
                               bePct: toolCall.args.bePct
                             }
                           };

                           onRunBacktest?.({
                             name: toolCall.args.name,
                             symbol: toolCall.args.ticker,
                             timeframe: toolCall.args.timeframe,
                             ...engineStrategy
                           });
                         }
                       }}
                       className="w-full rounded-lg bg-neon py-2.5 text-xs font-bold text-black hover:bg-neon-dim transition-all shadow-[0_0_25px_rgba(0,255,136,0.15)] active:scale-[0.98]"
                     >
                        Run Backtest Now
                     </button>
                  </motion.div>
                )}

               <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest px-2">
                 {message.role === 'assistant' ? 'Lab Assistant' : 'You'} — {new Date((message as any).createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </span>
            </div>
          </motion.div>
        );
      })}

      {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-4"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-neon/10 border-neon/30 text-neon">
            <Bot className="h-5 w-5 animate-pulse" />
          </div>
          <div className="flex items-center gap-1.5 px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/5">
             <div className="h-1.5 w-1.5 rounded-full bg-neon animate-bounce [animation-delay:-0.3s]" />
             <div className="h-1.5 w-1.5 rounded-full bg-neon animate-bounce [animation-delay:-0.15s]" />
             <div className="h-1.5 w-1.5 rounded-full bg-neon animate-bounce" />
          </div>
        </motion.div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>Error: {error.message || "Failed to connect to the Lab Assistant. Please check your API keys."}</span>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
