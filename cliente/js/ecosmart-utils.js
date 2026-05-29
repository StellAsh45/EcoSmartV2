(function () {
  function limpiarNombre(nombre) {
    if (!nombre) return '';
    return String(nombre)
      .replace(/\bundefined\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function sanitizarUsuario(usuario) {
    if (!usuario || typeof usuario !== 'object') return usuario;
    if (usuario.nombre) {
      usuario.nombre = limpiarNombre(usuario.nombre);
    }
    return usuario;
  }

  function obtenerUsuario() {
    try {
      const raw = localStorage.getItem('usuario');
      if (!raw) return {};
      const usuario = sanitizarUsuario(JSON.parse(raw));
      localStorage.setItem('usuario', JSON.stringify(usuario));
      return usuario;
    } catch {
      return {};
    }
  }

  function guardarUsuario(usuario) {
    localStorage.setItem('usuario', JSON.stringify(sanitizarUsuario(usuario)));
  }

  window.EcoSmartUtils = {
    limpiarNombre,
    sanitizarUsuario,
    obtenerUsuario,
    guardarUsuario,
  };

  // Corregir localStorage al cargar cualquier página
  obtenerUsuario();
})();
