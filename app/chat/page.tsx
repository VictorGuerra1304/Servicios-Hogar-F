"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Star, Phone, Video, MoreVertical, FileText } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function ChatPage() {
  const searchParams = useSearchParams()
  const providerId = searchParams.get("provider")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "provider",
      content: "¡Hola! Vi tu solicitud de reparación de tubería. ¿Podrías contarme más detalles sobre el problema?",
      timestamp: "10:30 AM",
      type: "text",
    },
    {
      id: 2,
      sender: "client",
      content:
        "Hola Juan, tengo una fuga en la tubería debajo del fregadero de la cocina. El agua gotea constantemente.",
      timestamp: "10:32 AM",
      type: "text",
    },
    {
      id: 3,
      sender: "provider",
      content: "Entiendo. ¿Hace cuánto tiempo comenzó la fuga? ¿Has notado si el problema empeora?",
      timestamp: "10:33 AM",
      type: "text",
    },
    {
      id: 4,
      sender: "client",
      content: "Comenzó hace 3 días y sí, cada vez gotea más. También hay un poco de humedad en el gabinete.",
      timestamp: "10:35 AM",
      type: "text",
    },
    {
      id: 5,
      sender: "provider",
      content:
        "Perfecto. Basándome en tu descripción, necesitaríamos cambiar una sección de tubería y revisar las conexiones. Mi cotización sería de S/120 incluyendo materiales y mano de obra. ¿Te parece bien?",
      timestamp: "10:38 AM",
      type: "quote",
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const provider = {
    id: 1,
    name: "Juan Pérez",
    category: "Gasfitería",
    rating: 4.8,
    reviews: 127,
    image: "/placeholder.svg?height=40&width=40",
    online: true,
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const newMessage = {
      id: messages.length + 1,
      sender: "client" as const,
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text" as const,
    }

    setMessages((prev) => [...prev, newMessage])
    setMessage("")

    // Simulate provider response
    setTimeout(() => {
      const providerResponse = {
        id: messages.length + 2,
        sender: "provider" as const,
        content:
          "Perfecto, ¿cuándo te vendría bien que vaya a revisar? Tengo disponibilidad mañana en la mañana o el viernes en la tarde.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text" as const,
      }
      setMessages((prev) => [...prev, providerResponse])
    }, 1000)
  }

  const handleAcceptQuote = () => {
    const acceptMessage = {
      id: messages.length + 1,
      sender: "client" as const,
      content: "Acepto la cotización de S/120. ¿Cuándo podemos coordinar?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text" as const,
    }
    setMessages((prev) => [...prev, acceptMessage])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          
          <div className="flex items-center justify-between">
            
            <div className="flex items-center space-x-4">
              <Link href="/services" className="flex items-center text-blue-600 hover:text-blue-800">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver
              </Link>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={provider.image || "/placeholder.svg"}
                    alt={provider.name}
                    className="w-10 h-10 rounded-full"
                  />
                  {provider.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold">{provider.name}</h2>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {provider.category}
                    </Badge>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                      <span className="text-xs text-gray-600">
                        {provider.rating} ({provider.reviews})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>

          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 h-[calc(100vh-80px)] flex flex-col">
        <div className="flex-1 flex">
          
          {/* Chat Messages */}
          <div className="flex-1 flex flex-col">
            
            <Card className="flex-1 flex flex-col">
              <CardContent className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "client" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.sender === "client"
                            ? "bg-blue-600 text-white"
                            : msg.type === "quote"
                              ? "bg-green-50 border border-green-200"
                              : "bg-gray-100"
                        }`}
                      >
                        {msg.type === "quote" ? (
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-green-600" />
                              <span className="font-medium text-green-800">Cotización</span>
                            </div>
                            <p className="text-sm text-gray-700">{msg.content}</p>
                            {msg.sender === "provider" && (
                              <div className="flex space-x-2">
                                <Button size="sm" onClick={handleAcceptQuote}>
                                  Aceptar
                                </Button>
                                <Button size="sm" variant="outline">
                                  Negociar
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm">{msg.content}</p>
                        )}
                        <p className={`text-xs mt-1 ${msg.sender === "client" ? "text-blue-100" : "text-gray-500"}`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1"
                  />
                  <Button type="submit" size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>

            </Card>
          </div>

          {/* Sidebar */}
          <div className="w-80 ml-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información del Proveedor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <img
                    src={provider.image || "/placeholder.svg"}
                    alt={provider.name}
                    className="w-20 h-20 rounded-full mx-auto mb-3"
                  />
                  <h3 className="font-semibold">{provider.name}</h3>
                  <Badge variant="outline">{provider.category}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Calificación</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{provider.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Reseñas</span>
                    <span className="text-sm font-medium">{provider.reviews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Estado</span>
                    <Badge variant={provider.online ? "default" : "secondary"}>
                      {provider.online ? "En línea" : "Desconectado"}
                    </Badge>
                  </div>
                </div>

                <Button className="w-full">Ver Perfil Completo</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Solicitar Cotización Formal
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Programar Llamada
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  Ver Reseñas
                </Button>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>

    </div>
  )
}
