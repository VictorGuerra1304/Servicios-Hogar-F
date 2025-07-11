"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Camera, Star, Edit, Save, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [userType, setUserType] = useState<string>("")
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<any>({})

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData")
    const storedUserType = localStorage.getItem("userType")

    if (!storedUserData || !storedUserType) {
      router.push("/")
      return
    }

    const data = JSON.parse(storedUserData)
    setUserData(data)
    setUserType(storedUserType)
    setEditData(data)
  }, [router])

  const handleSave = () => {
    setUserData(editData)
    localStorage.setItem("userData", JSON.stringify(editData))
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(userData)
    setIsEditing(false)
  }

  if (!userData) {
    return <div>Cargando...</div>
  }

  const reviews = [
    {
      id: 1,
      rating: 5,
      comment: "Excelente servicio, muy profesional y puntual.",
      reviewer: userType === "client" ? "Juan Pérez (Gasfitero)" : "María García (Cliente)",
      date: "2024-01-15",
    },
    {
      id: 2,
      rating: 4,
      comment: "Buen trabajo, recomendado.",
      reviewer: userType === "client" ? "Carlos López (Electricista)" : "Pedro Martínez (Cliente)",
      date: "2024-01-10",
    },
  ]

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={`/dashboard/${userType}`} className="flex items-center text-blue-600 hover:text-blue-800">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver
              </Link>
              <h1 className="text-2xl font-bold text-blue-600">Mi Perfil</h1>
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Información Personal</TabsTrigger>
              <TabsTrigger value="reviews">Reseñas</TabsTrigger>
              <TabsTrigger value="settings">Configuración</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              {/* Profile Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-6">
                    <div className="relative">
                      <img
                        src="/placeholder.svg?height=120&width=120"
                        alt="Foto de perfil"
                        className="w-30 h-30 rounded-full object-cover"
                      />
                      {isEditing && (
                        <Button size="sm" className="absolute bottom-0 right-0 rounded-full">
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div>
                          <h2 className="text-2xl font-bold">{userData.name}</h2>
                          <Badge variant={userType === "client" ? "default" : "secondary"}>
                            {userType === "client" ? "Cliente" : "Proveedor"}
                          </Badge>
                          {userType === "client" && userData.planType === "premium" && (
                            <Badge variant="default" className="ml-2">
                              Premium
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{userData.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Teléfono</p>
                          <p className="font-medium">{userData.phone}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-600">Dirección</p>
                          <p className="font-medium">{userData.address}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center mb-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                        <span className="text-xl font-bold">{averageRating.toFixed(1)}</span>
                      </div>
                      <p className="text-sm text-gray-600">{reviews.length} reseñas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Edit Form */}
              {isEditing && (
                <Card>
                  <CardHeader>
                    <CardTitle>Editar Información</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nombre completo</Label>
                        <Input
                          id="name"
                          value={editData.name}
                          onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          value={editData.phone}
                          onChange={(e) => setEditData((prev) => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Dirección</Label>
                      <Textarea
                        id="address"
                        value={editData.address}
                        onChange={(e) => setEditData((prev) => ({ ...prev, address: e.target.value }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Services (for providers) */}
              {userType === "provider" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Servicios que Ofrezco</CardTitle>
                    <CardDescription>Los servicios que tienes registrados en tu perfil</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {userData.services?.map((service: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Plan Info (for clients) */}
              {userType === "client" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Plan Actual</CardTitle>
                    <CardDescription>Información sobre tu plan y beneficios</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">
                            Plan {userData.planType === "premium" ? "Premium" : "Gratuito"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {userData.planType === "premium"
                              ? "Acceso completo a todas las funciones"
                              : "Acceso limitado a funciones básicas"}
                          </p>
                        </div>
                        {userData.planType === "free" && <Button>Actualizar a Premium</Button>}
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Cotizaciones diarias</p>
                          <p className="font-medium">{userData.planType === "premium" ? "Ilimitadas" : "3 por día"}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Comisión por servicio</p>
                          <p className="font-medium">{userData.planType === "premium" ? "2.5%" : "5%"}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Historial de calificaciones</p>
                          <p className="font-medium">
                            {userData.planType === "premium" ? "Completo" : "No disponible"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reseñas y Calificaciones</CardTitle>
                  <CardDescription>
                    Lo que otros usuarios dicen sobre {userType === "client" ? "ti como cliente" : "tus servicios"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
                        <div className="flex items-center justify-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-600">{reviews.length} reseñas</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="font-medium">{review.reviewer}</span>
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de la Cuenta</CardTitle>
                  <CardDescription>Gestiona tu cuenta y preferencias</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Notificaciones</h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Nuevas solicitudes de servicio</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Mensajes de chat</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-sm">Promociones y ofertas</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Privacidad</h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Mostrar mi perfil en búsquedas</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Permitir contacto directo</span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2 text-red-600">Zona de Peligro</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                          Cambiar Contraseña
                        </Button>
                        <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                          Desactivar Cuenta
                        </Button>
                        <Button variant="destructive">Eliminar Cuenta</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
