import { useEffect, useState } from 'react';

import {
  deleteActionItem,
  getMyActionItemsByTeam,
  updateActionItem,
} from '../../api/actionItemApi';
import { getApiErrorMessage } from '../../api/axios';
import { getTeamMembers } from '../../api/teams';
import todoLinkChainIcon from '../../assets/icons/home-todo/link-chain.svg';
import todoLinkLineIcon from '../../assets/icons/home-todo/link-line.svg';
import { ActionItemForm, EditIcon, TrashIcon } from '../feature/meeting/ActionItemPanel';

function TodoLinkIcon({ isCompleted }) {
  return (
    <span className={`relative block size-5 shrink-0 ${isCompleted ? 'opacity-30' : ''}`}>
      <span className="absolute top-[0.83px] left-[0.71px] flex size-[17.68px] items-center justify-center">
        <img src={todoLinkChainIcon} className="h-[16.67px] w-[8.33px] rotate-45" />
      </span>
      <img
        src={todoLinkLineIcon}
        className="absolute top-[8.2px] left-[7.8px] h-[1.5px] w-[6px] -rotate-45"
      />
    </span>
  );
}


const INITIAL_ACTION_ITEM_FORM = {
  content: '',
  assigneeUserId: '',
  dueDate: '',
  status: 'PENDING',
};

