import { useEffect, useState } from 'react';

import { createActionItem, deleteActionItem, updateActionItem } from '../../../api/actionItemApi';

import { getTeamMembers } from '../../../api/teams';

const INITIAL_FORM = {
  content: '',
  assigneeUserId: '',
  dueDate: '',
  status: 'PENDING',
};

const STATUS_OPTIONS = [
  {
    value: 'PENDING',
    label: '대기',
  },
  {
    value: 'IN_PROGRESS',
    label: '진행 중',
  },
  {
    value: 'COMPLETED',
    label: '완료',
  },
];

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13.5 6.5L17.5 10.5M4 20L8.2 19.2L19 8.4C20.1 7.3 20.1 5.5 19 4.4C17.9 3.3 16.1 3.3 15 4.4L4.2 15.2L4 20Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7H20M9 7V4H15V7M7 7L8 20H16L17 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function getStatusLabel(status) {
  return STATUS_OPTIONS.find((option) => option.value === status)?.label ?? '대기';
}

function getStatusClassName(status) {
  if (status === 'COMPLETED') {
    return 'bg-[#E8FFF4] text-[#16885B]';
  }

  if (status === 'IN_PROGRESS') {
    return 'bg-[#FFF8DE] text-[#9C7900]';
  }

  return 'bg-[#EFF3F1] text-[#59625F]';
}

