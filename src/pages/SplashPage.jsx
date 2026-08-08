import logoSymbol from '../assets/logo-symbol-white.svg';

function SplashPage() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-[var(--color-primary)]">
      <img
        src={logoSymbol}
        alt="5Pen"
        className="h-auto w-[120px]"
        draggable="false"
      />
    </main>
  );
}

export default SplashPage;
