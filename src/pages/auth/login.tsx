import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { LoaderCircle, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/authStore"
import { BrandLogo } from "@/components/app/brand-logo"

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [form, setForm] = useState({ email: "employee@datanox.com", password: "employee123" })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await login(form.email, form.password)
    setLoading(false)

    if (!result.ok) {
      toast.error(result.message)
      return
    }
    toast.success("Welcome to Datanox AMS")
    navigate("/dashboard")
  }

  return (
    <div className="relative min-h-screen grid place-items-center px-5 overflow-hidden">
      <motion.div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#F56B1F]/15 blur-3xl" animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 4 }} />
      <motion.div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-zinc-300/30 blur-3xl" animate={{ scale: [1.1, 1, 1.1] }} transition={{ repeat: Infinity, duration: 4 }} />

      <Card className="relative w-full max-w-md border-zinc-200 shadow-2xl bg-white/95">
        <CardHeader>
          <div className="flex items-center gap-3">
            <BrandLogo showText={false} imageClassName="h-11 w-11 rounded-lg" />
            <div>
              <CardTitle className="text-2xl text-[#1A1A2E] flex items-center gap-2">Datanox Attendance <Sparkles size={17} className="text-[#F56B1F]" /></CardTitle>
              <CardDescription className="flex items-center gap-1"><ShieldCheck size={13} /> Secure workforce portal</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-lg border border-dashed border-zinc-300 p-3 text-xs text-zinc-600 space-y-1">
            <p><strong>Director:</strong> director@datanox.com / director123</p>
            <p><strong>Lead:</strong> lead@datanox.com / lead123</p>
            <p><strong>Employee:</strong> employee@datanox.com / employee123</p>
            <p><strong>Finance:</strong> finance@datanox.com / finance123</p>
            <p><strong>HR:</strong> hr@datanox.com / hr123</p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                <Input
                  value={form.email}
                  autoComplete="email"
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="pl-9 focus-visible:ring-[#F56B1F]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                <Input
                  type="password"
                  value={form.password}
                  autoComplete="current-password"
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="pl-9 focus-visible:ring-[#F56B1F]"
                />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-[#F56B1F] hover:bg-[#df5d15] text-white">
              {loading ? (
                <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 0.9 }}>
                  <LoaderCircle size={18} />
                </motion.span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
