function NotificationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6">
      <path
        d="M18 9.5a6 6 0 0 0-12 0c0 7-2.5 7-2.5 8.5h17C20.5 16.5 18 16.5 18 9.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 21h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function NotificationButton({ notificationCount = 0, onClick, className = '' }) {
  const displayedNotificationCount = notificationCount > 99 ? '99+' : notificationCount;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-10 w-[60px] shrink-0 items-center justify-center rounded-[10px] bg-[var(--color-background)] text-[#2b3f6c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gray-400)] ${className}`}
    >
      <NotificationIcon />
      {notificationCount > 0 && (
        <span className="absolute top-1 right-[11px] flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF4851] px-1 text-[10px] leading-none font-semibold text-[var(--color-white)]">
          {displayedNotificationCount}
        </span>
      )}
    </button>
  );
}

export default NotificationButton;
