import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-white">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-semibold text-[#1A1A2E]">404 - Not found</h1>
        <p className="text-zinc-500">This page does not exist.</p>
        <Button asChild className="bg-[#F56B1F] hover:bg-[#df5d15]">
          <Link to="/">Go to Login</Link>
        </Button>
      </div>
    </div>
  )
}
