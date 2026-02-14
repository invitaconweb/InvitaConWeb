# Especificaciones del Proyecto: Platforma SaaS de Invitaciones Digitales

## 1. Visión del Proyecto
Construir una aplicación web SaaS (Software as a Service) que permita a los usuarios crear, personalizar y publicar invitaciones digitales para eventos (bodas, bautizos, fiestas). El modelo de negocio es "Pagar para Publicar": el usuario diseña gratis, pero debe pagar para obtener el enlace público compartible.

## 2. Stack Tecnológico (La Arquitectura)

### Frontend
- **Framework:** Next.js 14+ (App Router).
- **Lenguaje:** TypeScript (Estricto).
- **Estilos:** Tailwind CSS.
- **Componentes UI:** Shadcn/ui (para el dashboard, editor y formularios).
- **Iconos:** Lucide React.

### Backend & Datos (Serverless)
- **BaaS (Backend as a Service):** Supabase.
  - **Auth:** Gestión de usuarios (Email/Password + Google Auth).
  - **Database:** PostgreSQL para guardar usuarios, configuraciones de invitaciones y RSVPs.
  - **Storage:** Supabase Storage para guardar las imágenes que suban los usuarios.
  - **Edge Functions:** Para optimización de imágenes y generación de Open Graph (opcional).
- **Email:** Resend (o similar) para notificaciones transaccionales (confirmación de RSVP al anfitrión).

### Pagos
- **Proveedor:** Stripe.
- **Modelo:** Pago único por invitación publicada.

## 3. Funcionalidades Principales (Core Features)

### A. Módulo Público (Landing Page & Ejemplos)
- Landing page explicando el servicio.
- Galería de "Plantillas" (Bodas, Comuniones, etc.).
- Opción de solicitar un desarrollo personalizado (más caro).
- Al hacer clic en una plantilla, lleva al editor cargando ese diseño base.
- Casos de éxito.

### B. El Editor (The Builder) - Enfoque: Plantillas Estructuradas
*Nota: Se elimina la edición libre de bloques para el MVP en favor de plantillas fijas y elegantes.*
- **Interfaz "Mobile-First":** La vista previa por defecto es móvil.
- **Capacidades de edición:**
  - Editar textos (Nombres, fechas, historia).
  - Subir imágenes (Portada, Galería). **Importante:** Optimización automática al subir.
  - **Enlace de Ubicación:** Campo específico para Google Maps / Waze.
  - Selector de Tipografía y Paleta de Colores.
- **Vista Previa Anti-Spoofer:** La invitación se muestra con una marca de agua o superposición en el editor hasta que se paga.

### C. Gestión de Invitación (Dashboard de Usuario)
- "Centro de Comando del Evento" en lugar de una simple lista.
- Estado: "Borrador" (Draft) o "Publicada" (Paid).
- **Botón de Pago:** Checkout de Stripe para publicar.
- **Lista de Asistentes (RSVP):** Tabla con filtros (Confirmados, Pendientes, Rechazados).

### D. La Invitación Final (Vista del Invitado)
- URL única (ej: `microsite.com/p/boda-ana-y-luis`).
- **Open Graph (Social Sharing):** Generación automática de imagen de previsualización para WhatsApp/Telegram/iMessage (Critical for viral loop).
- Diseño responsive optimizado para móvil.
- **Formulario de RSVP Avanzado:**
  - Asistencia (Sí/No).
  - Restricciones Alimentarias (Texto libre).
  - Número de acompañantes (si el anfitrión lo permite).
  - Mensaje para los novios.
- **Protección Anti-Spam:** Rate limiting simple o CAPTCHA invisible en el formulario.

### E. Panel de Super-Administrador (Dueño del SaaS)
*Nota: Simplificado para MVP.*
- Se utilizarán los dashboards nativos de Supabase y Stripe para métricas de usuarios e ingresos.
- Vista mínima para gestión de plantillas globales (JSONs).

## 4. Estructura de Base de Datos (Preliminar Revisada)

1. **profiles:** Datos del usuario.
2. **templates:** Diseños base (JSON con estructura y valores por defecto).
3. **invitations:**
   - `user_id` (Dueño)
   - `content` (JSON con textos, colores, fotos)
   - `status` (draft / paid)
   - `slug` (url única)
   - `version` (Integer: para manejar cambios futuros en el esquema del JSON)
   - `og_image_url` (URL de la imagen generada para compartir)
4. **guests:**
   - `invitation_id`
   - `name`, `email`, `status` (confirmed, declined), `dietary_requirements`, `plus_ones`.

## 5. Guía de Estilo y UX
- **Diseño:** Minimalista, limpio y elegante.
- **Shadcn UI:** Componentes nativos para editor/dashboard.
- **Mobile First:** Prioridad absoluta a la experiencia en celular.

## 6. Consideraciones Técnicas y Riesgos
- **Optimización de Imágenes:** Comprimir imágenes en el cliente antes de subir a Supabase para ahorrar costes y mejorar velocidad.
- **Evolución del Schema JSON:** El campo `content` debe tener versionado para no romper invitaciones antiguas al actualizar plantillas.
- **Políticas de Expiración:** Definir si las invitaciones "caducan" (ej: 3 meses después de la fecha del evento) para ahorrar espacio en DB.

## 7. Pasos de Implementación (Roadmap Actualizado)
1. **Setup:** Next.js + Supabase + Shadcn.
2. **Auth & DB:** Modelado de datos con soporte de versionado.
3. **Editor "Structured":** Crear primera plantilla fija (Boda) y formulario de edición.
4. **Vista Invitado & OG:** Renderizado público y meta tags dinámicos.
5. **Pagos:** Integración Stripe (Webhook para cambio de estado Draft -> Paid).
6. **RSVP & Notificaciones:** Formulario avanzado y emails transaccionales.
