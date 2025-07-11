"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Users, Wrench, Upload, ArrowLeft } from "lucide-react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"  //icono de ver el password
import Link from "next/link"
import { Area } from "recharts"
import { Textarea } from "@/components/ui/textarea"

export const distritosLima = [
  "Ate", "Barranco", "Breña", "Carabayllo", "Chaclacayo", "Chorrillos",
  "Cieneguilla", "Comas", "El Agustino", "Independencia", "Jesús María",
  "La Molina", "La Victoria", "Lima", "Lince", "Los Olivos", "Lurigancho",
  "Lurín", "Magdalena del Mar", "Miraflores", "Pachacamac", "Pucusana",
  "Pueblo Libre", "Puente Piedra", "Punta Hermosa", "Punta Negra",
  "Rímac", "San Bartolo", "San Borja", "San Isidro", "San Juan de Lurigancho",
  "San Juan de Miraflores", "San Luis", "San Martín de Porres",
  "San Miguel", "Santa Anita", "Santa María del Mar", "Santa Rosa",
  "Santiago de Surco", "Surquillo", "Villa El Salvador", "Villa María del Triunfo"
];

export default function AuthPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const userType = searchParams.get("type") as "client" | "provider"
  const mode = searchParams.get("mode") || "login"
  const [showPassword, setShowPassword] = useState(false) //icono de ver el password

  const [formData, setFormData] = useState({
    usuario: userType,
    nombre: "",
    genero:"", 
    doi: "",
    edad:"",
    celular: "",
    direccion: "",
    distrito: "",
    referencia: "",
    correo: "",
    contraseña: "",
    confirmarContraseña: "",
    tipo_plan: "free" as "free" | "premium",
    servicios: new Array(10).fill(false), //[] as boolean[],
  })

  const [emailError, setEmailError] = useState("")
  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|outlook)\.com$/;
  const isValidEmail = (email: string) => { return emailRegex.test(email);}

  const lista_serv = [
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

  const handleServiceToggle = (servicios: boolean[]) => {
    const serviciosObj: { [key: string]: boolean } = {};
    lista_serv.forEach((field, index) => {
      serviciosObj[field] = servicios[index] || false;
    });
    return serviciosObj;
  }

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidEmail(formData.correo)) {
      setEmailError("Solo se permiten correos @gmail.com o @outlook.com");
      return;
    }
    setEmailError("")

    if (mode === "register") {
        if (formData.contraseña !== formData.confirmarContraseña) {
          alert("Las contraseñas no coinciden");
          return; // evita que continúe si hay error
        }

        try {
          setLoading(true);

          const response = await fetch("/api/registro", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData)
            });

          const data = await response.json();

          if (!response.ok) {
            console.error("Error del servidor:", data);
            throw new Error(data.error || "Error al registrar usuario");
          }

          localStorage.setItem("userType", userType);
          localStorage.setItem("userEmail", formData.correo);

          alert("Registro exitoso!");
          router.push(`/`);
        } 
      
        catch (error) 
        { console.error("Error al enviar datos:", error);  // Aquí podrías mostrar un mensaje de error al usuario
        }

        finally {
        setLoading(false);
        }    
    }

    else if (mode === "login") {

        try {
          const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              correo: formData.correo,
              contraseña: formData.contraseña,
              usuario: formData.usuario,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            alert(data.error || "Credenciales incorrectas");
            return;
          }

          if(userType === "client") {
            // Guardar datos en localStorage (opcional)
            localStorage.setItem("userData", JSON.stringify(data.usuario));
            localStorage.setItem("userType", "client");

            // Redirigir al dashboard o perfil
            router.push(`/dashboard/client/${data.usuario.tipo_plan ? "premium" : "free"}`);
          }

          else if (userType === "provider"){
            // Guardar datos en localStorage (opcional)
            localStorage.setItem("userData", JSON.stringify(data.usuario));
            localStorage.setItem("userType", "provider");

            // Redirigir al dashboard o perfil
            router.push(`/dashboard/provider`);
          }

        } 
        
        catch (error) {
          console.error("Error al iniciar sesión:", error);
          alert("Error al iniciar sesión");
        }


    }

  }

  if (!userType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card>
          <CardContent className="p-6">
            <p className="text-center">Tipo de usuario no especificado</p>
            <Link href="/">
              <Button className="w-full mt-4">Volver al inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-2">
      <div className="container mx-auto px-2">
        <div className="w-full max-w-7xl mx-auto px-1 py-1">

          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>

          <Card>
            <CardHeader className="text-center mb-1 p-2">
              <div className="flex items-center justify-center">
                {userType === "client" ? (
                  <Users className="h-12 w-12 text-blue-800" />
                ) : (
                  <Wrench className="h-12 w-12 text-green-800" />
                )}
              </div>
              <CardTitle>{mode === "login" ? "Iniciar Sesión" : "Registrate"} </CardTitle>
              <CardDescription>{userType === "client" ? "Como Cliente" : "Como Proveedor"}</CardDescription>
            </CardHeader>


            <CardContent className="p-1">
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                {mode === "register" && (
                  <>

                    {/*Campo: Nombre Completo*/}
                    <div className="flex flex-col items-center justify-center">
                      <Label htmlFor="nombre" className="text-center mb-2">Nombre completo</Label>
                      <Input
                        id="nombre"
                        className="border border-gray-400"
                        value={formData.nombre}
                        onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
                        required
                      />
                    </div>

                    {/*Campo: Genero*/}
                    <div className="flex flex-col items-center justify-center">
                      <Label htmlFor="genero" className="text-center mb-2">Genero</Label>
                      <select
                        id="genero" 
                        className="w-40 border border-gray-400 rounded px-2 py-1"
                        value={formData.genero}
                        onChange={(e) => setFormData((prev) => ({ ...prev, genero: e.target.value }))}
                        required
                      >
                        <option value="">Seleccione</option>
                        <option value="Hombre">Hombre</option>
                        <option value="Mujer">Mujer</option>
                      </select>
                    </div>

                    {/*Campo: DNI*/}
                    <div className="flex flex-col items-center justify-center">
                      <Label htmlFor="doi" className="text-center mb-2">DNI</Label>
                      <Input
                        id="doi"
                        className="w-50 border border-gray-400"
                        value={formData.doi}
                        //onChange={(e) => setFormData((prev) => ({ ...prev, doi: e.target.value }))}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 8);
                                        setFormData((prev) => ({ ...prev, doi: onlyDigits }));
                                    }}
                        required
                      />
                    </div>
                    
                    {/*Campo: Edad*/}
                    <div className="flex flex-col items-center justify-center">
                      <Label htmlFor="edad" className="text-center mb-2">Edad</Label>
                      <Input
                        id="edad"
                        className="w-20 border border-gray-400"
                        value={formData.edad}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 2);
                                        setFormData((prev) => ({ ...prev, edad: onlyDigits }));
                                    }}
                        required
                      />
                    </div>

                    <div></div><div></div><div></div><div></div>

                    {/*Campo: Celular*/}
                    <div className="flex flex-col items-center justify-center">
                      <Label htmlFor="celular" className="text-center mb-2">Celular</Label>
                      <Input
                        id="celular"
                        className="w-50 border border-gray-400"
                        value={formData.celular}
                        //onChange={(e) => setFormData((prev) => ({ ...prev, celular: e.target.value }))}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 9);
                                        setFormData((prev) => ({ ...prev, celular: onlyDigits }));
                                    }}
                        required
                      />
                    </div>

                    {/*Campo: Dirección*/}
                    <div className="flex flex-col items-center justify-center ">
                      <Label htmlFor="direccion" className="text-center mb-2">Dirección</Label>
                      <Input
                        id="direccion"
                        className="border border-gray-400" //className="w-60 border border-gray-400 rounded px-2 py-1 resize-y" //className="border border-gray-400"
                        value={formData.direccion}
                        onChange={(e) => setFormData((prev) => ({ ...prev, direccion: e.target.value }))}
                        required
                      />
                    </div>

                    {/*Campo: Distrito*/}
                    <div className="flex flex-col items-center justify-center">
                      <Label htmlFor="distrito" className="text-center mb-2">Distrito</Label>
                      <select
                        id="distrito"
                        className="w-64 border border-gray-400 rounded px-2 py-1"
                        value={formData.distrito}
                        onChange={(e) => setFormData((prev) => ({ ...prev, distrito: e.target.value }))}
                        required
                      >
                          <option value="">Seleccione</option>
                          {distritosLima.map((distrito) => (<option key={distrito} value={distrito}>{distrito} </option>))}
                      </select>
                    </div>

                    {/*Campo: Referencia*/}
                    <div className="flex flex-col items-center justify-center ">
                      <Label htmlFor="referencia" className="text-center mb-2">Referencia</Label>
                      <Input
                        id="referencia"
                        className="border border-gray-400" //className="w-60 border border-gray-400 rounded px-2 py-1 resize-y" //className="border border-gray-400"
                        value={formData.referencia}
                        onChange={(e) => setFormData((prev) => ({ ...prev, referencia: e.target.value }))}
                        required
                      />
                    </div>

                  </>
                )}

                <div></div><div></div><div></div><div></div>

                {/*Campo: Correo*/}
                <div className="flex flex-col items-center justify-center">
                  <Label htmlFor="correo" className="text-center mb-2">Correo</Label>
                  <Input
                    id="correo"
                    type="email"
                    className="w-64 border border-gray-400"
                    value={formData.correo}
                    onChange={(e) => { setFormData((prev) => ({ ...prev, correo: e.target.value }))
                                       setEmailError("") }}
                    required
                  />
                  {emailError && (
                    <div className="text-red-500 text-sm mt-1">{emailError}</div>
                  )}

                </div>

                
                {/*Campo: Contraseña*/}
                <div className="flex flex-col items-center justify-center">

                  <Label htmlFor="contraseña" className="text-center mb-2">Contraseña</Label>
                  <div className="relative w-60">
                    <Input
                      id="contraseña"
                      type={showPassword ? "text" : "password"}
                      className="w-60 border border-gray-400"
                      value={formData.contraseña}
                      onChange={(e) => setFormData((prev) => ({ ...prev, contraseña: e.target.value }))}
                      required
                    />
                    
                    <div className="absolute inset-y-0 right-2 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
                    </div>
                  </div>

                </div>

                {mode === "register" && (
                  <>
                    {/*Campo: Confirmar Contraseña*/}
                    <div className="flex flex-col items-center justify-center">
                      
                      <Label htmlFor="confirmarContraseña" className="text-center mb-2">Confirmar contraseña</Label>
                      <div className="relative w-60">
                        <Input
                          id="confirmarContraseña"
                          type={showPassword ? "text" : "password"}
                          className="w-60 border border-gray-400"
                          value={formData.confirmarContraseña}
                          onChange={(e) => setFormData((prev) => ({ ...prev, confirmarContraseña: e.target.value }))}
                          required
                        />

                        <div className="absolute inset-y-0 right-2 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
                        </div>

                      </div>
                    </div>

                    {userType === "client" && (
                      
                      //Campo: Tipo de Cuenta
                      <div className="space-y-2">
                        
                        <div className="flex flex-col"><Label>Tipo de cuenta</Label></div>
                        
                        <div className="space-y-3">                          
                          <div className="flex items-center space-x-2">                            
                            <Checkbox
                              id="free"
                              checked={formData.tipo_plan === "free"}
                              onCheckedChange={() => setFormData((prev) => ({ ...prev, tipo_plan: "free" }))}
                            />
                            <Label htmlFor="free" className="text-sm">
                              <div>
                                <div className="font-medium text-gray-900 text-sm">Gratuito</div>
                                <div className="text-gray-600 text-xs">
                                  Acceso completo, cotizaciones ilimitadas y comisión 5% - Por 12 meses (1 año)
                                </div>
                                <div className="text-gray-1200 text-xs">
                                  Luego, sin acceso a historial de calificaciones, máximo 3 cotizaciones/día y comisión 5%
                                </div>
                              </div>
                            </Label>
                          </div>                          
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                              <Checkbox
                                id="premium"
                                checked={formData.tipo_plan === "premium"}
                                onCheckedChange={() => setFormData((prev) => ({ ...prev, tipo_plan: "premium" }))}
                              />
                              <Label htmlFor="premium" className="text-sm">
                                <div>
                                  <div className="font-medium text-gray-900 text-sm">Premium (Pago S/10 al mes o S/100 al año)</div>
                                  <div className="text-gray-600 text-xs"> Acceso completo, cotizaciones ilimitadas y comisión 2.5% </div>
                                </div>
                              </Label>
                            </div>
                        </div>

                        <div></div><div></div><div></div><div></div>

                      </div>

                    )}

                    {userType === "client" && (<div></div>
                    )}      


                    {userType === "provider" && (
                      <>
                        {/*Campo: Lista de Servicios*/}                       
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {lista_serv.map((servicio, index) => (
                              
                              <div key={servicio} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`servicio-${index}`}
                                  checked={formData.servicios[index]}
                                  onCheckedChange={(checked) => {
                                    const updatedServicios = [...formData.servicios];
                                    updatedServicios[index] = !!checked;
                                    setFormData({ ...formData, servicios: updatedServicios });
                                  }}
                                />
                                
                                <Label htmlFor={`servicio-${index}`} className="text-sm">
                                  {servicio}
                                </Label>

                              </div>
                            ))}
                        </div>

                        {/*Campo: Lista de Documentos*/} 
                        <div className="space-y-2">
                          <Label>Documentos requeridos</Label>
                          <div className="space-y-2">
                            <Button type="button" variant="outline" className="w-full justify-start">
                              <Upload className="h-4 w-4 mr-2" />
                              Subir DNI
                            </Button>
                            <Button type="button" variant="outline" className="w-full justify-start">
                              <Upload className="h-4 w-4 mr-2" />
                              Antecedentes penales
                            </Button>
                            <Button type="button" variant="outline" className="w-full justify-start">
                              <Upload className="h-4 w-4 mr-2" />
                              Antecedentes policiales
                            </Button>
                          </div>
                        </div>


                      </>
                    )}
                  </>
                )}
                

                {/*Botones de Iniciar Sesion o Registrarse*/}
                <div className="flex justify-center">
                  <Button type="submit" className="w-40 px-4 py-2 rounded self-center">
                        {mode === "login" ? "Iniciar Sesión" : "Registrarse"}
                  </Button>
                </div>
                
                <div className="grid place-items-center h-full">
                  {mode === "login" ? (
                    <p className="text-sm text-gray-600 text-center">
                      ¿No tienes cuenta?{" "}
                      <Link href={`/auth?type=${userType}&mode=register`} className="text-blue-600 hover:underline">
                        Regístrate
                      </Link>
                    </p>
                    ) : (
                    <p className="text-sm text-gray-600 text-center">
                      ¿Ya tienes cuenta?{" "}
                      <Link href={`/auth?type=${userType}`} className="text-blue-600 hover:underline">
                        Inicia sesión
                      </Link>
                    </p>
                  )}
                
                  <div className="text-center">
                    <Link href="#" className="text-sm text-blue-600 hover:underline">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>

                </div>

                <div></div><div></div><div></div><div></div>
                <div></div><div></div><div></div><div></div>
                
              </form>

            </CardContent>

          </Card>
        </div>
      </div>
    </div>
  )
}
