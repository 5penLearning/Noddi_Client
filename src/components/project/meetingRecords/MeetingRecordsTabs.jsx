function MeetingRecordsTabs({ activeTab, onChange }) {
  return (
    <nav className="flex h-[45px] shrink-0 items-start gap-1 pr-[7px] pl-5">
      {[
        { id: 'records', label: '회의록' },
        { id: 'memos', label: '공유 메모' },
      ].map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 text-[20px] leading-[1.3] ${
            activeTab === tab.id
              ? 'border-b-[3px] border-[var(--color-primary)] font-semibold text-[var(--color-black)]'
              : 'font-medium text-[var(--color-gray-400)]'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

export default MeetingRecordsTabs;
