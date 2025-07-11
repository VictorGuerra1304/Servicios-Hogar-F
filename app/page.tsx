"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Wrench, Star, Shield, CreditCard } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [userType, setUserType] = useState<"client" | "provider" | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-4">
        
        
        {/* Header */}
        <div className="text-center mb-4">
          <img
              src="/Inicio.png"
              className="w-1/3 h-auto object-contain mx-auto"
          />
          <h1 className="text-2xl font-semibold text-gray-700 mt-2">Expertos en servicios para el hogar</h1>
        </div>

        
        {/* User Type Selection */}
        {!userType ? (
          <div className="max-w-4xl mx-auto">
            {/*<h2 className="text-xl font-semibold text-center mb-4">¿Cómo ingresarás a FIXTER?</h2>*/}
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setUserType("client")}>
                <CardHeader className="text-center p-2">
                  <CardTitle className="text-xl">¿Eres Cliente?</CardTitle>                 
                  <CardDescription>Buscas proveedores de servicios para tu hogar</CardDescription>
                  <img src="/Cliente.jpg" className="h-40 w-full object-cover"/> 
                  <CardDescription className="text-blue-500 font-bold underline">Ingresa Aqui</CardDescription>
                </CardHeader>
             {/*<CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Buscar proveedores verificados</li>
                    <li>• Ver calificaciones y comentarios</li>
                    <li>• Chat directo con proveedores</li>
                    <li>• Pago seguro con custodia</li>
                  </ul>
                </CardContent> */}
              </Card>


              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setUserType("provider")}
              >
                <CardHeader className="text-center p-2">
                  <CardTitle className="text-xl">¿Eres Proveedor?</CardTitle>
                  <CardDescription>Ofreces servicios para el hogar</CardDescription>
                  <img src="/Proveedor.png" className="h-40 w-full object-cover"/>
                  <CardDescription className="text-blue-500 font-bold underline">Ingresa Aqui</CardDescription>
                </CardHeader>
              {/*<CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Recibir solicitudes de trabajo</li>
                    <li>• Gestionar agenda y pagos</li>
                    <li>• Construir reputación</li>
                    <li>• Acceso a más clientes</li>
                  </ul>
                </CardContent>*/}
              </Card>


            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-4">
                  {userType === "client" ? (
                    <Users className="h-12 w-12 text-blue-600" />
                  ) : (
                    <Wrench className="h-12 w-12 text-green-600" />
                  )}
                </div>
                <CardTitle>{userType === "client" ? "Acceso para Clientes" : "Acceso para Proveedores"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href={`/auth?type=${userType}`}>
                  <Button className="w-full" size="lg">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href={`/auth?type=${userType}&mode=register`}>
                  <Button variant="outline" className="w-full" size="lg">
                    Registrate
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full" onClick={() => setUserType(null)}>
                  Volver
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
        

        {/* Features */}
        <h2 className="text-xl font-semibold text-center p-4 mb-4"> Algunos servicios que ofrece FIXTER</h2>
        <div className="grid md:grid-cols-4 gap-2 mb-4">
          <Card>
            <CardHeader className="text-center p-2">
              <CardTitle className="text-xl">Expertos en Albañileria</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src="/Albañil.jpg"
                className="h-40 w-full object-cover"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center p-2">
              <CardTitle className="text-xl">Cuidadores de Mascotas</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src="/Mascotas.png"
                className="h-40 w-full object-cover"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center p-2">
              <CardTitle className="text-xl">Expertos en Pintura</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src="/Pintor.png"
                className="h-40 w-full object-cover"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center p-2">
              <CardTitle className="text-xl">Electricistas Profesionales</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src="/Electricista.jpg"
                className="h-40 w-full object-cover"
              />
            </CardContent>
          </Card>

        </div>



      </div>
    </div>
  )
}
