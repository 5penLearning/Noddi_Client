import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { getOrganizations } from '../../api/organizationApi';
import { getApiErrorMessage } from '../../api/axios';

function BuildingIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 21V5.8C5 5.36 5.29 4.97 5.71 4.84L13.71 2.34C14.35 2.14 15 2.62 15 3.29V21"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M15 9H19C19.55 9 20 9.45 20 10V21"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M3 21H22"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M9 7H11M9 11H11M9 15H11"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="6"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M16 16L20 20"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDownIcon({
  isOpen,
}) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`transition-transform duration-200 ${isOpen
        ? 'rotate-180'
        : ''
        }`}
    >
      <path
        d="M7 10L12 15L17 10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12L10 17L19 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CompanySelect({
  value,
  onChange,
  disabled = false,
}) {
  const containerRef =
    useRef(null);

  const [
    organizations,
    setOrganizations,
  ] = useState([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    loadError,
    setLoadError,
  ] = useState('');

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const [
    keyword,
    setKeyword,
  ] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadOrganizations =
      async () => {
        try {
          setIsLoading(true);
          setLoadError('');

          const response =
            await getOrganizations();

          if (cancelled) {
            return;
          }

          const result =
            Array.isArray(
              response?.result,
            )
              ? response.result
              : [];

          setOrganizations(result);
        } catch (error) {
          if (cancelled) {
            return;
          }

          console.error(
            'Failed to load organizations:',
            error,
          );

          setOrganizations([]);

          setLoadError(
            getApiErrorMessage(
              error,
              '회사 목록을 불러오지 못했습니다.',
            ),
          );
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      };

    loadOrganizations();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (
      event,
    ) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target,
        )
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

  const filteredOrganizations =
    useMemo(() => {
      const normalizedKeyword =
        keyword
          .trim()
          .toLowerCase();

      if (!normalizedKeyword) {
        return organizations;
      }

      return organizations.filter(
        (organization) => {
          const name =
            organization.name
              ?.toLowerCase() ??
            '';

          const emailDomain =
            organization.emailDomain
              ?.toLowerCase() ??
            '';

          return (
            name.includes(
              normalizedKeyword,
            ) ||
            emailDomain.includes(
              normalizedKeyword,
            )
          );
        },
      );
    }, [
      keyword,
      organizations,
    ]);

  const handleToggle = () => {
    if (
      disabled ||
      isLoading
    ) {
      return;
    }

    setIsOpen(
      (previous) => !previous,
    );
  };

  const handleSelect = (
    organization,
  ) => {
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
        disabled={
          disabled ||
          isLoading
        }
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`flex h-[52px] w-full items-center gap-3 rounded-[10px] border bg-white px-4 text-left transition ${isOpen
          ? 'border-[#31F5A0] shadow-[0_0_0_3px_rgba(49,245,160,0.10)]'
          : 'border-[#DDE8E2] hover:border-[#B8CDC2]'
          } disabled:cursor-not-allowed disabled:bg-[#F5F8F6] disabled:opacity-60`}
      >
        <span
          className={`shrink-0 ${value
            ? 'text-[#19865A]'
            : 'text-[#899B92]'
            }`}
        >
          <BuildingIcon />
        </span>

        <span
          className={`min-w-0 flex-1 truncate text-[14px] ${value
            ? 'font-medium text-[#101211]'
            : 'text-[#82938B]'
            }`}
        >
          {isLoading
            ? '회사 목록 불러오는 중...'
            : value?.name ||
            '회사를 선택해주세요'}
        </span>

        {!isLoading && (
          <span className="shrink-0 text-[#7D9187]">
            <ChevronDownIcon
              isOpen={isOpen}
            />
          </span>
        )}
      </button>

      {loadError && (
        <p className="mt-2 text-[12px] text-[#E14C41]">
          {loadError}
        </p>
      )}

      {isOpen && (
        <div className="absolute left-0 top-[60px] z-50 w-full overflow-hidden rounded-[12px] border border-[#DDE9E3] bg-white shadow-[0_14px_36px_rgba(16,18,17,0.12)]">
          <div className="border-b border-[#EDF3F0] p-3">
            <div className="flex h-[44px] items-center gap-2.5 rounded-[9px] bg-[#F3F8F5] px-3.5 text-[#758A80] transition focus-within:bg-white focus-within:ring-1 focus-within:ring-[#31F5A0]">
              <SearchIcon />

              <input
                type="text"
                value={keyword}
                onChange={(
                  event,
                ) =>
                  setKeyword(
                    event.target.value,
                  )
                }
                placeholder="회사명 또는 도메인 검색"
                autoFocus
                className="min-w-0 flex-1 bg-transparent text-[14px] text-[#101211] outline-none placeholder:text-[#91A098]"
              />
            </div>
          </div>

          <div
            role="listbox"
            className="max-h-[260px] overflow-y-auto py-1.5"
          >
            {filteredOrganizations.length >
              0 ? (
              filteredOrganizations.map(
                (organization) => {
                  const isSelected =
                    Number(
                      value?.organizationId,
                    ) ===
                    Number(
                      organization.organizationId,
                    );

                  return (
                    <button
                      key={
                        organization.organizationId
                      }
                      type="button"
                      role="option"
                      aria-selected={
                        isSelected
                      }
                      onClick={() =>
                        handleSelect(
                          organization,
                        )
                      }
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${isSelected
                        ? 'bg-[#EFFFF7]'
                        : 'hover:bg-[#F5FBF8]'
                        }`}
                    >
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-[9px] ${isSelected
                          ? 'bg-[#31F5A0] text-[#101211]'
                          : 'bg-[#EEF5F1] text-[#61766C]'
                          }`}
                      >
                        <BuildingIcon />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-medium text-[#101211]">
                          {
                            organization.name
                          }
                        </p>

                        {organization.emailDomain && (
                          <p className="mt-0.5 truncate text-[12px] text-[#7B8F85]">
                            @
                            {
                              organization.emailDomain
                            }
                          </p>
                        )}
                      </div>

                      {isSelected && (
                        <span className="shrink-0 text-[#17885A]">
                          <CheckIcon />
                        </span>
                      )}
                    </button>
                  );
                },
              )
            ) : (
              <div className="px-5 py-8 text-center">
                <p className="text-[13px] text-[#7D9187]">
                  검색 결과가 없습니다.
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
