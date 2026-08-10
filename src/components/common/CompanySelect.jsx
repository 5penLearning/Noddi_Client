import { useEffect, useMemo, useRef, useState } from 'react';

import { organizations } from '../../constants/organizations';

function CompanySelect({
  value,
  onChange,
  disabled = false,
}) {
  const containerRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick,
      );
    };
  }, []);

  const filteredOrganizations = useMemo(() => {
    const normalizedKeyword = keyword
      .trim()
      .toLowerCase();

    if (!normalizedKeyword) {
      return organizations;
    }

    return organizations.filter((organization) => {
      const name = organization.name.toLowerCase();
      const domain =
        organization.domain?.toLowerCase() || '';

      return (
        name.includes(normalizedKeyword) ||
        domain.includes(normalizedKeyword)
      );
    });
  }, [keyword]);

  const handleToggle = () => {
    if (disabled) {
      return;
    }

    setIsOpen((previous) => !previous);
  };

  const handleSelect = (organization) => {
    onChange(organization);
    setKeyword('');
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full"
    >
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="body-5 flex h-[46px] w-full items-center justify-between rounded-[8px] border border-[var(--color-border)] bg-[var(--color-white)] px-[14px] text-left text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-gray-300)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span
          className={
            value
              ? 'text-[var(--color-text-primary)]'
              : ''
          }
        >
          {value?.name || '회사 검색'}
        </span>

        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className={`transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-[54px] left-0 z-50 w-full overflow-hidden rounded-[8px] border border-[var(--color-border)] bg-[var(--color-white)] shadow-lg">
          <div className="border-b border-[var(--color-border)] p-[10px]">
            <input
              type="text"
              value={keyword}
              onChange={(event) =>
                setKeyword(event.target.value)
              }
              placeholder="회사명 또는 도메인 검색"
              autoFocus
              className="body-5 h-[40px] w-full rounded-[6px] border border-transparent bg-[var(--color-background-subtle)] px-[12px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-gray-400)] focus:border-[var(--color-gray-300)]"
            />
          </div>

          <div
            role="listbox"
            className="max-h-[220px] overflow-y-auto py-[6px]"
          >
            {filteredOrganizations.length > 0 ? (
              filteredOrganizations.map(
                (organization) => (
                  <button
                    key={organization.id}
                    type="button"
                    role="option"
                    aria-selected={
                      value?.id === organization.id
                    }
                    onClick={() =>
                      handleSelect(organization)
                    }
                    className="flex w-full items-center justify-between px-[14px] py-[11px] text-left transition-colors hover:bg-[var(--color-background-subtle)]"
                  >
                    <div className="min-w-0">
                      <p className="body-5 text-[var(--color-text-primary)]">
                        {organization.name}
                      </p>

                      {organization.domain && (
                        <p className="caption-2 mt-[2px] text-[var(--color-text-tertiary)]">
                          {organization.domain}
                        </p>
                      )}
                    </div>

                    {value?.id ===
                      organization.id && (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                        className="shrink-0"
                      >
                        <path
                          d="M3.5 8L6.5 11L12.5 5"
                          stroke="var(--color-primary)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                ),
              )
            ) : (
              <div className="px-[14px] py-[20px] text-center">
                <p className="caption-2 text-[var(--color-text-tertiary)]">
                  {organizations.length === 0
                    ? '등록된 회사 정보가 없습니다.'
                    : '검색 결과가 없습니다.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanySelect;
