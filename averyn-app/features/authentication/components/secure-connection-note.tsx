"use client";

import { useEffect, useState } from "react";

/**
 * Nota «Conexión segura y protegida», solo si la página va realmente por HTTPS.
 *
 * Es un Client Component porque el protocolo solo se conoce en el navegador; en el
 * servidor y en el primer render no muestra nada, para no afirmar una seguridad que
 * no se ha comprobado.
 *
 * @returns La nota, o nada si la conexión no es HTTPS.
 */
export function SecureConnectionNote() {
  const [isSecure, setIsSecure] = useState(false);

  useEffect(() => {
    setIsSecure(window.location.protocol === "https:");
  }, []);

  return isSecure ? <p className="av-login__secure">Conexión segura y protegida</p> : null;
}
