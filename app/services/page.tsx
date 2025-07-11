"use client"


import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, MapPin, MessageCircle, ArrowLeft, Filter } from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  const [userData, setUserData] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")

  const categories = [
    "Gasfitería",
    "Electricidad",
    "Cocina",
    "Limpieza",
    "Cuidado de niños",
    "Cuidado de adultos mayores",
    "Jardinería",
    "Pintura",
    "Carpintería",
    "Plomería",
  ]

  const providers = [
    {
      id: 1,
      name: "Juan Pérez",
      category: "Gasfitería",
      rating: 4.8,
      reviews: 127,
      location: "San Isidro",
      price: "50-80",
      image: "/placeholder.svg?height=80&width=80",
      verified: true,
      description: "Especialista en reparaciones de tuberías y grifería con 10 años de experiencia.",
      services: ["Reparación de tuberías", "Instalación de grifería", "Destape de desagües"],
    },
    {
      id: 2,
      name: "María García",
      category: "Limpieza",
      rating: 4.9,
      reviews: 89,
      location: "Miraflores",
      price: "30-50",
      image: "/placeholder.svg?height=80&width=80",
      verified: true,
      description: "Servicio de limpieza profesional para hogares y oficinas.",
      services: ["Limpieza general", "Limpieza profunda", "Limpieza post-construcción"],
    },
    {
      id: 3,
      name: "Carlos López",
      category: "Electricidad",
      rating: 4.7,
      reviews: 156,
      location: "San Borja",
      price: "60-100",
      image: "/placeholder.svg?height=80&width=80",
      verified: true,
      description: "Electricista certificado con experiencia en instalaciones residenciales.",
      services: ["Instalación eléctrica", "Reparación de tableros", "Instalación de luminarias"],
    },
    {
      id: 4,
      name: "Ana Rodríguez",
      category: "Cuidado de niños",
      rating: 5.0,
      reviews: 45,
      location: "La Molina",
      price: "25-40",
      image: "/placeholder.svg?height=80&width=80",
      verified: true,
      description: "Niñera profesional con certificación en primeros auxilios.",
      services: ["Cuidado diurno", "Cuidado nocturno", "Apoyo escolar"],
    },
    {
      id: 5,
      name: "Roberto Silva",
      category: "Jardinería",
      rating: 4.6,
      reviews: 78,
      location: "Surco",
      price: "40-70",
      image: "/placeholder.svg?height=80&width=80",
      verified: true,
      description: "Jardinero especializado en diseño y mantenimiento de jardines.",
      services: ["Mantenimiento de jardines", "Diseño paisajístico", "Poda de árboles"],
    },
    {
      id: 6,
      name: "Carmen Flores",
      category: "Cocina",
      rating: 4.8,
      reviews: 92,
      location: "Barranco",
      price: "80-120",
      image: "/placeholder.svg?height=80&width=80",
      verified: true,
      description: "Chef profesional especializada en cocina peruana e internacional.",
      services: ["Cocina para eventos", "Clases de cocina", "Meal prep"],
    },
  ]

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || provider.category === selectedCategory
    const matchesLocation = selectedLocation === "all" || provider.location === selectedLocation

    return matchesSearch && matchesCategory && matchesLocation
  })

  useEffect(() => {
    const storedData = localStorage.getItem("userData")
    if (storedData) {
      setUserData(JSON.parse(storedData))
    }
  }, [])

  if (!userData) return <div>Cargando...</div>

  const isPremium = userData.tipo_plan
  const returnLink = `/dashboard/client/${isPremium ? "premium" : "free"}`

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={returnLink}  className="flex items-center text-blue-600 hover:text-blue-800">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver
              </Link>
              <h1 className="text-2xl font-bold text-blue-600">Buscar Servicios</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <Card className="mb-8">
          
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Buscar Proveedores
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              
              <div className="md:col-span-2">
                <Input
                  placeholder="Buscar por nombre, servicio o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>


              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Ubicación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las ubicaciones</SelectItem>
                  <SelectItem value="San Isidro">San Isidro</SelectItem>
                  <SelectItem value="Miraflores">Miraflores</SelectItem>
                  <SelectItem value="San Borja">San Borja</SelectItem>
                  <SelectItem value="La Molina">La Molina</SelectItem>
                  <SelectItem value="Surco">Surco</SelectItem>
                  <SelectItem value="Barranco">Barranco</SelectItem>
                </SelectContent>
              </Select>

              
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{filteredProviders.length} proveedores encontrados</h2>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros avanzados
          </Button>
        </div>

        {/* Provider Cards */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredProviders.map((provider) => (
            <Card key={provider.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={provider.image || "/placeholder.svg"}
                    alt={provider.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg flex items-center">
                          {provider.name}
                          {provider.verified && (
                            <Badge variant="default" className="ml-2 text-xs">
                              Verificado
                            </Badge>
                          )}
                        </h3>
                        <Badge variant="outline" className="mt-1">
                          {provider.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center mb-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="font-medium">{provider.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">({provider.reviews})</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {provider.location}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{provider.description}</p>

                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">Servicios:</p>
                      <div className="flex flex-wrap gap-1">
                        {provider.services.map((service, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-600">Desde </span>
                        <span className="font-semibold">S/{provider.price}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/chat?provider=${provider.id}`}>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Chat
                          </Button>
                        </Link>
                        <Button size="sm">Ver perfil</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron proveedores</h3>
              <p className="text-gray-600 mb-4">Intenta ajustar tus filtros de búsqueda</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                  setSelectedLocation("all")
                }}
              >
                Limpiar filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
