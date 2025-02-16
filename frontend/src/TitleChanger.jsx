// src/TitleChanger.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TitleChanger = () => {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      '/': 'RA | Estadísticas',
      '/login': 'RA | Login',
      '/estadisticas': 'RA | Estadísticas',
      '/movimientos': 'RA | Movimientos',
      '/clientes': 'RA | Clientes',
      '/profile': 'RA | Perfil'
    };

    document.title = titles[location.pathname] || 'Rocuant Azucar';
  }, [location]);

  return null;
};

export default TitleChanger;