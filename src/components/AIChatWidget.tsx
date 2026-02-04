import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

type ChatStep = "greeting" | "ask_name" | "ask_email" | "ask_phone" | "ask_inquiry" | "completed";

const emailSchema = z.string().email("Please enter a valid email address");

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatStep, setChatStep] = useState<ChatStep>("greeting");
  const [clientData, setClientData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiry: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Start conversation when widget opens
      addAssistantMessage("Hello! I'm NICS, your AI support assistant. 👋\n\nTo help you better, I'll need a few details. What's your name?");
      setChatStep("ask_name");
    }
  }, [isOpen, messages.length]);

  const addAssistantMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      role: "assistant",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
  };

  const addUserMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
  };

  const saveInquiry = async () => {
    try {
      const { error } = await supabase.from("support_inquiries").insert({
        name: clientData.name.trim(),
        email: clientData.email.trim(),
        phone: clientData.phone.trim() || null,
        inquiry: clientData.inquiry.trim(),
      });

      if (error) {
        console.error("Error saving inquiry:", error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error saving inquiry:", error);
      return false;
    }
  };

  const processInput = async (input: string) => {
    const trimmedInput = input.trim();
    
    switch (chatStep) {
      case "ask_name":
        if (trimmedInput.length < 2) {
          addAssistantMessage("Please enter a valid name (at least 2 characters).");
          return;
        }
        setClientData((prev) => ({ ...prev, name: trimmedInput }));
        addAssistantMessage(`Nice to meet you, ${trimmedInput}! 😊\n\nWhat's your email address so our team can get back to you?`);
        setChatStep("ask_email");
        break;

      case "ask_email":
        try {
          emailSchema.parse(trimmedInput);
          setClientData((prev) => ({ ...prev, email: trimmedInput }));
          addAssistantMessage("Great! And your phone number? (Optional - just type 'skip' if you prefer not to share)");
          setChatStep("ask_phone");
        } catch {
          addAssistantMessage("That doesn't look like a valid email address. Please try again.");
        }
        break;

      case "ask_phone":
        if (trimmedInput.toLowerCase() === "skip" || trimmedInput.toLowerCase() === "no") {
          setClientData((prev) => ({ ...prev, phone: "" }));
        } else {
          setClientData((prev) => ({ ...prev, phone: trimmedInput }));
        }
        addAssistantMessage("Perfect! Now, how can we help you today? Please describe what you're looking for or any questions you have. 💬");
        setChatStep("ask_inquiry");
        break;

      case "ask_inquiry":
        if (trimmedInput.length < 10) {
          addAssistantMessage("Please provide a bit more detail about your inquiry (at least 10 characters).");
          return;
        }
        setClientData((prev) => ({ ...prev, inquiry: trimmedInput }));
        setIsLoading(true);
        
        // Save to database
        const updatedData = { ...clientData, inquiry: trimmedInput };
        const success = await supabase.from("support_inquiries").insert({
          name: updatedData.name.trim(),
          email: updatedData.email.trim(),
          phone: updatedData.phone.trim() || null,
          inquiry: updatedData.inquiry.trim(),
        }).then(({ error }) => !error);

        setIsLoading(false);

        if (success) {
          addAssistantMessage(
            `Thank you, ${clientData.name}! ✅\n\nI've sent all your information to our team. A specialist will contact you at ${clientData.email} as soon as possible.\n\nIn the meantime, feel free to explore our website or reach out directly at info@aibyteconsult.com.\n\nHave a great day! 🌟`
          );
        } else {
          addAssistantMessage(
            "I apologize, but there was an issue saving your inquiry. Please try again or contact us directly at info@aibyteconsult.com"
          );
        }
        setChatStep("completed");
        break;

      case "completed":
        addAssistantMessage(
          "Your inquiry has already been submitted! Our team will contact you soon. If you have another question, please refresh the chat or email us at info@aibyteconsult.com"
        );
        break;

      default:
        addAssistantMessage("Hello! I'm NICS, your AI support assistant. What's your name?");
        setChatStep("ask_name");
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    addUserMessage(inputValue.trim());
    const currentInput = inputValue;
    setInputValue("");
    
    // Small delay for natural conversation feel
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
    
    await processInput(currentInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([]);
    setChatStep("greeting");
    setClientData({ name: "", email: "", phone: "", inquiry: "" });
  };

  const getPlaceholder = () => {
    switch (chatStep) {
      case "ask_name":
        return "Enter your name...";
      case "ask_email":
        return "Enter your email...";
      case "ask_phone":
        return "Enter phone or type 'skip'...";
      case "ask_inquiry":
        return "Describe your question...";
      case "completed":
        return "Chat completed";
      default:
        return "Type your message...";
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-card border border-border rounded-2xl shadow-2xl transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">NICS Support</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                Online 24/7
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {chatStep === "completed" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetChat}
                className="h-8 text-xs hover:bg-muted"
              >
                New Chat
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-full hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4 bg-muted/30">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "assistant"
                    ? "bg-gradient-to-br from-primary to-primary/80"
                    : "bg-muted"
                }`}
              >
                {message.role === "assistant" ? (
                  <Bot className="w-4 h-4 text-primary-foreground" />
                ) : (
                  <User className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div
                className={`max-w-[75%] p-3 rounded-2xl ${
                  message.role === "assistant"
                    ? "bg-card border border-border/50 text-foreground rounded-tl-sm"
                    : "bg-primary text-primary-foreground rounded-tr-sm"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                <p
                  className={`text-[10px] mt-1 ${
                    message.role === "assistant"
                      ? "text-muted-foreground"
                      : "text-primary-foreground/70"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-card border border-border/50 p-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-card rounded-b-2xl">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={getPlaceholder()}
              className="flex-1 bg-muted/50 border-border/50 focus:border-primary/50 rounded-full px-4"
              disabled={isLoading || chatStep === "completed"}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading || chatStep === "completed"}
              size="icon"
              className="rounded-full bg-primary hover:bg-primary/90 w-10 h-10"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            Powered by NICS AI • Your data is secure
          </p>
        </div>
      </div>
    </>
  );
};

export default AIChatWidget;
