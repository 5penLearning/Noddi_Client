import NotificationTypeIcon from './NotificationTypeIcon';

function NotificationItem({ notification, isRead, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(notification)}
      className={`flex w-full items-start gap-3 border-t border-[#E9EFED] p-5 text-left transition-colors hover:bg-[#F2F7F4] ${
        notification.type === 'invitation' ? 'min-h-[139px]' : 'min-h-[117px]'
      }`}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white p-1">
        <NotificationTypeIcon type={notification.type} />
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex w-full items-center justify-between gap-3">
          <strong className="truncate text-[20px] leading-[1.4] font-medium tracking-[-0.1px] text-[#0C0D0D]">
            {notification.scope}
          </strong>
          <span className="flex shrink-0 items-center gap-1 px-1">
            <time className="text-[16px] leading-[1.4] font-normal tracking-[-0.16px] text-[#707673]">
              {notification.createdAt}
            </time>
            {!isRead && <span className="size-[7px] rounded-full bg-[#31F5A0]" />}
          </span>
        </span>

        <span className="flex w-full flex-col text-[16px] leading-[1.4] tracking-[-0.16px]">
          <span className="truncate font-medium text-[#343836]">{notification.title}</span>
          <span className="line-clamp-2 font-normal text-[#707673]">{notification.message}</span>
        </span>
      </span>
    </button>
  );
}

export default NotificationItem;