export default function TodoList({ description, meetings, onOpenMeetingRecord }) {
  const [projectTodos, setProjectTodos] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingForm, setEditingForm] = useState(INITIAL_ACTION_ITEM_FORM);
  const [editingMembers, setEditingMembers] = useState([]);
  const [isEditingMembersLoading, setIsEditingMembersLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isCurrentRequest = true;

    const loadActionItems = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const teamGroups = await getMyActionItemsByTeam();
        const projectGroupMap = new Map();

        teamGroups.forEach((teamGroup) => {
          const projectKey = String(teamGroup.projectId);
          const currentProject = projectGroupMap.get(projectKey) ?? {
            projectId: teamGroup.projectId,
            projectName: teamGroup.projectName,
            actionItems: [],
          };

          currentProject.actionItems.push(
            ...(teamGroup.actionItems ?? []).map((item) => ({
              ...item,
              projectId: teamGroup.projectId,
              projectName: teamGroup.projectName,
              teamId: teamGroup.teamId,
              teamName: teamGroup.teamName,
            })),
          );
          projectGroupMap.set(projectKey, currentProject);
        });

        const nextProjectTodos = [...projectGroupMap.values()];

        if (isCurrentRequest) {
          setProjectTodos(nextProjectTodos);
          setSelectedProjectId((currentProjectId) => {
            const hasCurrentProject = nextProjectTodos.some(
              (project) => String(project.projectId) === String(currentProjectId),
            );

            return hasCurrentProject
              ? currentProjectId
              : (nextProjectTodos[0]?.projectId ?? null);
          });
        }
      } catch (error) {
        if (isCurrentRequest) {
          setProjectTodos([]);
          setErrorMessage(getApiErrorMessage(error, '할 일 목록을 불러오지 못했습니다.'));
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      }
    };

    loadActionItems();

    return () => {
      isCurrentRequest = false;
    };
  }, []);

  const toggleTodo = async (actionItem) => {
    const nextStatus = actionItem.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';

    try {
      setUpdatingItemId(actionItem.actionItemId);
      setErrorMessage('');
      setProjectTodos((currentProjects) =>
        currentProjects.map((project) => ({
          ...project,
          actionItems: project.actionItems.map((item) =>
            item.actionItemId === actionItem.actionItemId
              ? { ...item, status: nextStatus }
              : item,
          ),
        })),
      );

      await updateActionItem(actionItem.actionItemId, {
        content: actionItem.content,
        assigneeUserId: actionItem.assigneeUserId,
        dueDate: actionItem.dueDate,
        status: nextStatus,
      });
    } catch (error) {
      setProjectTodos((currentProjects) =>
        currentProjects.map((project) => ({
          ...project,
          actionItems: project.actionItems.map((item) =>
            item.actionItemId === actionItem.actionItemId
              ? { ...item, status: actionItem.status }
              : item,
          ),
        })),
      );
      setErrorMessage(getApiErrorMessage(error, '할 일 상태를 변경하지 못했습니다.'));
    } finally {
      setUpdatingItemId(null);
    }
  };

  const openEditModal = async (actionItem) => {
    setEditingItem(actionItem);
    setEditingForm({
      content: actionItem.content ?? '',
      assigneeUserId: actionItem.assigneeUserId ? String(actionItem.assigneeUserId) : '',
      dueDate: actionItem.dueDate ?? '',
      status: actionItem.status ?? 'PENDING',
    });
    setEditingMembers([]);
    setErrorMessage('');

    const teamId = actionItem.teamId;

    if (!teamId) return;

    try {
      setIsEditingMembersLoading(true);
      const members = await getTeamMembers(teamId);
      setEditingMembers(members);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, '담당자 목록을 불러오지 못했습니다.'));
    } finally {
      setIsEditingMembersLoading(false);
    }
  };

  const closeEditModal = () => {
    if (updatingItemId) return;

    setEditingItem(null);
    setEditingForm(INITIAL_ACTION_ITEM_FORM);
    setEditingMembers([]);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditingForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
    setErrorMessage('');
  };

  const handleUpdateTodo = async () => {
    const content = editingForm.content.trim();

    if (!editingItem || !content) {
      setErrorMessage('할 일 내용을 입력해주세요.');
      return;
    }

    try {
      setUpdatingItemId(editingItem.actionItemId);
      setErrorMessage('');
      await updateActionItem(editingItem.actionItemId, {
        content,
        assigneeUserId: editingForm.assigneeUserId ? Number(editingForm.assigneeUserId) : null,
        dueDate: editingForm.dueDate || null,
        status: editingForm.status,
      });
      setProjectTodos((currentProjects) =>
        currentProjects.map((project) => ({
          ...project,
          actionItems: project.actionItems.map((item) =>
            item.actionItemId === editingItem.actionItemId
              ? {
                  ...item,
                  content,
                  assigneeUserId: editingForm.assigneeUserId
                    ? Number(editingForm.assigneeUserId)
                    : null,
                  dueDate: editingForm.dueDate || null,
                  status: editingForm.status,
                }
              : item,
          ),
        })),
      );
      setEditingItem(null);
      setEditingForm(INITIAL_ACTION_ITEM_FORM);
      setEditingMembers([]);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, '할 일을 수정하지 못했습니다.'));
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleDeleteTodo = async (actionItem) => {
    if (!window.confirm('이 할 일을 삭제할까요?')) return;

    try {
      setDeletingItemId(actionItem.actionItemId);
      setErrorMessage('');
      await deleteActionItem(actionItem.actionItemId);
      setProjectTodos((currentProjects) =>
        currentProjects.map((project) => ({
          ...project,
          actionItems: project.actionItems.filter(
            (item) => item.actionItemId !== actionItem.actionItemId,
          ),
        })),
      );
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, '할 일을 삭제하지 못했습니다.'));
    } finally {
      setDeletingItemId(null);
    }
  };

  const selectedProject =
    projectTodos.find(
      (project) => String(project.projectId) === String(selectedProjectId),
    ) ?? projectTodos[0];
  const todoItems = selectedProject?.actionItems ?? [];
  const visibleItems = todoItems.slice(0, 10);

  return (
    <section className="flex h-[311px] min-h-0 flex-col gap-3 overflow-hidden rounded-[10px] bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-end gap-2">
          <h2 className="text-[20px] leading-[1.3] font-semibold text-black">To-do list</h2>
          <p className="text-[16px] leading-[1.4] font-medium tracking-[-0.16px] text-[#8E9592]">
            {description}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsEditing((currentValue) => !currentValue)}
          aria-pressed={isEditing}
          className="shrink-0 text-[14px] leading-[1.4] tracking-[-0.21px] text-[#525654] underline"
        >
          편집하기
        </button>
      </div>

      <div className="flex shrink-0 [scrollbar-width:none] gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {projectTodos.map((project) => {
          const isSelected = String(project.projectId) === String(selectedProject?.projectId);

          return (
            <button
              key={project.projectId}
              type="button"
              onClick={() => setSelectedProjectId(project.projectId)}
              className={`h-[30px] shrink-0 rounded-[30px] px-3 py-1.5 text-[14px] leading-[1.3] tracking-[-0.28px] ${
                isSelected ? 'bg-[#101211] text-white' : 'bg-[#F2F7F4] text-[#343836]'
              }`}
            >
              {project.projectName}
            </button>
          );
        })}
      </div>

      <div className="relative grid min-h-0 flex-1 grid-flow-col grid-cols-2 grid-rows-5 gap-x-[60px] gap-y-4">
        {isLoading && (
          <p className="absolute inset-0 flex items-center justify-center text-[14px] text-[#8E9592]">
            할 일 목록을 불러오는 중입니다.
          </p>
        )}
        {!isLoading && errorMessage && todoItems.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center text-[14px] text-[#8E9592]">
            {errorMessage}
          </p>
        )}
        {!isLoading && !errorMessage && projectTodos.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center text-[14px] text-[#8E9592]">
            참여 중인 프로젝트가 없습니다.
          </p>
        )}
        {!isLoading && !errorMessage && projectTodos.length > 0 && todoItems.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center text-[14px] text-[#8E9592]">
            선택한 프로젝트에 미완료 할 일이 없습니다.
          </p>
        )}
        {!isLoading &&
          visibleItems.map((item) => {
            const isCompleted = item.status === 'COMPLETED';
            const matchingMeeting = meetings.find(
              (meeting) => String(meeting.meetingId) === String(item.meetingId),
            );

            return (
              <div key={item.actionItemId} className="flex h-6 min-w-0 items-center gap-2">
                <button
                  type="button"
                  disabled={updatingItemId === item.actionItemId}
                  onClick={() => toggleTodo(item)}
                  className={`relative size-6 shrink-0 rounded-[5px] ${
                    isCompleted ? 'bg-[#11E489]' : 'border-[1.5px] border-[#2B3F6C] bg-white'
                  } disabled:opacity-60`}
                >
                  {isCompleted && (
                    <span className="absolute top-[3px] left-[7px] h-[11px] w-[7px] rotate-45 border-r-2 border-b-2 border-white" />
                  )}
                </button>
                <div className="flex min-w-0 flex-1 items-center gap-1">
                  <span
                    className={`truncate text-[14px] leading-[1.4] tracking-[-0.21px] ${
                      isCompleted ? 'text-[#A9B0AD] line-through' : 'text-[#343836]'
                    }`}
                  >
                    {item.content}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenMeetingRecord(item, matchingMeeting)}
                    className="shrink-0"
                  >
                    <TodoLinkIcon isCompleted={isCompleted} />
                  </button>
                </div>
                {isEditing && (
                  <div className="ml-auto flex shrink-0 items-center gap-1 text-[#707673]">
                    <button type="button" onClick={() => openEditModal(item)} className="size-5">
                      <EditIcon />
                    </button>
                    <button
                      type="button"
                      disabled={deletingItemId === item.actionItemId}
                      onClick={() => handleDeleteTodo(item)}
                      className="size-5 disabled:opacity-40"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        {errorMessage && todoItems.length > 0 && (
          <p className="absolute right-0 bottom-[-18px] text-[12px] text-[var(--color-red)]">
            {errorMessage}
          </p>
        )}
      </div>

      {editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeEditModal();
          }}
        >
          <div className="w-[440px] rounded-[16px] bg-white p-5 shadow-xl">
            <h3 className="mb-4 text-[20px] leading-[1.3] font-semibold text-black">할 일 수정</h3>
            {isEditingMembersLoading && (
              <p className="mb-3 text-[12px] text-[var(--color-gray-500)]">
                담당자 목록을 불러오는 중입니다.
              </p>
            )}
            {errorMessage && (
              <p className="mb-3 text-[12px] text-[var(--color-red)]">{errorMessage}</p>
            )}
            <ActionItemForm
              form={editingForm}
              members={editingMembers}
              isSubmitting={Boolean(updatingItemId)}
              submitLabel="저장"
              showStatus
              onChange={handleEditChange}
              onSubmit={handleUpdateTodo}
              onCancel={closeEditModal}
            />
          </div>
        </div>
      )}
    </section>
  );
}
