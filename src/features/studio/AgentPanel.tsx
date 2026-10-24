import { useEffect, useRef, useState } from "react";
import { Bot, Check, CircleAlert, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StudioStrings } from "./strings";

export type StepStatus = "pending" | "running" | "done" | "failed";

export type AgentMessage =
  | { id: string; role: "user"; text: string }
  | {
      id: string;
      role: "agent";
      text?: string;
      steps?: { label: string; status: StepStatus; note?: string }[];
      footer?: string;
    };

interface Props {
  s: StudioStrings;
  messages: AgentMessage[];
  busy: boolean;
  onSend: (text: string) => void;
}

const AgentPanel = ({ s, messages, busy, onSend }: Props) => {
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    onSend(t);
    setDraft("");
  };

  return (
    <div className="flex h-full min-h-[420px] flex-col rounded-xl border border-border/60 bg-card">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
        <div className="w-7 h-7 rounded-lg bg-gradient-gold flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-sm">{s.agent.title}</span>
      </div>
      <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3">
        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="ml-8 rounded-2xl rounded-tr-sm bg-muted px-3 py-2 text-sm text-foreground">
              {m.text}
            </div>
          ) : (
            <div key={m.id} className="flex gap-2">
              <div className="w-6 h-6 shrink-0 rounded-md bg-primary/15 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0 space-y-2 text-sm">
                {m.text && <p className="text-foreground leading-relaxed">{m.text}</p>}
                {m.steps && (
                  <div className="rounded-xl border border-border/60 p-3 space-y-2.5">
                    <div className="text-xs font-semibold">{s.agent.steps(m.steps.length)}</div>
                    {m.steps.some((st) => st.status === "running") && (
                      <div className="text-xs text-primary">{s.agent.working}</div>
                    )}
                    {m.steps.map((st, i) => (
                      <div key={i} className="flex gap-2">
                        <span
                          className={cn(
                            "mt-0.5 w-4 h-4 shrink-0 rounded-full flex items-center justify-center text-[9px] font-semibold",
                            st.status === "done" && "bg-emerald-500 text-white",
                            st.status === "failed" && "bg-destructive text-white",
                            st.status === "pending" && "bg-muted text-muted-foreground",
                            st.status === "running" && "text-primary",
                          )}
                        >
                          {st.status === "done" ? (
                            <Check className="w-3 h-3" />
                          ) : st.status === "failed" ? (
                            <CircleAlert className="w-3 h-3" />
                          ) : st.status === "running" ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            i + 1
                          )}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-foreground">{st.label}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {st.note ??
                              (st.status === "pending"
                                ? s.agent.upNext
                                : st.status === "running"
                                  ? s.agent.running
                                  : st.status === "done"
                                    ? s.agent.done
                                    : s.agent.failed)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {m.footer && <p className="text-xs text-muted-foreground">{m.footer}</p>}
              </div>
            </div>
          ),
        )}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-1.5 pl-8">
            {s.agent.examples.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => send(ex)}
                disabled={busy}
                className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/50 text-left"
              >
                {ex}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="p-3 border-t border-border/50 space-y-1.5">
        <div className="flex items-end gap-2 rounded-xl border border-border bg-background p-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(draft);
              }
            }}
            rows={2}
            placeholder={s.agent.placeholder}
            className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <Button size="icon" className="h-8 w-8 rounded-full shrink-0" onClick={() => send(draft)} disabled={busy || !draft.trim()} aria-label={s.agent.send}>
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center">{s.agent.note}</p>
      </div>
    </div>
  );
};

export default AgentPanel;
