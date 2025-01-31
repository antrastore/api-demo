'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, ArrowLeft } from "lucide-react"
import { useState, useEffect } from 'react'
import Link from "next/link"

export default function BankAccountForm() {
const [banks, setBanks] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)
const [selectedBank, setSelectedBank] = useState('')
const [accountNumber, setAccountNumber] = useState('')
const [verificationResult, setVerificationResult] = useState(null)
const [verifying, setVerifying] = useState(false)

useEffect(() => {
const fetchBanks = async () => {
try {
const response = await fetch('https://gotech.web.id/api/getListBank', {
headers: {
'Content-Type': 'application/json',
'Authorization': 'Bearer NxQUjLtD6xJgEILqTS14VBb3y'
}
})

if (!response.ok) {
throw new Error('Failed to fetch banks')
}

const data = await response.json()
if (data.success && data.data) {
setBanks(data.data)
}
} catch (err) {
setError(err.message)
} finally {
setLoading(false)
}
}

fetchBanks()
}, [])

const handleVerification = async () => {
if (!selectedBank || !accountNumber) {
setError('Please select a bank and enter account number')
return
}

setVerifying(true)
setVerificationResult(null)
setError(null)

try {
const response = await fetch(`https://gotech.web.id/api/checkBank/${selectedBank}?noRek=${accountNumber}`, {
headers: {
'Content-Type': 'application/json',
'Authorization': 'Bearer NxQUjLtD6xJgEILqTS14VBb3y'
}
})

if (!response.ok) {
throw new Error('Verification failed')
}

const data = await response.json()
setVerificationResult(data)
} catch (err) {
setError(err.message)
} finally {
setVerifying(false)
}
}

return (
<>
    <div className="container mx-auto py-12 px-4">

        <Link href="/" className="inline-flex items-center text-primary hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
        </Link>
    </div>
    <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-primary" />
            <CardTitle className="text-2xl">Bank Account Verification</CardTitle>
            <CardDescription>Verify a bank account number</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="bank">Bank</Label>
                <Select disabled={loading} value={selectedBank} onValueChange={setSelectedBank}>
                    <SelectTrigger id="bank">
                        <SelectValue placeholder={loading ? "Loading banks..." : "Select a bank" } />
                    </SelectTrigger>
                    <SelectContent>
                        {error ? (
                        <SelectItem value="error">Error loading banks</SelectItem>
                        ) : (
                        banks.map((bank) => (
                        <SelectItem key={bank.BankCode} value={bank.BankCode}>
                            {bank.BankName} ({bank.BankStatus})
                        </SelectItem>
                        ))
                        )}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="account-number">Account Number</Label>
                <Input id="account-number" placeholder="Enter account number" value={accountNumber} onChange={(e)=>
                setAccountNumber(e.target.value)}
                />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}

            {verificationResult && verificationResult.success && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Account Details:</h3>
                <pre className="text-sm whitespace-pre-wrap overflow-x-auto">
                {JSON.stringify(verificationResult.details, null, 2)}
              </pre>
            </div>
            )}
        </CardContent>
        <CardFooter>
            <Button className="w-full" onClick={handleVerification} disabled={verifying || !selectedBank ||
                !accountNumber}>
                {verifying ? 'Verifying...' : 'Verify Account'}
            </Button>
        </CardFooter>
    </Card>
</>
)
}
