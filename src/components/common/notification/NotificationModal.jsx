import { useMemo, useState } from 'react';

import NotificationItem from './NotificationItem';

const notificationTabs = [
  { id: 'all', label: '전체' },
  { id: 'unread', label: '읽지 않음' },
  { id: 'project', label: '프로젝트' },
];

function NotificationModal({
  isOpen,
  notifications,
  isLoading,
  errorMessage,
  onClose,
  onNotificationClick,
}) {
  const [selectedTab, setSelectedTab] = useState('all');
  const [readNotificationIds, setReadNotificationIds] = useState([]);

  const unreadCount = notifications.filter(
    (notification) => !readNotificationIds.includes(notification.id),
  ).length;

  const visibleNotifications = useMemo(() => {
    if (selectedTab === 'unread') {
      return notifications.filter((notification) => !readNotificationIds.includes(notification.id));
    }

    if (selectedTab === 'project') {
      return notifications.filter(
        (notification) =>
          notification.invitationKind === 'project' || notification.type === 'project',
      );
    }

    return notifications;
  }, [notifications, readNotificationIds, selectedTab]);

  if (!isOpen) return null;

  const handleNotificationClick = (notification) => {
    setReadNotificationIds((currentIds) =>
      currentIds.includes(notification.id) ? currentIds : [...currentIds, notification.id],
    );
    onNotificationClick?.(notification);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/10"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <section className="absolute top-[70px] right-[10px] flex h-[770px] max-h-[calc(100vh-80px)] w-[450px] flex-col overflow-hidden rounded-[10px] bg-white py-[23px] shadow-[0_21px_47px_rgba(0,0,0,0.10),0_85px_85px_rgba(0,0,0,0.09),0_191px_114px_rgba(0,0,0,0.05)]">
        <header className="flex shrink-0 flex-col gap-3 px-5">
          <h2 className="text-[24px] leading-[1.3] font-semibold tracking-[0.24px] text-black">
            알림함
          </h2>

          <div className="flex h-8 items-center gap-1">
            {notificationTabs.map((tab) => {
              const isSelected = selectedTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex h-[30px] items-center justify-center rounded-[10px] bg-[#F2F7F4] px-3 text-[14px] leading-[1.3] font-normal tracking-[-0.28px] ${
                    isSelected ? 'h-8 border border-[#31F5A0] text-[#11E489]' : 'text-[#343836]'
                  }`}
                >
                  {tab.label}
                  {tab.id === 'unread' && unreadCount > 0 && (
                    <span className="ml-[10px] flex h-4 min-w-4 items-center justify-center rounded-[30px] bg-[#6EFFC0] px-0.5 text-[12px] leading-[1.3] font-medium tracking-[-0.24px] text-[#101211]">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </header>

        <div className="mt-7 min-h-0 flex-1 [scrollbar-width:none] overflow-y-auto [&::-webkit-scrollbar]:hidden">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-[16px] leading-[1.4] text-[#AEB5B2]">알림을 불러오는 중입니다.</p>
            </div>
          ) : errorMessage && notifications.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-[16px] leading-[1.4] text-[#AEB5B2]">{errorMessage}</p>
            </div>
          ) : visibleNotifications.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-[16px] leading-[1.4] text-[#AEB5B2]">새로운 알림이 없습니다.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {errorMessage && (
                <p className="px-5 pb-3 text-center text-[14px] text-[#707673]">{errorMessage}</p>
              )}
              {visibleNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  isRead={readNotificationIds.includes(notification.id)}
                  onClick={handleNotificationClick}
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
