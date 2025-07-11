"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Plus, Clock, CheckCircle, Star, MessageCircle, User, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { supabase } from "@/utils/supabaseClient"
import {Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"

export default function ClientDashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const categories = [
    "Gasfiteria",
    "Electricidad",
    "Cocina",
    "Limpieza",
    "Cuidado de Niños",
    "Cuidado de Adultos Mayores",
    "Jardineria",
    "Pintura",
    "Carpinteria",
    "Plomeria",
  ]

  const lista_serv = [
    "gasfiteria",
    "electricidad",
    "cocina",
    "limpieza",
    "cuidado_niños",
    "cuidado_adultos",
    "jardineria",
    "pintura",
    "carpinteria",
    "plomeria",
  ]

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTipoServicio, setSelectedTipoServicio] = useState<number | null>(null);
  const [proveedores, setProveedores] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const [activeRequests] = useState([
    {
      id: 1,
      service: "Gasfitería",
      description: "Reparación de tubería en cocina",
      status: "pending",
      quotes: 3,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      service: "Electricidad",
      description: "Instalación de tomacorrientes",
      status: "in_progress",
      provider: "Juan Pérez",
      amount: 150,
      createdAt: "2024-01-10",
    },
  ])

  const [serviceHistory] = useState([
    {
      id: 3,
      service: "Limpieza",
      provider: "María García",
      amount: 80,
      rating: 5,
      completedAt: "2024-01-05",
    },
    {
      id: 4,
      service: "Jardinería",
      provider: "Carlos López",
      amount: 120,
      rating: 4,
      completedAt: "2023-12-28",
    },
  ])

  const [servicios, setServicios] = useState<any[]>([])  
  useEffect(() => {
    const fetchServicios = async () => {

      if (!userData?.id_cliente) return;

      try {
        const res = await fetch(`/api/servicios?id_cliente=${userData.id_cliente}`);

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Error del servidor:", errorText);
          throw new Error("Error al obtener servicios");
        }

        const data = await res.json();
        console.log("DATA:", data);
        setServicios(data);
      } 
      
      catch (error) {
        console.error("❌ Error al cargar servicios:", error);
      }
    };

    fetchServicios();
  }, [userData]);

  const handleLogout = () => {
    localStorage.removeItem("userData")
    localStorage.removeItem("userType")
    router.push("/")
  }

  const buscarProveedores = async (tipoServicioIndex: number) => {
    try {
      const nombreServicio = lista_serv[tipoServicioIndex];
      const res = await fetch(`/api/proveedores?servicio=${nombreServicio}`);
      if (!res.ok) throw new Error("Error al obtener proveedores");

      const data = await res.json();
      setProveedores(data);
    } 
    catch (error) {
      console.error("❌ Error buscando proveedores:", error);
      setProveedores([]);
    }
  };

  if (!userData) {
    return <div>Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-600">FIXTER</h1>
              <Badge variant="secondary">{userData.tipo_plan? "Premium" : "Gratuito"}</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Hola, {userData.nombre}</span>
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/*Principal*/}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="grid md:grid-cols-2 gap-4">
              
              {/*Busca Servicios*/}
              <Link href="/services">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <Search className="h-5 w-5 mr-2 text-blue-600" />
                      Buscar Servicios
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Encuentra proveedores por categoría de servicio</p>
                  </CardContent>
                </Card>
              </Link>

              {/*Nueva Solicitud*/}
              <Link href="/requests/new">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <Plus className="h-5 w-5 mr-2 text-green-600" />
                      Nueva Solicitud
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Crea una solicitud para recibir cotizaciones</p>
                  </CardContent>
                </Card>
              </Link>
              
            </div>

            {/*Solicitudes Activas*/}
            <Card>              
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Solicitudes Activas
                </CardTitle>
                <CardDescription>Servicios en proceso y pendientes de cotización</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">

                  { servicios.map((servicio) => (
                    <div key={servicio.id_serv_domest} className="border rounded-lg p-4 shadow-sm">
                      
                      <div className="flex items-start justify-between">
                        
                        {/*Información del Servicio*/}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline" className="border-purple-500 text-purple-700 bg-purple-50">{categories[(servicio.tipo_servicio)-1]}</Badge>
                            <Badge className={
                              servicio.estado === "Pendiente" ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
                              servicio.estado === "Programado" ? "bg-black-100 text-black-800 border-black-300" :
                              servicio.estado === "En proceso" ? "bg-blue-100 text-blue-800 border-blue-300" :
                              servicio.estado === "Finalizado" ? "bg-green-100 text-green-800 border-green-300" :
                              "bg-gray-100 text-gray-800 border-gray-300"
                            }>
                              {servicio.estado}
                            </Badge>
                          </div>

                          <h3 className="text-lg font-semibold mb-1">{servicio.titulo}</h3>
                          <p className="text-sm text-gray-600 mb-2">{servicio.descripcion}</p>

                          <div className="text-sm text-gray-700 space-y-1">
                            <p><strong>Dirección:</strong> {servicio.direccion}, {servicio.distrito}</p>
                            <p><strong>Presupuesto:</strong> S/ {servicio.presupuesto}</p>
                            <p><strong>Urgencia:</strong> {servicio.urgencia}</p>
                            <p><strong>Fecha límite:</strong> {new Date(servicio.fecha).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">                          
                          <Dialog>

                            {/*Lista de Proveedores*/}
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50"
                                onClick={() => {
                                  setSelectedTipoServicio(servicio.tipo_servicio - 1); // Guardamos el tipo de servicio seleccionado
                                  buscarProveedores(servicio.tipo_servicio - 1);        // Llamamos a la API
                                }}
                              >
                                Proveedores
                              </Button>
                            </DialogTrigger>

                            <DialogContent className="max-w-md">
                              
                              <DialogHeader>
                                <DialogTitle>
                                  Proveedores disponibles
                                  {selectedTipoServicio !== null && (
                                    <span className="ml-2 text-sm text-gray-500"> ({categories[selectedTipoServicio]})
                                    </span>
                                  )}
                                </DialogTitle>
                              </DialogHeader>

                              <div className="mt-4 space-y-3">
                                {proveedores.length === 0 ? (
                                  <p className="text-gray-500 text-sm">No hay proveedores disponibles.</p>
                                )
                                :                                
                                (proveedores.map((proveedor) => (
                                    <div
                                      key={proveedor.id_proveedor}
                                      className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-100"
                                    >
                                      <div>
                                        <p className="font-medium">{proveedor.nombre}</p>
                                        <p className="text-sm text-gray-500">{proveedor.edad}</p>
                                        <p className="text-sm text-gray-500">{proveedor.distrito}</p>
                                      </div>
                                      <Button size="sm" variant="secondary" onClick={() => alert(`Iniciar chat con ${proveedor.nombre}`)} >
                                        Chatear
                                      </Button>
                                    </div>
                                  ))
                                )}

                              </div>

                            </DialogContent>

                          </Dialog>

                          {/* <Button size="sm" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50"> Chat </Button> */}
                          <Button size="sm" variant="outline" className="border-gray-500 text-gray-600 hover:bg-gray-50"> Detalles </Button>
                        </div>
                        
                      </div>

                    </div>
                  ))}

                </div>

              </CardContent>
              
            </Card>

            {/* Service History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Historial de Servicios
                </CardTitle>
                <CardDescription>Servicios completados recientemente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceHistory.map((service) => (
                    <div key={service.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline">{service.service}</Badge>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < service.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Proveedor:</strong> {service.provider}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Monto:</strong> S/{service.amount}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{service.completedAt}</p>
                          <Button size="sm" variant="outline" className="mt-2">
                            Ver detalles
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Servicios activos</span>
                  <span className="font-medium">{activeRequests.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Servicios completados</span>
                  <span className="font-medium">{serviceHistory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Calificación promedio</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">4.8</span>
                  </div>
                </div>
                {userData.planType === "free" && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600 mb-2">Cotizaciones hoy: 1/3</p>
                    <Button size="sm" className="w-full">
                      Actualizar a Premium
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Search */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Búsqueda Rápida</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Input placeholder="Buscar servicios..." />
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      Gasfitería
                    </Button>
                    <Button variant="outline" size="sm">
                      Electricidad
                    </Button>
                    <Button variant="outline" size="sm">
                      Limpieza
                    </Button>
                    <Button variant="outline" size="sm">
                      Cocina
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}
