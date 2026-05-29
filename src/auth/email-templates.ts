export const PASSWORD_CHANGED_SUBJECT = 'Tu contraseña de EcoSmart ha sido cambiada';
export const PASSWORD_RESET_SUBJECT = 'Restablecer contraseña de EcoSmart';

export function passwordChangedEmailHtml(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #020617;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #0f172a;
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid #1e293b;
        }
        .header {
            background-color: #0f172a;
            padding: 40px 20px;
            text-align: center;
        }
        .logo {
            width: 80px;
            height: 80px;
            margin-bottom: 20px;
        }
        .content {
            padding: 40px;
            text-align: center;
            color: #ffffff;
        }
        .badge {
            display: inline-block;
            background-color: rgba(16, 249, 129, 0.1);
            color: #4ade80;
            padding: 8px 16px;
            border-radius: 50px;
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            margin-bottom: 24px;
            border: 1px solid rgba(16, 249, 129, 0.2);
        }
        h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 32px;
            font-weight: 900;
            color: #ffffff;
            margin: 0 0 16px 0;
            letter-spacing: -0.02em;
        }
        .highlight {
            color: #10f981;
        }
        p {
            font-size: 16px;
            line-height: 1.6;
            color: #94a3b8;
            margin-bottom: 32px;
        }
        .button {
            display: inline-block;
            background-color: transparent;
            color: #10f981;
            padding: 16px 32px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 900;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            border: 1px solid #10f981;
        }
        .footer {
            padding: 30px;
            text-align: center;
            border-top: 1px solid #1e293b;
            background-color: #0f172a;
        }
        .footer p {
            font-size: 14px;
            color: #64748b;
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://qdnivmcnsidcwlbfiuxj.supabase.co/storage/v1/object/public/cursos/logocorreos/EcoSmart-icon.png" alt="EcoSmart Logo" class="logo">
            <div style="font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 900;">
                <span style="color: #135300;">Eco</span><span style="color: #7CBC02;">Smart</span>
            </div>
        </div>
        <div class="content">
            <div class="badge">
                <span style="display:inline-block; width: 6px; height: 6px; background-color: #4ade80; border-radius: 50%; margin-right: 5px; vertical-align: middle;"></span>
                Actualización Exitosa
            </div>
            <h1>Tu Contraseña ha sido <br><span class="highlight">Actualizada</span></h1>
            <p>
                Hola, te informamos que la contraseña de tu cuenta en <strong>EcoSmart</strong> ha sido modificada correctamente.
            </p>
            <p style="margin-top: 32px; font-size: 12px; color: #64748b;">
                <strong>¿No fuiste tú?</strong> Si no realizaste este cambio, por favor ponte en contacto con nuestro equipo de soporte de inmediato para proteger tu cuenta.
            </p>
        </div>
        <div class="footer">
            <p>© 2026 <strong>EcoSmart</strong>. Todos los derechos reservados.</p>
            <p class="accent-text">Hecho con ❤️ para el planeta.</p>
            <div style="margin-top: 20px; font-size: 12px; color: #475569;">
                Comprometidos con la educación ambiental.
            </div>
        </div>
    </div>
</body>
</html>`;
}

export function passwordResetEmailHtml(resetUrl: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #020617; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .container { max-width: 600px; margin: 40px auto; background-color: #0f172a; border-radius: 20px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background-color: #0f172a; padding: 40px 20px; text-align: center; }
        .logo { width: 80px; height: 80px; margin-bottom: 20px; }
        .content { padding: 40px; text-align: center; color: #ffffff; }
        .badge { display: inline-block; background-color: rgba(239, 68, 68, 0.1); color: #f87171; padding: 8px 16px; border-radius: 50px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 24px; border: 1px solid rgba(239, 68, 68, 0.2); }
        h1 { font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 900; color: #ffffff; margin: 0 0 16px 0; letter-spacing: -0.02em; }
        .highlight { color: #10f981; }
        p { font-size: 16px; line-height: 1.6; color: #94a3b8; margin-bottom: 32px; }
        .button { display: inline-block; background-color: #10f981; color: #000000; padding: 18px 40px; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em; transition: all 0.3s ease; }
        .footer { padding: 30px; text-align: center; border-top: 1px solid #1e293b; background-color: #0f172a; }
        .footer p { font-size: 14px; color: #64748b; margin: 0; margin-bottom: 5px; }
        .accent-text { color: #4ade80; font-weight: bold; }
        @media only screen and (max-width: 600px) { .container { margin: 0; width: 100%; border-radius: 0; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://qdnivmcnsidcwlbfiuxj.supabase.co/storage/v1/object/public/cursos/logocorreos/EcoSmart-icon.png" alt="EcoSmart Logo" class="logo">
            <div style="font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 900;">
                <span style="color: #135300;">Eco</span><span style="color: #7CBC02;">Smart</span>
            </div>
        </div>
        <div class="content">
            <div class="badge">
                <span style="display:inline-block; width: 6px; height: 6px; background-color: #ef4444; border-radius: 50%; margin-right: 5px; vertical-align: middle;"></span>
                Seguridad de Cuenta
            </div>
            <h1>¿Olvidaste tu <br><span class="highlight">Contraseña</span>?</h1>
            <p>
                No te preocupes, suele pasar. Haz clic en el botón de abajo para elegir una nueva contraseña y volver a tu aprendizaje en <strong>EcoSmart</strong>.
            </p>
            
            <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
            
            <p style="margin-top: 32px; font-size: 11px; color: #64748b; font-style: italic;">
                Este enlace expirará pronto. Si no solicitaste este cambio, simplemente ignora este correo.
            </p>
        </div>
        <div class="footer">
            <p>© 2026 <strong>EcoSmart</strong>. Todos los derechos reservados.</p>
            <p class="accent-text">Hecho con ❤️ para el planeta.</p>
        </div>
    </div>
</body>
</html>`;
}
