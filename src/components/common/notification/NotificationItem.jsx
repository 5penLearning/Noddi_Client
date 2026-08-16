import NotificationTypeIcon from './NotificationTypeIcon';

import itemCloseIcon from '../../../assets/icons/notification/item-close.svg';

function NotificationItem({
  notification,
  isResponding,
  onDismiss,
  onDetail,
  onInvitationResponse,
  className = '',
}) {
  return (
    <article className={`flex w-full items-start justify-between ${className}`}>
      <div className="flex w-[460px] flex-col">
        <div className="flex w-full items-center justify-between pr-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="size-6 shrink-0">
              <NotificationTypeIcon type={notification.type} />
            </span>
            <p className="body-2 truncate tracking-[-0.1px] text-[var(--color-gray-600)]">
              [{notification.scope}]
            </p>
          </div>
          <time className="body-4 ml-3 shrink-0 tracking-[-0.16px] text-[var(--color-gray-400)]">
            {notification.createdAt}
          </time>
        </div>

        <div className="flex flex-col items-start gap-[10px] pl-[34px]">
          <p className="body-2 line-clamp-2 max-h-14 w-full tracking-[-0.1px] text-[var(--color-black)]">
            {notification.message}
          </p>
          {notification.type === 'invitation' ? (
            <div className="flex gap-2">
              <button
                type="button"
                disabled={isResponding}
                onClick={() => onInvitationResponse?.(notification, false)}
                className="flex h-11 w-[110px] items-center justify-center rounded-[10px] border border-[var(--color-gray-300)] bg-[var(--color-white)] text-[16px] leading-[1.3] font-semibold text-[var(--color-gray-700)] disabled:opacity-40"
              >
                거절
              </button>
              <button
                type="button"
                disabled={isResponding}
                onClick={() => onInvitationResponse?.(notification, true)}
                className="flex h-11 w-[110px] items-center justify-center rounded-[10px] bg-[var(--color-gray-900)] text-[16px] leading-[1.3] font-semibold text-[var(--color-white)] disabled:opacity-40"
              >
                {isResponding ? '처리 중' : '수락'}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onDetail?.(notification)}
              className="flex h-11 w-[110px] items-center justify-center rounded-[10px] bg-[var(--color-gray-100)] text-[16px] leading-[1.3] font-semibold text-[var(--color-gray-700)]"
            >
              자세히보기
            </button>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDismiss?.(notification.id)}
        className="relative size-6 shrink-0"
      >
        <img src={itemCloseIcon} className="absolute top-[7.25px] left-[7.25px] size-[9.5px]" />
      </button>
    </article>
  );
}

export default NotificationItem;
