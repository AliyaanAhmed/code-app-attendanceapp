import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Bot, MessageCircle, SendHorizonal, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/store/appStore"

const canned: Record<string, string> = {
  "How do I request leave?": "Open Leave > Request, choose leave type and date range, then submit.",
  "Where can I view my attendance?": "Use Attendance List for history and Attendance Check-In for today.",
  "How do I submit a timesheet?": "Open Timesheet, complete hours in current week and click Submit to Lead.",
}

type ChatItem = { from: "bot" | "user"; text: string }

export function ChatBot() {
  const { chatbotOpen, toggleChatbot } = useAppStore()
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState<ChatItem[]>([
    { from: "bot", text: "Hi, I am your Datanox assistant. Ask me about attendance, leave, or timesheets." },
  ])

  const chips = useMemo(() => Object.keys(canned), [])

  const answer = (question: string) => {
    const response = canned[question] ?? "Try one of the quick prompts below for instant help."
    setMessages((prev) => [...prev, { from: "user", text: question }])
    setTyping(true)
    window.setTimeout(() => {
      setTyping(false)
      setMessages((prev) => [...prev, { from: "bot", text: response }])
    }, 650)
  }

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-[#F56B1F] hover:bg-[#df5d15] shadow-lg"
        onClick={toggleChatbot}
      >
        <MessageCircle />
      </Button>

      <AnimatePresence>
        {chatbotOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-40 w-[360px] max-w-[90vw]"
          >
            <Card className="border-zinc-200 shadow-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-[#1A1A2E]"><Bot size={16} /> Datanox Assistant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="max-h-56 overflow-y-auto space-y-2 rounded-lg bg-zinc-50 p-3">
                  {messages.map((item, idx) => (
                    <div key={idx} className={`text-sm rounded-md px-3 py-2 ${item.from === "bot" ? "bg-white" : "bg-[#F56B1F] text-white"}`}>
                      {item.text}
                    </div>
                  ))}
                  {typing && (
                    <div className="text-xs text-zinc-500 flex items-center gap-2"><Sparkles size={12} /> Typing...</div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {chips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => answer(chip)}
                      className="rounded-full bg-zinc-100 px-3 py-1 text-xs hover:bg-zinc-200"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask your question"
                    className="focus-visible:ring-[#F56B1F]"
                  />
                  <Button
                    onClick={() => {
                      if (!input.trim()) return
                      answer(input.trim())
                      setInput("")
                    }}
                    className="bg-[#F56B1F] hover:bg-[#df5d15]"
                  >
                    <SendHorizonal size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
