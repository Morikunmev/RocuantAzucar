export function Container({ children, className }) {
  // Base classes que siempre estarán presentes
  const baseClasses = "mx-auto max-w-7xl";

  // Classes por defecto para el container principal (cuando no es navbar)
  const defaultClasses = "min-h-[calc(100vh-88px)] p-8";

  // Verificar si es la página de login (no queremos estilos de fondo)
  const isLoginPage = window.location.pathname === "/login";

  // Si es la página de login, no aplicar estilos de fondo
  if (isLoginPage) {
    return <div className={baseClasses}>{children}</div>;
  }

  // Combinar las classes según si se proveen classes personalizadas
  const combinedClasses = className
    ? `${baseClasses} ${className}`
    : `${baseClasses} ${defaultClasses} bg-gradient-to-b from-gray-900 to-gray-950`;

  // Si hay className, solo aplicar el contenedor base
  if (className) {
    return <div className={combinedClasses}>{children}</div>;
  }

  // Si no hay className, aplicar el layout completo con el div interno
  return (
    <div className={combinedClasses}>
      <div className="h-full bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 shadow-lg">
        {children}
      </div>
    </div>
  );
}
