import NotificationTypeIcon from './NotificationTypeIcon';

function NotificationItem({ notification, onClick, onHide }) {
  return (
    <div
      className={`relative flex w-full items-start gap-3 border-t border-[#E9EFED] p-5 text-left transition-colors hover:bg-[#F2F7F4] ${
        notification.type?.includes('INVITATION') ? 'min-h-[139px]' : 'min-h-[117px]'
      }`}
    >
      <button
        type="button"
        onClick={() => onClick?.(notification)}
        className="absolute inset-0 z-0"
        aria-label="알림 자세히 보기"
      />

      <span className="pointer-events-none z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-white p-1">
        <NotificationTypeIcon type={notification.type} />
      </span>

      <span className="pointer-events-none z-10 flex min-w-0 flex-1 flex-col gap-1 pr-6">
        <span className="flex w-full items-center justify-between gap-3">
          <strong className="truncate text-[20px] leading-[1.4] font-medium tracking-[-0.1px] text-[#0C0D0D]">
            {notification.scope}
          </strong>
          <span className="flex shrink-0 items-center gap-1 px-1">
            <time className="text-[16px] leading-[1.4] font-normal tracking-[-0.16px] text-[#707673]">
              {notification.createdAt}
            </time>
            {!notification.read && <span className="size-[7px] rounded-full bg-[#31F5A0]" />}
          </span>
        </span>

        <span className="flex w-full flex-col text-[16px] leading-[1.4] tracking-[-0.16px]">
          <span className="line-clamp-2 font-medium text-[#343836]">{notification.title}</span>
          {notification.detail && (
            <span className="line-clamp-2 font-normal text-[#707673]">
              {notification.detail}
            </span>
          )}
        </span>
      </span>

      <button
        type="button"
        onClick={() => onHide?.(notification)}
        className="absolute top-5 right-3 z-20 flex size-5 items-center justify-center text-[18px] leading-none text-[#A9B0AD]"
        aria-label="알림 숨기기"
      >
        ×
      </button>
    </div>
  );
}

export default NotificationItem;
