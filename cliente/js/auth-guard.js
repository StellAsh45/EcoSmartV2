(function () {
  function getUsuario() {
    try {
      return JSON.parse(localStorage.getItem('usuario') || '{}');
    } catch {
      return {};
    }
  }

  function getToken() {
    return localStorage.getItem('access_token') || '';
  }

  function cerrarSesionLocal() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('usuario');
  }

  function requireAuth(expectedRole) {
    const token = getToken();
    const usuario = getUsuario();
    const userId = usuario?._id || usuario?.sub;

    if (!token || !userId) {
      cerrarSesionLocal();
      window.location.href = 'ingreso.html';
      return null;
    }

    if (expectedRole && usuario.rol !== expectedRole) {
      window.location.href = usuario.rol === 'administrador'
        ? 'dashboard-administrador.html'
        : 'dashboard-estudiante.html';
      return null;
    }

    return usuario;
  }

  function authHeaders(extraHeaders) {
    return {
      ...(extraHeaders || {}),
      Authorization: `Bearer ${getToken()}`,
    };
  }

  function authFetch(url, options) {
    const opts = options || {};
    return fetch(url, {
      ...opts,
      headers: authHeaders(opts.headers),
    });
  }

  window.EcoSmartAuth = {
    getUsuario,
    getToken,
    requireAuth,
    authHeaders,
    authFetch,
  };
})();
