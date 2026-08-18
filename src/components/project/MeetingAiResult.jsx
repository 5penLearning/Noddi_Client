import { useEffect, useMemo, useState } from 'react';

import { createActionItem, deleteActionItem, updateActionItem } from '../../api/actionItemApi';

import { ActionItemForm, EditIcon, TrashIcon } from '../feature/meeting/ActionItemPanel';
import { ProfileChip } from './MeetingParticipants';

function EmptyText({ children }) {
  return <p className="text-[14px] text-[var(--color-gray-500)]">{children}</p>;
}

function MeetingAiResult({
  summaryData,
  isEditing,
  editForm,
  onSummaryChange,
  onDecisionChange,
  onAddDecision,
  onRemoveDecision,
  meetingId,
  participants = [],
}) {
  const decisions = summaryData?.decisions ?? [];
  const [actionItems, setActionItems] = useState(summaryData?.actionItems ?? []);
  const [selectedAssigneeKey, setSelectedAssigneeKey] = useState('');
  const [updatingActionItemId, setUpdatingActionItemId] = useState(null);
  const [actionItemErrorMessage, setActionItemErrorMessage] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState({ content: '', assigneeUserId: '', dueDate: '' });
  const [editingActionItem, setEditingActionItem] = useState(null);
  const [editActionForm, setEditActionForm] = useState({
    content: '',
    assigneeUserId: '',
    dueDate: '',
    status: 'PENDING',
  });
  const [deletingActionItemId, setDeletingActionItemId] = useState(null);
  const assignees = useMemo(() => {
    const assigneeMap = new Map();

    actionItems.forEach((item) => {
      const key = String(item.assigneeUserId ?? 'unassigned');

      if (!assigneeMap.has(key)) {
        assigneeMap.set(key, {
          key,
          name: item.assigneeName ?? '담당자 미정',
        });
      }
    });

    return [...assigneeMap.values()];
  }, [actionItems]);
  const visibleActionItems = actionItems.filter(
    (item) => String(item.assigneeUserId ?? 'unassigned') === selectedAssigneeKey,
  );

  useEffect(() => {
    setActionItems(summaryData?.actionItems ?? []);
  }, [summaryData?.actionItems]);

  useEffect(() => {
    if (!isEditing) {
      setIsCreateOpen(false);
      setEditingActionItem(null);
    }
  }, [isEditing]);

  useEffect(() => {
    if (assignees.length === 0) {
      setSelectedAssigneeKey('');
      return;
    }

    if (!assignees.some((assignee) => assignee.key === selectedAssigneeKey)) {
      setSelectedAssigneeKey(assignees[0].key);
    }
  }, [assignees, selectedAssigneeKey]);

  const toggleActionItem = async (actionItem) => {
    const nextStatus = actionItem.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';

    try {
      setUpdatingActionItemId(actionItem.actionItemId);
      setActionItemErrorMessage('');
      await updateActionItem(actionItem.actionItemId, {
        content: actionItem.content,
        assigneeUserId: actionItem.assigneeUserId,
        dueDate: actionItem.dueDate,
        status: nextStatus,
      });
      setActionItems((currentItems) =>
        currentItems.map((item) =>
          item.actionItemId === actionItem.actionItemId ? { ...item, status: nextStatus } : item,
        ),
      );
    } catch (error) {
      setActionItemErrorMessage(
        error?.response?.data?.message ?? error?.message ?? '할 일 상태를 변경하지 못했습니다.',
      );
    } finally {
      setUpdatingActionItemId(null);
    }
  };

  const openCreateForm = () => {
    setCreateForm({
      content: '',
      assigneeUserId: selectedAssigneeKey === 'unassigned' ? '' : selectedAssigneeKey,
      dueDate: '',
    });
    setActionItemErrorMessage('');
    setIsCreateOpen(true);
  };

  const handleCreateActionItem = async () => {
    const content = createForm.content.trim();

    if (!content) {
      setActionItemErrorMessage('할 일 내용을 입력해주세요.');
      return;
    }

    try {
      setIsCreating(true);
      setActionItemErrorMessage('');
      const assigneeUserId = createForm.assigneeUserId ? Number(createForm.assigneeUserId) : null;
      const response = await createActionItem(meetingId, {
        content,
        assigneeUserId,
        dueDate: createForm.dueDate || null,
      });
      const actionItemId = response?.result ?? response;
      const assignee = participants.find(
        (participant) => Number(participant.userId) === assigneeUserId,
      );

      setActionItems((currentItems) => [
        ...currentItems,
        {
          actionItemId,
          meetingId: Number(meetingId),
          content,
          assigneeUserId,
          assigneeName: assignee?.name ?? '담당자 미정',
          dueDate: createForm.dueDate || null,
          status: 'PENDING',
        },
      ]);
      setSelectedAssigneeKey(String(assigneeUserId ?? 'unassigned'));
      setCreateForm({ content: '', assigneeUserId: '', dueDate: '' });
      setIsCreateOpen(false);
    } catch (error) {
      setActionItemErrorMessage(
        error?.response?.data?.message ?? error?.message ?? '할 일을 추가하지 못했습니다.',
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateFormChange = (event) => {
    const { name, value } = event.target;

    setCreateForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
    setActionItemErrorMessage('');
  };

  const openEditForm = (actionItem) => {
    setIsCreateOpen(false);
    setEditingActionItem(actionItem);
    setEditActionForm({
      content: actionItem.content ?? '',
      assigneeUserId: actionItem.assigneeUserId ? String(actionItem.assigneeUserId) : '',
      dueDate: actionItem.dueDate ?? '',
      status: actionItem.status ?? 'PENDING',
    });
    setActionItemErrorMessage('');
  };

  const handleEditActionFormChange = (event) => {
    const { name, value } = event.target;

    setEditActionForm((currentForm) => ({ ...currentForm, [name]: value }));
    setActionItemErrorMessage('');
  };

  const handleUpdateActionItem = async () => {
    const content = editActionForm.content.trim();

    if (!content) {
      setActionItemErrorMessage('할 일 내용을 입력해주세요.');
      return;
    }

    try {
      setUpdatingActionItemId(editingActionItem.actionItemId);
      setActionItemErrorMessage('');
      const assigneeUserId = editActionForm.assigneeUserId
        ? Number(editActionForm.assigneeUserId)
        : null;
      await updateActionItem(editingActionItem.actionItemId, {
        content,
        assigneeUserId,
        dueDate: editActionForm.dueDate || null,
        status: editActionForm.status,
      });
      const assignee = participants.find(
        (participant) => Number(participant.userId) === assigneeUserId,
      );

      setActionItems((currentItems) =>
        currentItems.map((item) =>
          item.actionItemId === editingActionItem.actionItemId
            ? {
                ...item,
                content,
                assigneeUserId,
                assigneeName: assignee?.name ?? '담당자 미정',
                dueDate: editActionForm.dueDate || null,
                status: editActionForm.status,
              }
            : item,
        ),
      );
      setSelectedAssigneeKey(String(assigneeUserId ?? 'unassigned'));
      setEditingActionItem(null);
    } catch (error) {
      setActionItemErrorMessage(
        error?.response?.data?.message ?? error?.message ?? '할 일을 수정하지 못했습니다.',
      );
    } finally {
      setUpdatingActionItemId(null);
    }
  };

  const handleDeleteActionItem = async (actionItem) => {
    if (!window.confirm('이 할 일을 삭제할까요?')) return;

    try {
      setDeletingActionItemId(actionItem.actionItemId);
      setActionItemErrorMessage('');
      await deleteActionItem(actionItem.actionItemId);
      setActionItems((currentItems) =>
        currentItems.filter((item) => item.actionItemId !== actionItem.actionItemId),
      );
    } catch (error) {
      setActionItemErrorMessage(
        error?.response?.data?.message ?? error?.message ?? '할 일을 삭제하지 못했습니다.',
      );
    } finally {
      setDeletingActionItemId(null);
    }
  };

  return (
    <section className="min-w-0">
      <div>
        <h2 className="text-[16px] leading-[1.3] font-semibold text-[var(--color-gray-900)]">
          AI 회의 요약
        </h2>
        {isEditing ? (
          <textarea
            value={editForm.summary}
            onChange={(event) => onSummaryChange(event.target.value)}
            rows={7}
            placeholder="회의 요약을 입력해주세요."
            className="mt-[15px] w-full resize-y rounded-[10px] border border-[var(--color-gray-300)] bg-[var(--color-gray-50)] px-4 py-3 text-[14px] leading-[1.4] text-[var(--color-gray-800)] outline-none focus:border-[var(--color-primary)] focus:bg-white"
          />
        ) : summaryData?.summary ? (
          <p className="mt-[15px] text-[14px] leading-[1.4] tracking-[-0.21px] whitespace-pre-wrap text-[var(--color-gray-700)]">
            {summaryData.summary}
          </p>
        ) : (
          <div className="mt-[15px]">
            <EmptyText>생성된 AI 회의 요약이 없습니다.</EmptyText>
          </div>
        )}

        <h2 className="mt-8 text-[16px] leading-[1.3] font-semibold text-[var(--color-gray-900)]">
          주요 결정 사항
        </h2>
        {isEditing ? (
          <div className="mt-3 space-y-2">
            {editForm.decisions.map((decision, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  value={decision}
                  onChange={(event) => onDecisionChange(index, event.target.value)}
                  placeholder="결정 사항을 입력해주세요."
                  className="h-10 min-w-0 flex-1 rounded-[8px] border border-[var(--color-gray-300)] bg-[var(--color-gray-50)] px-3 text-[14px] text-[var(--color-gray-800)] outline-none focus:border-[var(--color-primary)] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => onRemoveDecision(index)}
                  className="size-8 shrink-0 text-[18px] text-[var(--color-gray-500)]"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={onAddDecision}
              className="text-[13px] text-[var(--color-gray-600)]"
            >
              + 항목 추가
            </button>
          </div>
        ) : decisions.length > 0 ? (
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-[14px] leading-[1.4] tracking-[-0.21px] text-[var(--color-gray-800)]">
            {decisions.map((decision, index) => (
              <li key={`${decision}-${index}`}>{decision}</li>
            ))}
          </ol>
        ) : (
          <div className="mt-3">
            <EmptyText>등록된 결정 사항이 없습니다.</EmptyText>
          </div>
        )}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[16px] leading-[1.3] font-semibold text-[var(--color-gray-900)]">
            담당자별 할 일
          </h2>
          {isEditing && (
            <button
              type="button"
              onClick={openCreateForm}
              className="text-[13px] text-[var(--color-gray-600)]"
            >
              + 항목 추가
            </button>
          )}
        </div>
        <div className="mt-4 flex [scrollbar-width:none] gap-1 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
          {assignees.length > 0 ? (
            assignees.map((assignee) => (
              <button
                key={assignee.key}
                type="button"
                onClick={() => setSelectedAssigneeKey(assignee.key)}
              >
                <ProfileChip
                  participant={{ name: assignee.name }}
                  muted={selectedAssigneeKey !== assignee.key}
                />
              </button>
            ))
          ) : (
            <EmptyText>등록된 할 일이 없습니다.</EmptyText>
          )}
        </div>

        {visibleActionItems.length > 0 && (
          <div className="mt-3 space-y-3">
            {visibleActionItems.map((item) => {
              const isCompleted = item.status === 'COMPLETED';

              return (
                <div key={item.actionItemId} className="flex w-1/2 min-w-0 items-center gap-2">
                  <button
                    type="button"
                    disabled={updatingActionItemId === item.actionItemId}
                    onClick={() => toggleActionItem(item)}
                    className={`flex size-6 shrink-0 items-center justify-center rounded-[5px] ${
                      isCompleted
                        ? 'bg-[var(--color-primary)]'
                        : 'border-[1.5px] border-[#2B3F6C] bg-white'
                    } disabled:opacity-50`}
                  >
                    {isCompleted && (
                      <span className="h-[11px] w-[7px] -translate-y-px rotate-45 border-r-2 border-b-2 border-white" />
                    )}
                  </button>
                  <span
                    className={`min-w-0 flex-1 truncate text-[14px] leading-[1.4] tracking-[-0.21px] ${
                      isCompleted
                        ? 'text-[var(--color-gray-400)] line-through'
                        : 'text-[var(--color-gray-800)]'
                    }`}
                  >
                    {item.content}
                  </span>
                  <div className="ml-auto flex shrink-0 items-center gap-1">
                    {item.dueDate && (
                      <span className="mr-1 shrink-0 text-[12px] text-[var(--color-gray-500)]">
                        {item.dueDate}
                      </span>
                    )}
                    {isEditing && (
                      <>
                        <button
                          type="button"
                          onClick={() => openEditForm(item)}
                          className="flex size-7 items-center justify-center text-[var(--color-gray-500)]"
                        >
                          <EditIcon />
                        </button>
                        <button
                          type="button"
                          disabled={deletingActionItemId === item.actionItemId}
                          onClick={() => handleDeleteActionItem(item)}
                          className="flex size-7 items-center justify-center text-[var(--color-gray-500)] disabled:opacity-40"
                        >
                          <TrashIcon />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {actionItemErrorMessage && (
          <p className="mt-3 text-[12px] text-[var(--color-red)]">{actionItemErrorMessage}</p>
        )}
      </div>

      {isEditing && isCreateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsCreateOpen(false);
          }}
        >
          <div className="w-[440px] rounded-[16px] bg-white p-5 shadow-xl">
            <h3 className="mb-4 text-[20px] leading-[1.3] font-semibold text-black">할 일 추가</h3>
            {actionItemErrorMessage && (
              <p className="mb-3 text-[12px] text-[var(--color-red)]">{actionItemErrorMessage}</p>
            )}
            <ActionItemForm
              form={createForm}
              members={participants}
              isSubmitting={isCreating}
              submitLabel="추가"
              onChange={handleCreateFormChange}
              onSubmit={handleCreateActionItem}
              onCancel={() => setIsCreateOpen(false)}
            />
          </div>
        </div>
      )}

      {isEditing && editingActionItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setEditingActionItem(null);
          }}
        >
          <div className="w-[440px] rounded-[16px] bg-white p-5 shadow-xl">
            <h3 className="mb-4 text-[20px] leading-[1.3] font-semibold text-black">할 일 수정</h3>
            {actionItemErrorMessage && (
              <p className="mb-3 text-[12px] text-[var(--color-red)]">{actionItemErrorMessage}</p>
            )}
            <ActionItemForm
              form={editActionForm}
              members={participants}
              isSubmitting={updatingActionItemId === editingActionItem.actionItemId}
              submitLabel="저장"
              showStatus
              onChange={handleEditActionFormChange}
              onSubmit={handleUpdateActionItem}
              onCancel={() => setEditingActionItem(null)}
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default MeetingAiResult;
