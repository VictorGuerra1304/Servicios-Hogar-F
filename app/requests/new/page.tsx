"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from '@/utils/supabaseClient'
import { createClient } from '@supabase/supabase-js';

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

export const dynamic = 'force-dynamic';

export default function NewRequestPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
 
  const categories = [
    "Gasfitería",
    "Electricidad",
    "Cocina",
    "Limpieza",
    "Cuidado de Niños",
    "Cuidado de Adultos Mayores",
    "Jardinería",
    "Pintura",
    "Carpintería",
    "Plomería",
  ]

  const [file, setFile] = useState<File | null>(null)
  const [titulo, setTitulo] = useState("")

  const [formData, setFormData] = useState<{
    titulo: string;
    tipo_servicio: string;
    descripcion: string;
    direccion: string;
    distrito: string;
    presupuesto: string;
    urgencia: string;
    fecha: string;
    id_cliente: any;
    imagen: string[];
    }>({
    titulo: "",
    tipo_servicio: "",
    descripcion: "",
    direccion: "",
    distrito: "",
    presupuesto: "",
    urgencia: "",
    fecha: "",
    id_cliente: null,
    imagen: [],
  });

  const uploadImage = async (file: File) => {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.storage
      .from("imagenes-servicios")
      .upload(`servicios/${file.name}`, file)

    if (error) {
      console.error("Error al subir imagen:", error)
      return null
    }

    const url = supabase.storage
      .from("imagenes-servicios")
      .getPublicUrl(`servicios/${file.name}`).data.publicUrl

    return url
  }

  function dataURLtoFile(dataurl: string, filename = "file.jpg") {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.imagen.length === 0) {
      alert("Debes subir al menos una imagen.");
      return;
    }

    // 1. Subir imágenes base64 a Supabase
    const uploadedUrls: string[] = [];

    for (let i = 0; i < formData.imagen.length; i++) {
      const base64 = formData.imagen[i];
      const file = dataURLtoFile(base64, `imagen_${Date.now()}_${i}.jpg`);
      const url = await uploadImage(file);
      if (url) {
        uploadedUrls.push(url);
      } 
      else {
        alert(`Error al subir la imagen ${i + 1}`);
        return;
      }
    }

    console.log("📦 uploadedUrls:", uploadedUrls);
    // 2. Enviar todo al backend
    try {
      const response = await fetch("/api/solicitud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData, // si usas formData
          imagen: uploadedUrls,
          id_cliente: userData?.id_cliente,
        }),
      });

      const result = await response.json();
      console.log("✅ Resultado del backend:", result);

      if (!response.ok) {
        console.error("❌ Error desde backend:", result.error);
        const { error } = await response.json();
        throw new Error(error || "Error desconocido");
      }

      console.log("✅ Solicitud registrada:", result.message);
      alert("Servicio registrado correctamente");
      //router.push("/dashboard/client"); //que identifique al registrar si es premium o free

      if (userData?.tipo_plan==false) {
        router.push("/dashboard/client/free");
      }
      else {
        router.push("/dashboard/client/premium");
      }


    } 
    catch (error) {
      console.error("Error al registrar:", error);
      alert("Hubo un error al registrar el servicio");
    }
    
  } 

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImageUpload = () => {
    // Verificar si ya hay 3 imágenes
    if (formData.imagen.length >= 3) {
      alert("Solo se pueden subir hasta 3 imágenes.");
      return;
    }
    
    fileInputRef.current?.click();
  }

  const [imagenesUrls, setImagenesUrls] = useState<string[]>([]);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //const supabase = getSupabaseClient()
    const files = e.target.files;
    if (!files) return;

    const currentImages = formData.imagen.length;
    const maxAllowed = 3 - currentImages;
    const selectedFiles = Array.from(files).slice(0, maxAllowed); // Tomar solo las necesarias
    const urls: string[] = [];

    for (const file of selectedFiles) {
      // Leer para mostrar vista previa (opcional)
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFormData((prev) => ({
            ...prev,
            imagen: [...prev.imagen, reader.result as string],
          }));
        }
      };
      
      reader.readAsDataURL(file);
    }  
    
    /*
      try {
        const { data, error } = await supabase.storage
          .from("imagenes-servicios")
          .upload(`public/${Date.now()}_${file.name}`, file);

        if (error) {
          console.error("❌ Error al subir imagen:", error.message);
          continue;
        }

        const { publicUrl } = supabase
          .storage
          .from("imagenes")
          .getPublicUrl(data.path).data;

        urls.push(publicUrl);
      }

      catch (err) {
        console.error("❌ Error inesperado al subir imagen:", err);
      }
    }

      // Actualiza las URLs reales en el estado global
      setImagenesUrls((prev) => [...prev, ...urls]); */

      // Limpia el valor del input para permitir volver a seleccionar las mismas imágenes
      e.target.value = "";

  }; 

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-2">
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          
          <div className="flex items-center space-x-4">
            <Link href={returnLink} className="flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver
            </Link>
            <h1 className="text-2xl font-bold text-blue-600">Nueva Solicitud</h1>
          </div>

          <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{userData.nombre}</span>
          </div>

        </div>
      </header>

      <div className="container mx-auto px-2">
        <div className="w-full max-w-5xl mx-auto px-1 py-1">
          <Card>
            
            <CardHeader>
              <CardTitle>Crear Solicitud de Servicio</CardTitle>
              <CardDescription>
                Describe el servicio que necesitas y recibe cotizaciones de proveedores verificados
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {/*Titulo del Servicio*/}
                <div>
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    placeholder="Ej: Reparación de tubería en cocina"
                    value={formData.titulo}
                    onChange={(e) => setFormData((prev) => ({ ...prev, titulo: e.target.value }))}
                    required
                  />
                </div>
                
                {/*Categoria del Servicio*/}
                <div>
                  <Label htmlFor="Tipo de Servicio">Tipo de Servicio</Label>
                  <Select
                    value={formData.tipo_servicio}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, tipo_servicio: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((tipo_servicio, index) => (
                        <SelectItem key={index+1} value={(index+1).toString()}>
                          {tipo_servicio}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/*Descripción del Servicio*/}
                <div className="w-full max-w-md">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    placeholder="Describe el problema o servicio que necesitas con el mayor detalle posible..."
                    value={formData.descripcion}
                    onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
                    rows={2}
                    required
                    className="w-full min-h-0"
                  />
                </div>
                
                <div></div><div></div><div></div>

                {/*Dirección del Servicio*/}
                <div>
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      value={formData.direccion}
                      onChange={(e) => setFormData((prev) => ({ ...prev, direccion: e.target.value }))}
                      required
                    />
                </div>
                  
                {/*Distrito del Servicio*/}           
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


                {/*Presupuesto del Servicio*/}
                <div>
                  <Label htmlFor="presupuesto">Presupuesto (S/)</Label>
                  <Input
                    id="presupuesto"
                    placeholder="Ej: 100.50 o 200.10"
                    value={formData.presupuesto}
                    
                    onChange={(e) => {
                      const input = e.target.value;
                      // Acepta solo números y un punto, sin permitir más de un punto
                      if (/^\d*\.?\d{0,2}$/.test(input)) {
                        setFormData((prev) => ({ ...prev, presupuesto: input }));
                      }
                    }}
                  />
                </div>

                <div></div><div></div><div></div>
                <div></div><div></div><div></div>

                {/*Urgencia del Servicio*/}
                <div>
                  <Label htmlFor="urgencia">Urgencia</Label>
                  <Select
                    value={formData.urgencia}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, urgencia: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baja">Baja - Puedo esperar</SelectItem>
                      <SelectItem value="Media">Media - Esta semana</SelectItem>
                      <SelectItem value="Alta">Alta - Lo antes posible</SelectItem>
                      <SelectItem value="Muy Alta">Muy Alta - Hoy mismo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/*Fecha del Servicio*/}
                <div>
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fecha: e.target.value }))}
                  />
                </div>
                
                {/*Imagen del Servicio*/}
                <div>                  
                  <Label>Imágenes de referencia (opcional)</Label>
                  <div className="space-y-4">
                    
                    <Button type="button" variant="outline" onClick={handleImageUpload} className="w-full border border-black" disabled={formData.imagen.length >= 3}>
                      <Upload className="h-4 w-4 mr-2" />
                      Subir imagen
                    </Button>
                    
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />

                    {formData.imagen.length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        {formData.imagen.map((imagen, index) => (
                          <div key={index} className="relative">
                            <img
                              src={imagen || "/placeholder.svg"}
                              alt={`Imagen ${index + 1}`}
                              className="w-full h-24 object-cover rounded border"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                </div>*

                <div></div><div></div><div></div>
                <div></div><div></div><div></div>

                <div className="flex space-x-4">
                  <Button type="submit" className="flex-1">
                    Crear Solicitud
                  </Button>
                  <Link href={returnLink} className="flex-1">
                    <Button type="button" variant="outline" className="w-full border border-black text-black bg-white hover:bg-gray-100">
                      Cancelar
                    </Button>
                  </Link>
                </div>
                
                <div></div><div></div><div></div>
                <div></div><div></div><div></div>

                <div>
                  <h4 className="text-center font-medium text-blue-900 mb-2 text-xs">¿Cómo funciona?</h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Los proveedores verán tu solicitud y te enviarán cotizaciones</li>
                    <li>• Podrás revisar perfiles, calificaciones y comentarios</li>
                    <li>• Negocia directamente con los proveedores via chat</li>
                    <li>• El pago se mantiene en custodia hasta completar el servicio</li>
                  </ul>
                </div>

              </form>
            </CardContent>
          </Card>


        </div>
      </div>
    </div>
  )

}
