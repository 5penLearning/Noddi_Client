import { getUserId } from '../api/axios';

const getStorageKey = () => `noddi-completed-action-items-${getUserId() ?? 'anonymous'}`;

export const getStoredCompletedActionItems = () => {
  try {
    const storedItems = JSON.parse(localStorage.getItem(getStorageKey()) ?? '[]');
    const legacyStorageKey = `noddi-home-completed-action-items-${getUserId() ?? 'anonymous'}`;
    const legacyItems = JSON.parse(
      localStorage.getItem(legacyStorageKey) ?? '[]',
    );

    const mergedItems = [...(Array.isArray(storedItems) ? storedItems : [])];

    if (Array.isArray(legacyItems)) {
      legacyItems.forEach((item) => {
        if (!mergedItems.some((storedItem) => storedItem.actionItemId === item.actionItemId)) {
          mergedItems.push(item);
        }
      });
    }

    if (Array.isArray(legacyItems) && legacyItems.length > 0) {
      localStorage.setItem(getStorageKey(), JSON.stringify(mergedItems));
      localStorage.removeItem(legacyStorageKey);
    }

    return mergedItems;
  } catch {
    return [];
  }
};

export const syncStoredCompletedActionItem = (actionItem) => {
  const storedItems = getStoredCompletedActionItems().filter(
    (item) => item.actionItemId !== actionItem.actionItemId,
  );

  localStorage.setItem(
    getStorageKey(),
    JSON.stringify(actionItem.status === 'COMPLETED' ? [...storedItems, actionItem] : storedItems),
  );
};

export const removeStoredCompletedActionItem = (actionItemId) => {
  const storedItems = getStoredCompletedActionItems().filter(
    (item) => item.actionItemId !== actionItemId,
  );

  localStorage.setItem(getStorageKey(), JSON.stringify(storedItems));
};
