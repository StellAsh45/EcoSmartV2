export function limpiarNombre(nombre: string | undefined | null): string {
  if (!nombre) return '';
  return String(nombre)
    .replace(/\bundefined\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function construirNombreGoogle(
  firstName?: string,
  lastName?: string,
  correo?: string,
): string {
  const nombre = [firstName, lastName]
    .filter((parte) => parte && String(parte).toLowerCase() !== 'undefined')
    .join(' ')
    .trim();

  if (nombre) return nombre;
  if (correo) return correo.split('@')[0];
  return 'Usuario';
}
