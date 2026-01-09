import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getChatResponse } from "@/services/aiSimulator";
import { Send, User } from "lucide-react";
import { useRef, useState } from "react";

interface Message {
    id: string;
    sender: "user" | "ai";
    text: string;
}

interface FutureYouChatProps {
    currentSavings: number;
    monthlySavings: number;
}

export const FutureYouChat = ({
    currentSavings,
    monthlySavings,
}: FutureYouChatProps) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            sender: "ai",
            text: "Hello! I am your Future Self from 10 years in the future. Ask me anything about how your current choices are affecting my life!",
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: "user",
            text: input,
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate AI delay
        setTimeout(() => {
            const responseText = getChatResponse(
                userMsg.text,
                currentSavings,
                monthlySavings
            );
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: "ai",
                text: responseText,
            };
            setMessages((prev) => [...prev, aiMsg]);
            setIsTyping(false);

            // Auto-scroll
            if (scrollRef.current) {
                setTimeout(() => {
                    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
                }, 100);
            }
        }, 1500);
    };

    return (
        <div className="card-warm p-0 h-[500px] flex flex-col overflow-hidden">
            <div className="p-4 border-b">
                <h3 className="font-serif text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5 text-accent" />
                    Chat with Future You
                </h3>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg p-3 text-sm ${m.sender === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-foreground"
                                    }`}
                            >
                                {m.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-muted text-foreground rounded-lg p-3 text-sm italic opacity-70">
                                Future You is typing...
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            <div className="p-4 bg-muted/20 border-t flex gap-2">
                <input
                    className="flex-1 bg-transparent border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Ask me about your savings..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button size="icon" onClick={handleSend} disabled={isTyping}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};
