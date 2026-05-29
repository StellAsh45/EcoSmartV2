async function generarYDescargarCertificado(certificado) {
  const { curso_titulo, usuario_nombre, fecha_emision, codigo } = certificado;
  const fechaObj = new Date(fecha_emision);
  const fecha = fechaObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const nombreEstudiante = usuario_nombre || 'Estudiante';
  const tituloCurso = curso_titulo || 'Curso';
  const idVerificacion = codigo || 'ECO-000000-2026';

  const container = document.createElement('div');
  // Para que html2canvas capture todo sin cortes, forzamos su posición
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.margin = '0';
  container.style.padding = '0';
  container.style.width = '1122px';
  container.style.height = '794px';
  container.style.zIndex = '-9999';
  container.style.pointerEvents = 'none';
  document.body.appendChild(container);

  container.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
        .firma-ecosmart {
          font-family: 'Dancing Script', cursive !important;
          font-weight: 700;
        }
      </style>
      <div id="certificado-temp" style="width: 1122px; height: 794px; background-color: #020617; position: relative; font-family: 'Inter', system-ui, sans-serif; overflow: hidden; box-sizing: border-box;">

        <!-- Fondo con gradientes -->
        <div style="position: absolute; inset: 0; background: radial-gradient(ellipse at 80% 10%, rgba(16,249,129,0.18) 0%, transparent 55%), radial-gradient(ellipse at 20% 90%, rgba(16,249,129,0.12) 0%, transparent 50%);"></div>

        <!-- Puntos decorativos esquina sup izq -->
        <div style="position: absolute; top: 24px; left: 24px; opacity: 0.2;">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="4" cy="4" r="2" fill="#10f981"/><circle cx="20" cy="4" r="2" fill="#10f981"/><circle cx="36" cy="4" r="2" fill="#10f981"/><circle cx="52" cy="4" r="2" fill="#10f981"/>
            <circle cx="4" cy="20" r="2" fill="#10f981"/><circle cx="20" cy="20" r="2" fill="#10f981"/><circle cx="36" cy="20" r="2" fill="#10f981"/>
            <circle cx="4" cy="36" r="2" fill="#10f981"/><circle cx="20" cy="36" r="2" fill="#10f981"/>
            <circle cx="4" cy="52" r="2" fill="#10f981"/>
          </svg>
        </div>

        <!-- Puntos decorativos esquina inf der -->
        <div style="position: absolute; bottom: 24px; right: 24px; opacity: 0.2; transform: rotate(180deg);">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="4" cy="4" r="2" fill="#10f981"/><circle cx="20" cy="4" r="2" fill="#10f981"/><circle cx="36" cy="4" r="2" fill="#10f981"/><circle cx="52" cy="4" r="2" fill="#10f981"/>
            <circle cx="4" cy="20" r="2" fill="#10f981"/><circle cx="20" cy="20" r="2" fill="#10f981"/><circle cx="36" cy="20" r="2" fill="#10f981"/>
            <circle cx="4" cy="36" r="2" fill="#10f981"/><circle cx="20" cy="36" r="2" fill="#10f981"/>
            <circle cx="4" cy="52" r="2" fill="#10f981"/>
          </svg>
        </div>

        <!-- Marco exterior doble -->
        <div style="position: absolute; inset: 16px; border: 1px solid rgba(16,249,129,0.15); border-radius: 20px;"></div>
        <div style="position: absolute; inset: 22px; border: 2px solid rgba(16,249,129,0.5); border-radius: 16px; box-shadow: inset 0 0 60px rgba(16,249,129,0.04), 0 0 40px rgba(16,249,129,0.15);"></div>

        <!-- Franja lateral izquierda -->
        <div style="position: absolute; left: 22px; top: 22px; bottom: 22px; width: 6px; background: linear-gradient(to bottom, transparent, #10f981, transparent); border-radius: 3px; opacity: 0.7;"></div>

        <!-- Línea decorativa superior -->
        <div style="position: absolute; top: 50px; left: 70px; right: 70px; height: 1px; background: linear-gradient(to right, transparent, rgba(16,249,129,0.4), transparent);"></div>

        <!-- Contenido principal -->
        <div style="position: relative; z-index: 10; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 80px 50px; box-sizing: border-box;">

          <!-- Cabecera: Logo + nombre entidad -->
          <div style="display: flex; align-items: center; gap: 18px; margin-bottom: 28px;">
            <img src="./assets/logo.png" alt="EcoSmart" style="width: 64px; height: 64px; object-fit: contain; filter: drop-shadow(0 0 12px rgba(16,249,129,0.4));" onerror="this.style.display='none'" />
            <div style="text-align: left; border-left: 2px solid rgba(16,249,129,0.4); padding-left: 18px;">
              <span
                style="display: block; font-size: 1.875rem; font-weight: 900; letter-spacing: -0.025em; text-shadow: 0 1px 2px rgba(0,0,0,0.05); font-family: 'Inter', system-ui, sans-serif; line-height: 1;">
                <span style="color: #135300;">Eco</span><span style="color: #7CBC02;">Smart</span>
              </span>
              <p style="color:#ffffff; font-size: 11px; font-weight: 700; margin: 0; letter-spacing: 4px; text-transform: uppercase;">Plataforma de Educación Ambiental</p>
            </div>
          </div>

          <!-- Título del certificado -->
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #10f981; font-size: 50px; font-weight: 900; margin: 0 0 4px 0; letter-spacing: 6px; text-transform: uppercase;">Certificado</h1>
          </div>

          <!-- Separador con estrella -->
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 20px; width: 60%;">
            <div style="flex: 1; height: 1px; background: linear-gradient(to right, transparent, rgba(16,249,129,0.4));"></div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10f981" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <div style="flex: 1; height: 1px; background: linear-gradient(to left, transparent, rgba(16,249,129,0.4));"></div>
          </div>

          <!-- Texto de presentación -->
          <p style="color:#ffffff; font-size: 15px; margin: 0 0 6px 0; font-weight: 400; letter-spacing: 1px;">La plataforma EcoSmart certifica y hace constar que</p>

          <!-- Nombre del estudiante -->
          <div style="text-align: center; margin: 25px auto; padding: 15px 0; border-bottom: 2px solid rgba(16,249,129,0.6); border-top: 2px solid rgba(16,249,129,0.6); width: 75%;">
            <h2 style="color: #ffffff; font-size: 54px; font-weight: 900; margin: 10px 0; letter-spacing: 1px; text-shadow: 0 2px 20px rgba(255,255,255,0.1); line-height: 1;">${nombreEstudiante}</h2>
          </div>

          <!-- Texto de logro -->
          <p style="color:#ffffff; font-size: 15px; margin: 0 0 4px 0; font-weight: 400; text-align: center;">
            Ha cursado y aprobado satisfactoriamente todos los módulos y exámenes del curso de
          </p>

          <!-- Título del curso -->
          <h3 style="color: #10f981; font-size: 28px; font-weight: 800; margin: 8px 0 20px 0; text-align: center; max-width: 800px; line-height: 1.3; text-shadow: 0 0 20px rgba(16,249,129,0.2);">"${tituloCurso}"</h3>

          <!-- Sección inferior: Fecha | Sello | Firma -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 90%; margin-top: 10px; padding-top: 18px; border-top: 1px solid rgba(16,249,129,0.2);">

            <!-- Fecha -->
            <div style="text-align: left;">
              <p style="color:#ffffff; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; margin: 0 0 5px 0;">Fecha de Emisión</p>
              <p style="color: #10f981; font-size: 16px; font-weight: 700; margin: 0;">${fecha}</p>
            </div>

            <!-- Sello central -->
            <div style="text-align: center;">
              <div style="width: 80px; height: 80px; border-radius: 50%; background: radial-gradient(circle, rgba(16,249,129,0.15) 0%, transparent 70%); border: 2px solid #10f981; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: -10px auto 6px auto; box-shadow: 0 0 20px rgba(16,249,129,0.2);">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10f981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <p style="color: #10f981; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Certificado Verificado</p>
            </div>

            <!-- Firma + ID -->
            <div style="text-align: right;">
              <p style="color:#ffffff; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; margin: 0;">Firma Autorizada</p>
              <p class="firma-ecosmart" style="color: #10f981; font-size: 24px; font-weight: 400; margin:0 0 15px 0;">EcoSmart</p>
              <p style="color:#cbd5e1; font-size: 9px; font-weight: 700; margin: 0; letter-spacing: 1px;">ID: ${idVerificacion}</p>
            </div>
          </div>

        </div>
      </div>
    `;

  const element = document.getElementById('certificado-temp');
  const fileName = `Certificado-EcoSmart-${nombreEstudiante.replace(/\s+/g, '-')}.pdf`;

  const opt = {
    margin: 0,
    filename: fileName,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#020617',
      windowWidth: 1122,
      windowHeight: 794,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0
    },
    jsPDF: { unit: 'px', format: [1122, 794], orientation: 'landscape' }
  };

  try {
    if (typeof html2pdf === 'undefined') {
      throw new Error('html2pdf no está cargado. Asegúrate de incluir el CDN.');
    }
    // Generar y descargar (comportamiento web)
    await html2pdf().from(element).set(opt).save();
  } catch (error) {
    console.error('Error al generar el certificado:', error);
    alert('Error al generar el certificado. Por favor intenta de nuevo.');
  } finally {
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  }
}
