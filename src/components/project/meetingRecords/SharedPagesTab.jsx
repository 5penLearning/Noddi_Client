import SharedMemoDetail from '../SharedMemoDetail';
import SharedMemoList from '../SharedMemoList';

function SharedPagesTab({
  memos,
  keyword,
  selectedMemoId,
  selectedMemo,
  projectName,
  teamName,
  isListLoading,
  isDetailLoading,
  isCreating,
  isUpdating,
  deletingMemoId,
  listErrorMessage,
  detailErrorMessage,
  onKeywordChange,
  onSelect,
  onCreate,
  onUpdate,
  onDelete,
}) {
  return (
    <main className="grid min-h-0 flex-1 grid-cols-[428px_minmax(0,1fr)] gap-6 bg-transparent">
      <SharedMemoList
        memos={memos}
        keyword={keyword}
        selectedMemoId={selectedMemoId}
        isLoading={isListLoading}
        isCreating={isCreating}
        deletingMemoId={deletingMemoId}
        errorMessage={listErrorMessage}
        onKeywordChange={onKeywordChange}
        onSelect={onSelect}
        onCreate={onCreate}
        onDelete={onDelete}
      />
      <SharedMemoDetail
        memo={selectedMemo}
        projectName={projectName}
        teamName={teamName}
        isLoading={isDetailLoading}
        isUpdating={isUpdating}
        errorMessage={detailErrorMessage}
        onUpdate={onUpdate}
      />
    </main>
  );
}

export default SharedPagesTab;