function ActionItemForm({
  form,
  members,
  isSubmitting,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
  showStatus = false,
}) {
  return (
    <div className="rounded-xl border border-[#DCE3E0] bg-[#FAFBFB] p-4">
      <div>
        <label
          htmlFor="action-item-content"
          className="mb-2 block text-xs font-semibold text-[#59625F]"
        >
          할 일
        </label>

        <textarea
          id="action-item-content"
          name="content"
          rows={3}
          value={form.content}
          onChange={onChange}
          placeholder="회의 후 해야 할 일을 입력해주세요."
          className="w-full resize-none rounded-lg border border-[#DCE3E0] bg-white px-3 py-2.5 text-sm leading-6 text-[#303633] transition outline-none focus:border-[#31F5A0]"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="action-item-assignee"
          className="mb-2 block text-xs font-semibold text-[#59625F]"
        >
          담당자
        </label>

        <select
          id="action-item-assignee"
          name="assigneeUserId"
          value={form.assigneeUserId}
          onChange={onChange}
          className="h-10 w-full rounded-lg border border-[#DCE3E0] bg-white px-3 text-sm text-[#303633] transition outline-none focus:border-[#31F5A0]"
        >
          <option value="">담당자 없음</option>

          {members.map((member) => (
            <option key={member.userId} value={member.userId}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label
          htmlFor="action-item-due-date"
          className="mb-2 block text-xs font-semibold text-[#59625F]"
        >
          마감일
        </label>

        <input
          id="action-item-due-date"
          name="dueDate"
          type="date"
          value={form.dueDate}
          onChange={onChange}
          className="h-10 w-full rounded-lg border border-[#DCE3E0] bg-white px-3 text-sm text-[#303633] transition outline-none focus:border-[#31F5A0]"
        />
      </div>

      {showStatus && (
        <div className="mt-4">
          <label
            htmlFor="action-item-status"
            className="mb-2 block text-xs font-semibold text-[#59625F]"
          >
            상태
          </label>

          <select
            id="action-item-status"
            name="status"
            value={form.status}
            onChange={onChange}
            className="h-10 w-full rounded-lg border border-[#DCE3E0] bg-white px-3 text-sm text-[#303633] transition outline-none focus:border-[#31F5A0]"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onCancel}
          className="rounded-lg border border-[#DCE3E0] bg-white px-3 py-2 text-xs font-semibold text-[#59625F] transition hover:bg-[#F5F7F6] disabled:opacity-50"
        >
          취소
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={onSubmit}
          className="rounded-lg bg-[#101211] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#272B29] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? '저장 중...' : submitLabel}
        </button>
      </div>
    </div>
  );
}

function ActionItemPanel({ meetingId, teamId, actionItems = [], onRefresh }) {
  const [members, setMembers] = useState([]);

  const [isMembersLoading, setIsMembersLoading] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [creatingForm, setCreatingForm] = useState(INITIAL_FORM);

  const [editingActionItemId, setEditingActionItemId] = useState(null);

  const [editingForm, setEditingForm] = useState(INITIAL_FORM);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deletingActionItemId, setDeletingActionItemId] = useState(null);

  const [error, setError] = useState('');

  useEffect(() => {
    if (!teamId) {
      return;
    }

    let cancelled = false;

    const loadMembers = async () => {
      try {
        setIsMembersLoading(true);

        const response = await getTeamMembers(teamId);

        if (cancelled) {
          return;
        }

        setMembers(response);
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        console.error('Failed to get team members:', requestError);

        setMembers([]);
      } finally {
        if (!cancelled) {
          setIsMembersLoading(false);
        }
      }
    };

    loadMembers();

    return () => {
      cancelled = true;
    };
  }, [teamId]);

  const handleCreateChange = (event) => {
    const { name, value } = event.target;

    setCreatingForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError('');
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditingForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError('');
  };

  const handleOpenCreate = () => {
    setCreatingForm(INITIAL_FORM);

    setEditingActionItemId(null);

    setError('');
    setIsCreateOpen(true);
  };

  const handleCancelCreate = () => {
    setIsCreateOpen(false);
    setCreatingForm(INITIAL_FORM);
    setError('');
  };

  const handleCreate = async () => {
    const content = creatingForm.content.trim();

    if (!content) {
      setError('할 일 내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      await createActionItem(meetingId, {
        content,
        assigneeUserId: creatingForm.assigneeUserId ? Number(creatingForm.assigneeUserId) : null,
        dueDate: creatingForm.dueDate || null,
      });

      await onRefresh?.();

      setIsCreateOpen(false);
      setCreatingForm(INITIAL_FORM);
    } catch (requestError) {
      console.error('Failed to create action item:', requestError);

      setError(
        requestError?.response?.data?.message ??
          requestError?.message ??
          'Action Item을 추가하지 못했습니다.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (item) => {
    setIsCreateOpen(false);

    setEditingActionItemId(item.actionItemId);

    setEditingForm({
      content: item.content ?? '',
      assigneeUserId: item.assigneeUserId ? String(item.assigneeUserId) : '',
      dueDate: item.dueDate ?? '',
      status: item.status ?? 'PENDING',
    });

    setError('');
  };

  const handleCancelEdit = () => {
    setEditingActionItemId(null);

    setEditingForm(INITIAL_FORM);

    setError('');
  };

  const handleUpdate = async () => {
    const content = editingForm.content.trim();

    if (!content) {
      setError('할 일 내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      await updateActionItem(editingActionItemId, {
        content,
        assigneeUserId: editingForm.assigneeUserId ? Number(editingForm.assigneeUserId) : null,
        dueDate: editingForm.dueDate || null,
        status: editingForm.status,
      });

      await onRefresh?.();

      setEditingActionItemId(null);

      setEditingForm(INITIAL_FORM);
    } catch (requestError) {
      console.error('Failed to update action item:', requestError);

      setError(
        requestError?.response?.data?.message ??
          requestError?.message ??
          'Action Item을 수정하지 못했습니다.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (actionItemId) => {
    const confirmed = window.confirm('이 Action Item을 삭제할까요?');

    if (!confirmed) {
      return;
    }

    try {
      setDeletingActionItemId(actionItemId);

      setError('');

      await deleteActionItem(actionItemId);

      await onRefresh?.();
    } catch (requestError) {
      console.error('Failed to delete action item:', requestError);

      setError(
        requestError?.response?.data?.message ??
          requestError?.message ??
          'Action Item을 삭제하지 못했습니다.',
      );
    } finally {
      setDeletingActionItemId(null);
    }
  };

  return (
    <section className="sticky top-6 rounded-2xl border border-[#E5EAE8] bg-white p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-[#101211]">Action Items</h2>

          <span className="rounded-full bg-[#EFF3F1] px-2.5 py-1 text-xs font-semibold text-[#59625F]">
            {actionItems.length}
          </span>
        </div>

        {!isCreateOpen && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-[#101211] px-3 text-xs font-semibold text-white transition hover:bg-[#272B29]"
          >
            <PlusIcon />
            추가
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-[#FFF1F0] px-3 py-2 text-xs leading-5 text-[#D83D34]">
          {error}
        </div>
      )}

      {isMembersLoading && (
        <p className="mb-3 text-xs text-[#8A9490]">팀원 정보를 불러오고 있습니다.</p>
      )}

      {isCreateOpen && (
        <div className="mb-4">
          <ActionItemForm
            form={creatingForm}
            members={members}
            isSubmitting={isSubmitting}
            submitLabel="추가"
            onChange={handleCreateChange}
            onSubmit={handleCreate}
            onCancel={handleCancelCreate}
          />
        </div>
      )}

      {actionItems.length === 0 ? (
        !isCreateOpen && (
          <div className="rounded-xl bg-[#F7F9F8] px-4 py-8 text-center">
            <p className="text-sm font-medium text-[#59625F]">등록된 할 일이 없습니다.</p>

            <p className="mt-1 text-xs text-[#9AA39F]">회의 후 해야 할 일을 추가해보세요.</p>
          </div>
        )
      ) : (
        <div className="space-y-3">
          {actionItems.map((item) => {
            const isEditing = editingActionItemId === item.actionItemId;

            if (isEditing) {
              return (
                <ActionItemForm
                  key={item.actionItemId}
                  form={editingForm}
                  members={members}
                  isSubmitting={isSubmitting}
                  submitLabel="저장"
                  showStatus
                  onChange={handleEditChange}
                  onSubmit={handleUpdate}
                  onCancel={handleCancelEdit}
                />
              );
            }

            return (
              <div
                key={item.actionItemId}
                className="group rounded-xl border border-[#E8ECEA] p-4 transition hover:border-[#D5DDDA]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-start gap-2">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#31F5A0]" />

                    <p
                      className={`text-sm leading-6 font-medium ${
                        item.status === 'COMPLETED'
                          ? 'text-[#8A9490] line-through'
                          : 'text-[#303633]'
                      }`}
                    >
                      {item.content}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(item)}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-[#8A9490] transition hover:bg-[#F2F5F4] hover:text-[#303633]"
                      aria-label="Action Item 수정"
                    >
                      <EditIcon />
                    </button>

                    <button
                      type="button"
                      disabled={deletingActionItemId === item.actionItemId}
                      onClick={() => handleDelete(item.actionItemId)}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-[#8A9490] transition hover:bg-[#FFF1F0] hover:text-[#F64E42] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Action Item 삭제"
                    >
                      {deletingActionItemId === item.actionItemId ? <CloseIcon /> : <TrashIcon />}
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 pl-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClassName(
                      item.status,
                    )}`}
                  >
                    {getStatusLabel(item.status)}
                  </span>

                  {item.assigneeName && (
                    <span className="rounded-full bg-[#F4F6F5] px-2.5 py-1 text-[11px] text-[#6F7975]">
                      {item.assigneeName}
                    </span>
                  )}

                  {item.dueDate && (
                    <span className="rounded-full bg-[#F4F6F5] px-2.5 py-1 text-[11px] text-[#6F7975]">
                      ~ {item.dueDate}
                    </span>
                  )}
                </div>

                {item.isUncertain && (
                  <div className="mt-3 rounded-lg bg-[#FFF8DE] px-3 py-2 text-[11px] leading-5 text-[#9C7900]">
                    AI가 담당자나 기한을 정확히 판단하지 못한 항목입니다.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ActionItemPanel;
