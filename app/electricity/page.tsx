'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, Zap } from "lucide-react"
import { useState } from 'react'

export default function ElectricityDemo() {
  const [selectedType, setSelectedType] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [inquiryResult, setInquiryResult] = useState(null)

  const electricityTypes = [
    { id: 'prabayar', name: 'Prabayar (Token)' },
    // { id: 'pascabayar', name: 'Pascabayar' }
  ]

  const handleInquiry = async () => {
    if (!selectedType || !customerId) {
      setError('Please select electricity type and enter customer ID')
      return
    }

    setLoading(true)
    setInquiryResult(null)
    setError(null)

    try {
      const response = await fetch(`https://gotech.web.id/api/inquiry/pln/${selectedType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer NxQUjLtD6xJgEILqTS14VBb3y'
        },
        body: JSON.stringify({
          customer_number: customerId
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
          <Zap className="w-12 h-12 mx-auto mb-4 text-primary" />
          <CardTitle className="text-2xl">Electricity IDPEL Verification</CardTitle>
          <CardDescription>Verify a idpel pln</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Electricity Type</Label>
            <Select
              value={selectedType}
              onValueChange={setSelectedType}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select electricity type" />
              </SelectTrigger>
              <SelectContent>
                {electricityTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-id">Customer ID</Label>
            <Input 
              id="customer-id" 
              placeholder="Enter customer ID" 
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
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
            disabled={loading || !selectedType || !customerId}
          >
            {loading ? 'Processing...' : 'Check IDPEL PLN'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}