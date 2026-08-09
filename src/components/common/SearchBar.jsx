import searchIcon from '../../assets/icons/search/search.svg';

function SearchBar({ className = '', onSearchClick }) {
  return (
    <label className={`flex h-full min-w-0 flex-1 items-center rounded-[10px] bg-[var(--color-background)] px-5 ${className}`}>
      <span className="sr-only">검색</span>
      <input
        type="search"
        aria-label="검색"
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[var(--color-text-tertiary)]"
      />
      <button
        type="button"
        aria-label="검색 실행"
        onClick={onSearchClick}
        className="flex size-6 shrink-0 items-center justify-center rounded-[4px] text-[#2b3f6c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gray-400)]"
      >
        <img src={searchIcon} alt="" className="h-[20.46px] w-5" />
      </button>
    </label>
  );
}

export default SearchBar;
