"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Trash2, 
  Plus, 
  Search,
  ChevronRight,
  Clock
} from "lucide-react";

interface Session {
  id: string;
  title: string;
  updated_at: string;
}

interface SessionSidebarProps {
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  isCollapsed?: boolean;
}

export default function SessionSidebar({ 
  currentSessionId, 
  onSelectSession, 
  onNewChat,
  isCollapsed = false
}: SessionSidebarProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/lab/sessions");
      const data = await res.json();
      if (Array.isArray(data)) setSessions(data);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [currentSessionId]);

  const deleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await fetch(`/api/lab/sessions/${id}`, { method: "DELETE" });
      setSessions(sessions.filter(s => s.id !== id));
      if (currentSessionId === id) onNewChat();
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`flex h-full flex-col border-r border-white/5 bg-[#080808]/50 backdrop-blur-xl transition-all ${isCollapsed ? 'w-[80px]' : 'w-[280px]'}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <button 
          onClick={onNewChat}
          className={`group flex items-center justify-center gap-2 rounded-xl bg-neon text-black hover:bg-neon-dim transition-all shadow-[0_0_20px_rgba(0,255,136,0.1)] active:scale-95 ${isCollapsed ? 'h-12 w-12 p-0' : 'w-full py-3 px-4'}`}
          title="New Research Session"
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span className="text-xs font-bold whitespace-nowrap">New Session</span>}
        </button>
      </div>

      {/* Search */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 relative overflow-hidden"
          >
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2 text-[11px] text-white focus:border-neon/40 focus:outline-none transition-all"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4">
        {loading ? (
          <div className="flex flex-col gap-2 p-2 pt-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`rounded-lg bg-white/5 animate-pulse ${isCollapsed ? 'h-10 w-10' : 'h-12 w-full'}`} />
            ))}
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 opacity-20">
            <MessageSquare className="h-6 w-6 mb-2" />
            {!isCollapsed && <span className="text-[10px] font-mono uppercase tracking-widest">No Sessions</span>}
          </div>
        ) : (
          <div className={`space-y-1 ${isCollapsed ? 'flex flex-col items-center pt-2' : ''}`}>
            {filteredSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`group flex transition-all relative ${
                  isCollapsed ? 'h-12 w-12 items-center justify-center rounded-xl' : 'w-full flex-col gap-1 p-3 rounded-xl border'
                } ${
                  currentSessionId === session.id 
                    ? "bg-neon/10 border-neon/30 text-white" 
                    : "bg-transparent border-transparent text-white/40 hover:bg-white/5 hover:text-white"
                }`}
                title={isCollapsed ? session.title : undefined}
              >
                {!isCollapsed ? (
                  <>
                    <div className="flex items-center justify-between gap-2 w-full">
                      <span className="text-[11px] font-medium truncate text-left">{session.title}</span>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={(e) => deleteSession(e, session.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                        {currentSessionId === session.id && <ChevronRight className="h-3 w-3 text-neon" />}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-40">
                      <Clock className="h-2.5 w-2.5" />
                      <span className="text-[9px] font-mono uppercase tracking-tighter">
                        {new Date(session.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="relative">
                     <MessageSquare className={`h-4 w-4 ${currentSessionId === session.id ? 'text-neon' : ''}`} />
                     {currentSessionId === session.id && (
                        <div className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_8px_#00ff88]" />
                     )}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5 opacity-30 flex justify-center overflow-hidden">
        <div className="flex items-center gap-2 px-1">
           <div className="h-1 w-1 rounded-full bg-neon animate-pulse shrink-0" />
           {!isCollapsed && <span className="text-[8px] font-mono uppercase tracking-widest whitespace-nowrap">DB Sync Active</span>}
        </div>
      </div>
    </div>
  );
}
