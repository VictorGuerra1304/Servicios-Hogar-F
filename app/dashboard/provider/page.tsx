"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, Clock, Star, MessageCircle, User, LogOut, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ProviderDashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const [activeJobs] = useState([
    {
      id: 1,
      service: "Gasfitería",
      client: "Ana Rodríguez",
      description: "Reparación de tubería en cocina",
      amount: 180,
      status: "En proceso",
      scheduledDate: "2024-01-20",
    },
    {
      id: 2,
      service: "Electricidad",
      client: "Pedro Martínez",
      description: "Instalación de tomacorrientes",
      amount: 150,
      status: "Programado",
      scheduledDate: "2024-01-22",
    },
  ])

  const [completedJobs] = useState([
    {
      id: 3,
      service: "Limpieza",
      client: "María García",
      amount: 80,
      rating: 5,
      completedAt: "2024-01-15",
    },
    {
      id: 4,
      service: "Jardinería",
      client: "Carlos López",
      amount: 120,
      rating: 4,
      completedAt: "2024-01-10",
    },
  ])

  const [servicios, setServicios] = useState<any[]>([])

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const res = await fetch("/api/servicios");
        if (!res.ok) throw new Error("Error al obtener servicios");

        const data = await res.json();
        console.log("DATA:", data);
        setServicios(data);
      } 
      
      catch (error) {
        console.error("❌ Error al cargar servicios:", error);
      }
    };

    fetchServicios();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userData")
    localStorage.removeItem("userType")
    router.push("/")
  }

  if (!userData) {
    return <div>Cargando...</div>
  }

  const totalEarnings = completedJobs.reduce((sum, job) => sum + job.amount, 0)
  const averageRating = completedJobs.reduce((sum, job) => sum + job.rating, 0) / completedJobs.length

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-green-600">FIXTER</h1>
              <Badge variant="default">Proveedor</Badge>
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-4">              
              {/*Ingresos*/}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                    Ingresos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">S/{totalEarnings}</p>
                  <p className="text-sm text-gray-600">Este mes</p>
                </CardContent>
              </Card>

              {/*Calificación*/}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <Star className="h-5 w-5 mr-2 text-yellow-600" />
                    Calificación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                  <p className="text-sm text-gray-600">{completedJobs.length} reseñas</p>
                </CardContent>
              </Card>

              {/* Trabajos Activos*/}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Trabajos Activos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{activeJobs.length}</p>
                  <p className="text-sm text-gray-600">En proceso</p>
                </CardContent>
              </Card>
            </div>

            {/*Trabajos en Proceso*/}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Trabajos en Proceso
                </CardTitle>
                <CardDescription>Servicios programados y en ejecución</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {activeJobs.map((job) => (
                    <div key={job.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline">{job.service}</Badge>
                            <Badge variant={job.status === "En proceso" ? "default" : "secondary"}>
                              {job.status === "En proceso" ? "En proceso" : "Programado"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                          <div className="space-y-1">
                            <p className="text-sm">
                              <strong>Cliente:</strong> {job.client}
                            </p>
                            <p className="text-sm">
                              <strong>Monto:</strong> S/{job.amount}
                            </p>
                            <p className="text-sm">
                              <strong>Fecha:</strong> {job.scheduledDate}
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm">Ver detalles</Button>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

            </Card>

            {/*Nuevas Solicitudes*/}
            <Card>
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Search className="h-5 w-5 mr-2" />
                      Nuevas Solicitudes
                    </CardTitle>
                    <CardDescription>Oportunidades de trabajo disponibles</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver todas
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">                  
                  
                  { servicios.map((servicio) => (
                    <div key={servicio.id_serv_domest} className="border rounded-lg p-4 shadow-sm">
                      
                      <div className="flex items-start justify-between">
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline" className="border-purple-500 text-purple-700 bg-purple-50">{servicio.tipo_servicio}</Badge>
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
                          <Button size="sm" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50"> Chat </Button>
                          <Button size="sm" variant="outline" className="border-gray-500 text-gray-600 hover:bg-gray-50"> Ver detalles </Button>
                          <Button size="sm" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50"> Aceptar Propuesta </Button>
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
            {/*Agenda*/}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="h-5 w-5 mr-2" />
                  Agenda
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium">Hoy</div>
                    <div className="text-gray-600">Sin trabajos programados</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Mañana</div>
                    <div className="text-gray-600">1 trabajo programado</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Esta semana</div>
                    <div className="text-gray-600">{activeJobs.length} trabajos</div>
                  </div>
                  <Button size="sm" className="w-full">
                    Ver calendario completo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/*Servicios que Ofrece*/}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mis Servicios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {userData.services?.map((service: string, index: number) => (
                    <Badge key={index} variant="outline" className="mr-2 mb-2">
                      {service}
                    </Badge>
                  ))}
                  <Button size="sm" variant="outline" className="w-full mt-2">
                    Editar servicios
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/*Historial de Pagos*/}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Historial de Pagos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedJobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{job.completedAt}</span>
                      <span className="font-medium">S/{job.amount}</span>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" className="w-full">
                    Ver historial completo
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}
