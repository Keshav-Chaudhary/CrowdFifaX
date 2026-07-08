"use client";

import { useExplain } from "@/contexts/ExplainContext";
import { BrainCircuit, X, CheckCircle2, ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";

export function ExplainAIModal() {
  const { activeExplanation, isOpen, setIsOpen } = useExplain();
  const [mounted, setMounted] = useState(false);
  const [isLLMEnabled, setIsLLMEnabled] = useState<boolean | null>(null);
  const [isLLMConfigured, setIsLLMConfigured] = useState<boolean | null>(null);
  const [dynamicReasoning, setDynamicReasoning] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  
  // Follow-up state
  const [conversation, setConversation] = useState<{role: "user" | "assistant", content: string}[]>([]);
  const [followUpInput, setFollowUpInput] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);
 
  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);
 
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsLLMEnabled(null);
        setIsLLMConfigured(null);
      }, 0);
      fetch("/api/assistant", { cache: "no-store" })
        .then(res => res.json())
        .then(data => {
          setIsLLMEnabled(data.enabled);
          setIsLLMConfigured(data.configured);
        })
        .catch(() => {
          setIsLLMEnabled(false);
          setIsLLMConfigured(false);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !activeExplanation || isLLMEnabled !== true) {
      setTimeout(() => setDynamicReasoning(""), 0);
      return;
    }

    let isSubscribed = true;
    setTimeout(() => {
      setIsStreaming(true);
      setDynamicReasoning("");
    }, 0);

    async function fetchExplanation() {
      try {
        const response = await fetch("/api/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: activeExplanation!.title,
            dataInputs: activeExplanation!.dataInputs,
            prediction: activeExplanation!.prediction,
          }),
        });

        if (!response.ok || !response.body) {
          setIsStreaming(false);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let text = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          text += chunk;
          if (isSubscribed) setDynamicReasoning(text);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isSubscribed) setIsStreaming(false);
      }
    }

    fetchExplanation();

    return () => {
      isSubscribed = false;
    };
  }, [isOpen, activeExplanation, isLLMEnabled]);

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpInput.trim() || isAnswering || !activeExplanation) return;

    const userMsg = followUpInput.trim();
    setFollowUpInput("");
    setIsAnswering(true);

    const initialAssistantMsg = dynamicReasoning || activeExplanation.reasoning;
    
    // Build context if this is the first follow-up
    const currentConvo = conversation.length > 0 
      ? conversation 
      : [{ role: "assistant" as const, content: initialAssistantMsg }];
      
    const updatedConvo = [...currentConvo, { role: "user" as const, content: userMsg }];
    setConversation(updatedConvo);

    // Add empty assistant placeholder for streaming
    setConversation([...updatedConvo, { role: "assistant" as const, content: "" }]);

    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: activeExplanation.title,
          dataInputs: activeExplanation.dataInputs,
          prediction: activeExplanation.prediction,
          messages: updatedConvo,
        }),
      });

      if (!response.ok || !response.body) {
        setIsAnswering(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let text = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        text += chunk;
        
        setConversation(prev => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: text };
          return next;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnswering(false);
    }
  };

  if (!mounted || !isOpen || !activeExplanation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-surface-3/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-surface border border-[var(--border-strong)] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        
        {/* Header */}
        <div className="bg-surface-2 p-6 border-b border-[var(--border-faint)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent)] flex items-center justify-center">
              <BrainCircuit className="size-5 text-[var(--accent)]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-fg flex items-center gap-3">
                AI Reasoning Explained
                {isLLMConfigured !== null && (
                  <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border ${
                    !isLLMConfigured 
                      ? "bg-fg-muted/10 text-fg-muted border-fg-muted/30" 
                      : isLLMEnabled 
                        ? "bg-green-500/10 text-green-500 border-green-500/30" 
                        : "bg-red-500/10 text-red-500 border-red-500/30 animate-pulse"
                  }`}>
                    LLM {!isLLMConfigured ? "Disabled" : isLLMEnabled ? "Online" : "Offline"}
                  </span>
                )}
              </h2>
              <p className="text-xs text-[var(--accent)] uppercase tracking-widest font-bold mt-1">
                {activeExplanation.title}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-fg-muted hover:text-fg hover:bg-surface rounded-full transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body - Explainable AI Chain */}
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Step 1: Data Ingestion */}
          <div className="relative pl-8 border-l-2 border-[var(--border-strong)]">
            <div className="absolute -left-2.5 top-0 size-5 rounded-full bg-surface border-2 border-[var(--border-strong)] flex items-center justify-center">
              <div className="size-1.5 rounded-full bg-fg-muted" />
            </div>
            <h3 className="text-sm font-bold text-fg-muted uppercase tracking-widest mb-3">1. Data Ingested</h3>
            <div className="flex flex-wrap gap-2">
              {activeExplanation.dataInputs.map((input, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-lg bg-surface-2 border border-[var(--border-faint)] text-xs font-mono text-fg">
                  {input}
                </span>
              ))}
            </div>
          </div>

          {/* Step 2: Prediction */}
          <div className="relative pl-8 border-l-2 border-[var(--border-strong)]">
             <div className="absolute -left-2.5 top-0 size-5 rounded-full bg-surface border-2 border-[var(--accent)] flex items-center justify-center">
              <div className="size-1.5 rounded-full bg-[var(--accent)] animate-ping absolute" />
              <div className="size-1.5 rounded-full bg-[var(--accent)]" />
            </div>
            <h3 className="text-sm font-bold text-[var(--accent)] uppercase tracking-widest mb-3">2. Predictive Model</h3>
            <div className="bg-[var(--accent-subtle)] border border-[var(--accent)]/30 rounded-xl p-4 text-sm font-medium text-[var(--accent-fg)]">
              {activeExplanation.prediction}
            </div>
          </div>

          {/* Step 3: Recommendation & Confidence */}
          <div className="relative pl-8">
             <div className="absolute -left-2.5 top-0 size-5 rounded-full bg-[var(--positive)] flex items-center justify-center shadow-[0_0_10px_var(--positive)]">
              <CheckCircle2 className="size-3 text-white" />
            </div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[var(--positive)] uppercase tracking-widest">3. Output & Reasoning</h3>
              <div className="flex items-center gap-1.5 bg-surface-2 px-3 py-1 rounded-full border border-[var(--border)]">
                <span className="text-xs font-bold text-fg-muted">Confidence:</span>
                <span className="text-xs font-bold text-[var(--positive)]">{activeExplanation.confidence}%</span>
              </div>
            </div>
            <p className="text-fg-muted leading-relaxed text-sm bg-surface-2 p-4 rounded-xl border border-[var(--border-faint)]">
              {dynamicReasoning || activeExplanation.reasoning}
              {isStreaming && <span className="inline-block w-2 h-4 ml-1 bg-fg-muted animate-pulse align-middle" />}
            </p>
          </div>

          {/* Step 4: Follow-up Questions (Only if LLM enabled) */}
          {isLLMEnabled && (
            <div className="relative pl-8 pt-4 border-t border-[var(--border-faint)] mt-6">
              <h3 className="text-sm font-bold text-fg uppercase tracking-widest mb-3">Ask a Follow-Up</h3>
              
              {/* Conversation History */}
              {conversation.length > 0 && (
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {conversation.slice(1).map((msg, idx) => (
                    <div key={idx} className={`p-3 rounded-xl text-sm ${msg.role === "user" ? "bg-surface-3 ml-8 text-fg" : "bg-[var(--accent-subtle)] border border-[var(--accent)]/20 mr-8 text-[var(--accent-fg)]"}`}>
                      {msg.content}
                      {msg.role === "assistant" && isAnswering && idx === conversation.length - 2 && (
                        <span className="inline-block w-2 h-4 ml-1 bg-[var(--accent-fg)] animate-pulse align-middle" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleFollowUpSubmit} className="relative">
                <input
                  type="text"
                  value={followUpInput}
                  onChange={(e) => setFollowUpInput(e.target.value)}
                  disabled={isAnswering || isStreaming}
                  placeholder="e.g., Why is this threshold so high?"
                  className="w-full bg-surface-2 border border-[var(--border)] rounded-xl py-3 pl-4 pr-12 text-sm text-fg focus:outline-none focus:border-[var(--accent)] disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!followUpInput.trim() || isAnswering || isStreaming}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[var(--accent)] text-white rounded-lg disabled:opacity-50 hover:opacity-90"
                >
                  <ArrowDown className="size-4 -rotate-90" />
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
