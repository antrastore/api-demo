"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, Gamepad2 } from "lucide-react"
import { useState, useEffect } from 'react'
import { Alert, AlertDescription } from "@/components/ui/alert"

const API_TOKEN = "NxQUjLtD6xJgEILqTS14VBb3y"

export default function CheckGamesDemo() {
  const [games, setGames] = useState([])
  const [selectedGame, setSelectedGame] = useState("")
  const [userId, setUserId] = useState("")
  const [zone, setZone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [verificationResult, setVerificationResult] = useState(null)

  // Get list of games on component mount
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("https://gotech.web.id/api/getListGame", {
          headers: {
            "Authorization": `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json"
          }
        })
        const data = await response.json()
        if (data.success) {
          setGames(data.data)
        } else {
          setError("Failed to fetch games list")
        }
      } catch (err) {
        setError("Error connecting to server")
      }
    }

    fetchGames()
  }, [])

  // Check if selected game requires zone
  const requiresZone = (gameCode) => {
    const game = games.find(g => g.GameCode === gameCode)
    return game?.GameNotes?.toLowerCase().includes("zone")
  }

  // Handle verification
  const handleVerify = async () => {
    setLoading(true)
    setError(null)
    setVerificationResult(null)

    try {
      const zoneParam = requiresZone(selectedGame) ? `&zone=${zone}` : ""
      const response = await fetch(
        `https://gotech.web.id/api/inquiry/${selectedGame}?user_id=${userId}${zoneParam}`,
        {
          headers: {
            "Authorization": `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json"
          }
        }
      )
      const data = await response.json()
      if (data.success) {
        setVerificationResult(data.data)
      } else {
        setError(data.message || "Verification failed")
      }
    } catch (err) {
      setError("Error connecting to server")
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
          <Gamepad2 className="w-12 h-12 mx-auto mb-4 text-primary" />
          <CardTitle className="text-2xl">Game Account Verification</CardTitle>
          <CardDescription>Verify a game account</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="game">Game</Label>
            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger id="game">
                <SelectValue placeholder="Select a game" />
              </SelectTrigger>
              <SelectContent>
                {games.map((game) => (
                  <SelectItem key={game.GameCode} value={game.GameCode}>
                    {game.GameName} | {game.GameNotes}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-id">User ID</Label>
            <Input 
              id="user-id" 
              placeholder="Enter user ID" 
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>

          {selectedGame && requiresZone(selectedGame) && (
            <div className="space-y-2">
              <Label htmlFor="zone">Zone (Berikan Nilai 0 saja untuk game yang tidak pakai zone)</Label>
              <Input 
                id="zone" 
                placeholder="Enter zone" 
                value={zone}
                onChange={(e) => setZone(e.target.value)}
              />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {verificationResult && (
            <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(verificationResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleVerify}
            disabled={loading || !selectedGame || !userId || (requiresZone(selectedGame) && !zone)}
          >
            {loading ? "Verifying..." : "Verify Account"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}