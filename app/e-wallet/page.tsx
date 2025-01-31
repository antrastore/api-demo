'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, Wallet } from "lucide-react"
import { useState } from 'react'

export default function EWalletDemo() {
  const [selectedWallet, setSelectedWallet] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [inquiryResult, setInquiryResult] = useState(null)

  const walletTypes = [
    { id: 'ovo', name: 'OVO' },
    { id: 'dana', name: 'DANA' },
    { id: 'linkaja', name: 'Link Aja' }
  ]

  const handleInquiry = async () => {
    if (!selectedWallet || !phoneNumber) {
      setError('Please select an e-wallet type and enter phone number')
      return
    }

    setLoading(true)
    setInquiryResult(null)
    setError(null)

    try {
      const response = await fetch(`https://gotech.web.id/api/inquiry/${selectedWallet}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer NxQUjLtD6xJgEILqTS14VBb3y'
        },
        body: JSON.stringify({
          customer_number: phoneNumber
        })
      })

      if (!response.ok) {
        throw new Error('Inquiry failed')
      }

      const data = await response.json()
      setInquiryResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Link href="/" className="inline-flex items-center text-primary hover:underline mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <Wallet className="w-12 h-12 mx-auto mb-4 text-primary" />
          <CardTitle className="text-2xl">E-Wallet Account Verification</CardTitle>
          <CardDescription>Verify a e-wallet account number</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wallet">E-Wallet Type</Label>
            <Select
              value={selectedWallet}
              onValueChange={setSelectedWallet}
            >
              <SelectTrigger id="wallet">
                <SelectValue placeholder="Select e-wallet type" />
              </SelectTrigger>
              <SelectContent>
                {walletTypes.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id}>
                    {wallet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              placeholder="Enter phone number" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          
          {error && <p className="text-sm text-red-500">{error}</p>}

          {inquiryResult && inquiryResult.success && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Customer Details:</h3>
              <pre className="text-sm whitespace-pre-wrap overflow-x-auto">
                {JSON.stringify(inquiryResult.data, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleInquiry}
            disabled={loading || !selectedWallet || !phoneNumber}
          >
            {loading ? 'Processing...' : 'Verify Account'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}