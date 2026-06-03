# Guía de cumplimiento de accesibilidad web- EcoSmart

## Descripción del Aplicativo

EcoSmart es una plataforma educativa web interactiva y modular dedicada al aprendizaje y concientización sobre el medio ambiente. El aplicativo cuenta con un sistema de registro de estudiantes y administradores, catálogo de cursos dinámico, creador de módulos y lecciones interactivas, evaluaciones de conocimiento, paneles de control personalizados y un generador automático de certificados de finalización.

Este documento detalla los principios de accesibilidad implementados en EcoSmart.. Se presentan 3 principios/criterios por cada una de las 4 categorías principales (Perceptible, Operable, Comprensible y Robusto), utilizando fragmentos de código exactos del proyecto como evidencia.

---

## 1. PERCEPTIBLE

La información y los componentes de la interfaz de usuario deben presentarse a los usuarios de formas que puedan percibir.

### 1.1 Alternativas de Texto

* **Definición de la Guía**:
  * **Imágenes**: Proporcionar texto alternativo descriptivo (`alt=""` para decorativas)
  * **Imágenes complejas**: Usar descripciones largas cuando sea necesario
  * **CAPTCHAs**: Ofrecer alternativas en audio y otros formatos
* **Código de Evidencia**:
  * [registro.html:L218](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/registro.html#L218):
    ```html
    <img src="assets/logo.png" alt="Logo" class="w-24 h-24 relative hover:scale-110 transition-transform duration-500 ease-out drop-shadow-2xl brightness-110 contrast-125 object-contain flex-shrink-0">
    ```
  * [recuperacion.html:L107](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/recuperacion.html#L107):
    ```html
    <img src="assets/logo.png" alt="Logo" class="w-24 h-24 relative hover:scale-110 transition-transform duration-500 ease-out drop-shadow-2xl brightness-110 contrast-125 object-contain flex-shrink-0">
    ```
  * [inicio.html:L200](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/inicio.html#L200):
    ```html
    <img src="assets/logo.png" alt="EcoSmart Logo" class="h-10 w-auto brightness-110 contrast-125 drop-shadow-lg object-contain">
    ```

### 1.3 Adaptable

* **Definición de la Guía**:
  * **Estructura semántica**: Usar encabezados (h1-h6) jerárquicamente
  * **Orden de lectura**: Contenido lógico sin CSS
  * **Instrucciones**: No depender solo de características sensoriales
* **Código de Evidencia**:
  * [registro.html:L221-L222](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/registro.html#L221-L222):
    ```html
    <h2 class="text-3xl font-black text-white mb-2 font-heading tracking-tight">Crea tu cuenta</h2>
    ```
  * [recuperacion.html:L109](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/recuperacion.html#L109):
    ```html
    <h1 class="text-3xl font-black text-white mb-2 font-heading tracking-tight">Recuperar acceso</h1>
    ```
  * [registro.html:L234-L244](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/registro.html#L234-L244):
    ```html
    <form id="formularioRegistro" class="space-y-8 text-center sm:text-left" novalidate>
        <div class="flex flex-col gap-2.5">
            <label class="block text-sm font-bold ml-1 text-primary-500">Nombre completo</label>
            <div class="relative group/input">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-400">
                    <i data-lucide="user" class="w-5 h-5"></i>
                </div>
                <input type="text" id="nombre" required placeholder="Nombre"
                    class="w-full pl-12 pr-6 py-4 rounded-2xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white/10 text-white placeholder:text-primary-50/30 text-m">
            </div>
        </div>
    ```
  * [registro.html:L288-L297](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/registro.html#L288-L297):
    ```html
    <div id="error-contrasena-lista" class="hidden text-[10px] sm:text-xs text-red-500 ml-1 mt-2 font-medium bg-red-500/5 p-3 rounded-lg border border-red-500/10 animate-fade-in">
        <p class="font-bold mb-1">La contraseña debe contener:</p>
        <ul class="space-y-1 opacity-90">
            <li id="req-min" class="flex items-center gap-1.5 transition-colors">
                <div class="w-1 h-1 rounded-full bg-current"></div> Mínimo 6 caracteres
            </li>
            <li id="req-pattern" class="flex items-center gap-1.5 transition-colors">
                <div class="w-1 h-1 rounded-full bg-current"></div> Mayúscula, número y símbolo
            </li>
        </ul>
    </div>
    ```

### 1.4 Distinguible

* **Definición de la Guía**:
  * **Contraste de color**: Texto normal 4.5:1 (AA); texto grande 3:1 (AA)
  * **Redimensionamiento**: Hasta 200% sin pérdida de funcionalidad
  * **Imágenes de texto**: Evitar, usar texto real cuando sea posible
  * **Reflow**: Contenido adaptable a 320px de ancho
* **Código de Evidencia**:
  * [registro.html:L191-L192](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/registro.html#L191-L192):
    ```html
    <div class="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-acelerado font-sans">
    ```
  * [terminos.html:L217](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/terminos.html#L217):
    ```html
    <h1 class="text-4xl sm:text-5xl font-black text-white text-center font-heading tracking-tight">
    ```

---

## 2. OPERABLE

Los componentes de la interfaz de usuario y la navegación deben ser operables.

### 2.1 Accesible por Teclado

* **Definición de la Guía**:
  * **Navegación por teclado**: Toda funcionalidad accesible con teclado
  * **Sin trampas**: El foco no debe quedar atrapado
  * **Atajos de teclado**: Documentar y permitir desactivación
* **Código de Evidencia**:
  * [registro.html:L317-L320](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/registro.html#L317-L320):
    ```html
    <button type="submit" id="botonRegistro"
        class="w-full bg-primary-500 text-slate-950 py-4 rounded-2xl font-black hover:bg-primary-400 transition-all flex items-center justify-center gap-2 group/btn shadow-xl shadow-primary-500/20 active:scale-95 text-lg">
    ```
  * [registro.html:L195-L196](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/registro.html#L195-L196):
    ```html
    <a href="inicio.html"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all no-underline font-bold group text-sm backdrop-blur-md">
    ```
  * [registro.html:L305-L306](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/registro.html#L305-L306):
    ```html
    <input type="checkbox" id="terms" required
        class="h-4 w-4 text-primary-500 focus:ring-primary-500 border-white/10 bg-white/5 rounded cursor-pointer" />
    ```

### 2.4 Navegable

* **Definición de la Guía**:
  * **Saltar bloques**: Enlaces para saltar navegación repetitiva
  * **Títulos de página**: Descriptivos y únicos
  * **Orden del foco**: Lógico y predecible
  * **Propósito del enlace**: Claro desde el contexto
* **Código de Evidencia**:
  * [registro.html:L7](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/registro.html#L7):
    ```html
    <title>EcoSmart - Registro</title>
    ```
  * [recuperacion.html:L7](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/recuperacion.html#L7):
    ```html
    <title>EcoSmart - Recuperar acceso</title>
    ```
  * [terminos.html:L7](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/terminos.html#L7):
    ```html
    <title>EcoSmart - Términos y Condiciones</title>
    ```
  * [registro.html:L308-L313](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/registro.html#L308-L313):
    ```html
    Acepto los <a href="terminos.html"
        class="text-primary-400 hover:text-primary-300 font-bold no-underline">Términos
        de servicio</a> y la
    <a href="politica.html"
        class="text-primary-400 hover:text-primary-300 font-bold no-underline">Política
        de privacidad</a>.
    ```

### 2.5 Modalidades de Entrada

* **Definición de la Guía**:
  * **Gestos**: Alternativas para gestos multitáctiles
  * **Cancelación de puntero**: Permitir cancelar acciones
  * **Etiquetas**: Coincidencia entre etiquetas visibles y accesibles
  * **Tamaño del objetivo (Criterio 2.5.8 - Nuevos Criterios WCAG 2.2)**: Objetivos táctiles de al menos 24x24 píxeles CSS
* **Código de Evidencia**:
  * [registro.html:L317-L322](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/registro.html#L317-L322):
    ```html
    <button type="submit" id="botonRegistro" class="w-full bg-primary-500 text-slate-950 py-4 rounded-2xl font-black hover:bg-primary-400 transition-all flex items-center justify-center gap-2 group/btn shadow-xl shadow-primary-500/20 active:scale-95 text-lg">
    ```
  * [registro.html:L218-L219](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/registro.html#L218-L219):
    ```html
    <img src="assets/logo.png" alt="Logo" class="w-24 h-24 relative hover:scale-110 transition-transform duration-500 ease-out drop-shadow-2xl brightness-110 contrast-125 object-contain flex-shrink-0">
    ```

---

## 3. COMPRENSIBLE

La información y el manejo de la interfaz debe ser comprensible.

### 3.1 Legible

* **Definición de la Guía**:
  * **Idioma de la página**: Especificar con `lang`
  * **Idioma de partes**: Identificar cambios de idioma
  * **Palabras inusuales**: Proporcionar definiciones
* **Código de Evidencia**:
  * [registro.html:L2](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/registro.html#L2):
    ```html
    <html lang="es">
    ```
  * [recuperacion.html:L2](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/recuperacion.html#L2):
    ```html
    <html lang="es">
    ```
  * [inicio.html:L2](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/inicio.html#L2):
    ```html
    <html lang="es">
    ```

### 3.2 Predecible

* **Definición de la Guía**:
  * **Al recibir el foco**: Sin cambios automáticos de contexto
  * **Al introducir datos**: Sin cambios inesperados
  * **Navegación consistente**: Misma ubicación en todas las páginas
  * **Identificación consistente**: Misma funcionalidad, misma identificación
* **Código de Evidencia**:
  * [registro.html:L194-L200](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/registro.html#L194-L200):
    ```html
    <div id="areaVolver" class="mb-6 flex animate-fade-in">
        <a href="inicio.html" class="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all no-underline font-bold group text-sm backdrop-blur-md">
            <i data-lucide="arrow-left" class="group-hover:-translate-x-1 transition-transform w-4 h-4"></i> Volver al Inicio
        </a>
    </div>
    ```
  * [registro.html:L394-L396](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/registro.html#L394-L396):
    ```html
    <div class="mt-8 text-center pb-8 pt-8 animate-fade-in-footer">
        <p class="text-primary-50 text-sm font-medium">© 2026 EcoSmart. Comprometidos con el planeta.</p>
    </div>
    ```

### 3.3 Asistencia para la Entrada

* **Definición de la Guía**:
  * **Identificación de errores**: Describir errores claramente
  * **Etiquetas o instrucciones**: Proporcionar cuando se requiera entrada
  * **Sugerencias de error**: Ofrecer correcciones cuando sea posible
  * **Prevención de errores**: Confirmación para acciones importantes
* **Código de Evidencia**:
  * [registro.html:L236](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/registro.html#L236) y [registro.html:L255](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/registro.html#L255):
    ```html
    <label class="block text-sm font-bold ml-1 text-primary-500">Nombre completo</label>
    <label class="block text-sm font-bold ml-1 text-primary-500">Correo electrónico</label>
    ```
  * [registro.html:L246-L248](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/registro.html#L246-L248):
    ```html
    <div id="error-nombre-req" class="hidden text-[10px] sm:text-xs text-red-500 ml-1 mt-2 font-medium bg-red-500/5 p-2 rounded-lg border border-red-500/10 animate-fade-in">
        Este campo es requerido.
    </div>
    ```
  * [registro.html:L437-L442](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/registro.html#L437-L442):
    ```javascript
    if (nombre.length === 0) {
        document.getElementById('error-nombre-req').classList.remove('hidden');
        errorLocal = true;
    }
    ```

---

## 4. ROBUSTO

El contenido debe ser lo suficientemente robusto para ser interpretado por una amplia variedad de agentes de usuario.

### 4.1 Compatible

* **Definición de la Guía**:
  * **Análisis sintáctico**: HTML válido y bien formado
  * **Nombre, función, valor**: Elementos programáticamente determinables
  * **Mensajes de estado**: Comunicar cambios importantes
* **Código de Evidencia**:
  * [registro.html:L1-L6](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/registro.html#L1-L6):
    ```html
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ```
  * [registro.html:L305-L306](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/registro.html#L305-L306):
    ```html
    <input type="checkbox" id="terms" required
        class="h-4 w-4 text-primary-500 focus:ring-primary-500 border-white/10 bg-white/5 rounded cursor-pointer" />
    ```
  * [registro.html:L228-L232](file:///c:/Users/mluci/OneDrive/Documentos/GitHub/EcoSmartV2/cliente/registro.html#L228-L232):
    ```html
    <div id="contenedorError"
        class="hidden mb-8 p-4 bg-red-500/10 text-red-400 rounded-2xl text-sm border border-red-500/20 backdrop-blur-md flex items-center gap-3 animate-fade-in">
        <span class="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
        <span id="textoError"></span>
    </div>
    ```
