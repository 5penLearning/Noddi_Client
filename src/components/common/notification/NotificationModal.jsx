import NotificationItem from './NotificationItem';

import modalCloseIcon from '../../../assets/icons/notification/modal-close.svg';

function NotificationModal({
  isOpen,
  notifications,
  isLoading,
  respondingNotificationId,
  errorMessage,
  onClose,
  onDismiss,
  onDetail,
  onInvitationResponse,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <section className="flex h-[calc(100vh-40px)] max-h-[827px] w-[550px] flex-col overflow-hidden rounded-[10px] bg-[var(--color-white)] px-[22px] py-[23px]">
        <header className="flex shrink-0 items-center justify-between">
          <h2 className="subhead-1 text-[var(--color-black)]">알림함</h2>
          <button type="button" onClick={onClose} className="relative size-6">
            <span className="absolute top-0.5 left-0.5 size-5 rounded-[5px] border-[1.5px] border-[var(--color-gray-800)]" />
            <img
              src={modalCloseIcon}
              className="absolute top-[8.75px] left-[8.75px] size-[6.5px]"
            />
          </button>
        </header>

        <div className="mt-8 min-h-0 flex-1 [scrollbar-width:none] overflow-y-auto [&::-webkit-scrollbar]:hidden">
          {isLoading ? (
            <p className="body-4 py-12 text-center text-[var(--color-gray-500)]">
              알림을 불러오는 중입니다.
            </p>
          ) : errorMessage && notifications.length === 0 ? (
            <p className="body-4 py-12 text-center text-[var(--color-gray-500)]">{errorMessage}</p>
          ) : notifications.length === 0 ? (
            <p className="body-4 py-12 text-center text-[var(--color-gray-500)]">
              새로운 알림이 없습니다.
            </p>
          ) : (
            <div className="flex flex-col gap-7">
              {errorMessage && (
                <p className="body-4 text-center text-[var(--color-gray-500)]">{errorMessage}</p>
              )}
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  isResponding={respondingNotificationId === notification.id}
                  onDismiss={onDismiss}
                  onDetail={onDetail}
                  onInvitationResponse={onInvitationResponse}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default NotificationModal;
