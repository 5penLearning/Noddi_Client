const variantClasses = {
  outline: 'border border-[var(--color-black)] bg-transparent text-[var(--color-black)]',
  primary: 'border border-transparent bg-[var(--color-action-primary)] text-[var(--color-black)]',
  dark: 'border border-transparent bg-[var(--color-black)] text-[var(--color-white)]',
};

function OutlineButton({
  children,
  type = 'button',
  variant = 'outline',
  onClick,
  disabled = false,
  className = '',
  ...buttonProps
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`body-3 inline-flex min-h-[44px] items-center justify-center rounded-[10px] px-5 py-[10px] tracking-[-0.16px] whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-40 ${variantClasses[variant] ?? variantClasses.outline} ${className}`}
      {...buttonProps}
    >
      {children}
    </button>
  );
}

export default OutlineButton;
