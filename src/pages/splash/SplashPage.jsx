import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoSymbol from '../../assets/logo-symbol-white.svg';

function SplashPage() {
  const navigate = useNavigate();
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsLeaving(true);
    }, 1200);

    const navigateTimer = setTimeout(() => {
      navigate('/login', { replace: true });
    }, 1650);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navigateTimer);
    };
  }, [navigate]);

  return (
    <main
      className={`flex min-h-dvh w-full items-center justify-center bg-[var(--color-primary)] transition-opacity duration-500 ease-out ${
        isLeaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <img
        src={logoSymbol}
        alt="5Pen"
        draggable="false"
        className={`h-auto w-[120px] transition-transform duration-500 ease-out ${
          isLeaving ? 'scale-105' : 'scale-100'
        }`}
      />
    </main>
  );
}

export default SplashPage;
