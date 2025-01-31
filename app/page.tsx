import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowRight, Wallet, Zap, Gamepad2, CreditCard } from "lucide-react"

const apiDemos = [
  { title: "E-Wallet", description: "Demo e-wallet API", href: "/e-wallet", icon: Wallet },
  { title: "Electricity", description: "Demo electricity API", href: "/electricity", icon: Zap },
  { title: "Check Games", description: "Demo game checking API", href: "/check-games", icon: Gamepad2 },
  {
    title: "Check Account Number",
    description: "Demo bank account number verification API",
    href: "/check-account",
    icon: CreditCard,
  },
]

export default function Home() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">API Demo</h1>
      <p className="text-2xl mb-8 text-center">Demo platform created by <a href="https://gotech.web.id" target="_blank">www.gotech.web.id</a></p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {apiDemos.map((demo) => {
          const Icon = demo.icon
          return (
            <Link key={demo.href} href={demo.href} className="no-underline group">
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="flex flex-col items-center text-center">
                  <Icon className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle className="mb-2">{demo.title}</CardTitle>
                  <CardDescription>{demo.description}</CardDescription>
                  <ArrowRight className="mt-4 w-5 h-5 text-primary transition-transform duration-300 group-hover:translate-x-1" />
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

