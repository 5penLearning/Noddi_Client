import { useEffect, useState } from 'react';

const INITIAL_FORM = {
  title: '',
  filterId: '',
  date: '',
  startTime: '',
  endTime: '',
  description: '',
};

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MeetingReservationModal({
  isOpen,
  onClose,
  onReserve,
  filterOptions,
  defaultDate,
  minDate,
  meetings,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setForm({
      ...INITIAL_FORM,
      date: defaultDate,
    });

    setErrorMessage('');
  }, [isOpen, defaultDate]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const meetingFilters = filterOptions.filter(
    (filter) => filter.id !== 'ALL',
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrorMessage('');
  };

  const validateReservation = () => {
    const selectedOption = meetingFilters.find(
      (filter) => filter.id === form.filterId,
    );

    if (!selectedOption) {
      return {
        valid: false,
        message: '프로젝트와 팀을 선택해주세요.',
      };
    }

    if (form.startTime >= form.endTime) {
      return {
        valid: false,
        message: '종료 시간은 시작 시간보다 늦어야 합니다.',
      };
    }

    const startDateTime = new Date(
      `${form.date}T${form.startTime}:00`,
    );

    const now = new Date();

    if (startDateTime <= now) {
      return {
        valid: false,
        message: '현재 시간보다 이후의 회의만 예약할 수 있습니다.',
      };
    }

    const hasOverlap = meetings.some((meeting) => {
      if (
        meeting.date !== form.date ||
        meeting.project !== selectedOption.project ||
        meeting.team !== selectedOption.team
      ) {
        return false;
      }

      return (
        form.startTime < meeting.endTime &&
        form.endTime > meeting.startTime
      );
    });

    if (hasOverlap) {
      return {
        valid: false,
        message:
          '선택한 시간에 이미 해당 프로젝트/팀의 회의가 있습니다.',
      };
    }

    return {
      valid: true,
      selectedOption,
    };
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validation = validateReservation();

    if (!validation.valid) {
      setErrorMessage(validation.message);
      return;
    }

    onReserve({
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      project: validation.selectedOption.project,
      team: validation.selectedOption.team,
    });
  };

  const isFormFilled =
    form.title.trim() &&
    form.filterId &&
    form.date &&
    form.startTime &&
    form.endTime;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-[520px] rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#101211]">
              회의 예약하기
            </h2>

            <p className="mt-1 text-sm text-[#7B8581]">
              새로운 회의 일정을 등록해주세요.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#59625F] transition hover:bg-[#F5F7F6]"
            aria-label="닫기"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label
                htmlFor="meeting-title"
                className="mb-2 block text-sm font-medium text-[#101211]"
              >
                회의명
              </label>

              <input
                id="meeting-title"
                name="title"
                type="text"
                maxLength={50}
                value={form.title}
                onChange={handleChange}
                placeholder="회의명을 입력해주세요"
                className="h-11 w-full rounded-lg border border-[#D8DFDC] px-3 text-sm text-[#101211] outline-none transition placeholder:text-[#A7B0AC] focus:border-[#101211]"
              />

              <p className="mt-1 text-right text-xs text-[#A7B0AC]">
                {form.title.length}/50
              </p>
            </div>

            <div>
              <label
                htmlFor="meeting-filter"
                className="mb-2 block text-sm font-medium text-[#101211]"
              >
                프로젝트 / 팀
              </label>

              <select
                id="meeting-filter"
                name="filterId"
                value={form.filterId}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-[#D8DFDC] bg-white px-3 text-sm text-[#101211] outline-none transition focus:border-[#101211]"
              >
                <option value="">
                  프로젝트와 팀을 선택해주세요
                </option>

                {meetingFilters.map((filter) => (
                  <option
                    key={filter.id}
                    value={filter.id}
                  >
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="meeting-date"
                className="mb-2 block text-sm font-medium text-[#101211]"
              >
                날짜
              </label>

              <input
                id="meeting-date"
                name="date"
                type="date"
                min={minDate}
                value={form.date}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-[#D8DFDC] px-3 text-sm text-[#101211] outline-none transition focus:border-[#101211]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="meeting-start-time"
                  className="mb-2 block text-sm font-medium text-[#101211]"
                >
                  시작 시간
                </label>

                <input
                  id="meeting-start-time"
                  name="startTime"
                  type="time"
                  value={form.startTime}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-[#D8DFDC] px-3 text-sm text-[#101211] outline-none transition focus:border-[#101211]"
                />
              </div>

              <div>
                <label
                  htmlFor="meeting-end-time"
                  className="mb-2 block text-sm font-medium text-[#101211]"
                >
                  종료 시간
                </label>

                <input
                  id="meeting-end-time"
                  name="endTime"
                  type="time"
                  value={form.endTime}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-[#D8DFDC] px-3 text-sm text-[#101211] outline-none transition focus:border-[#101211]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="meeting-description"
                className="mb-2 block text-sm font-medium text-[#101211]"
              >
                회의 안건
                <span className="ml-1 font-normal text-[#A7B0AC]">
                  선택
                </span>
              </label>

              <textarea
                id="meeting-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="회의에서 논의할 내용을 입력해주세요"
                rows={4}
                maxLength={200}
                className="w-full resize-none rounded-lg border border-[#D8DFDC] px-3 py-3 text-sm text-[#101211] outline-none transition placeholder:text-[#A7B0AC] focus:border-[#101211]"
              />

              <p className="mt-1 text-right text-xs text-[#A7B0AC]">
                {form.description.length}/200
              </p>
            </div>

            {errorMessage && (
              <div className="rounded-lg bg-[#FFF1F0] px-4 py-3">
                <p className="text-sm text-[#F64E42]">
                  {errorMessage}
                </p>
              </div>
            )}
          </div>

          <div className="mt-7 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#D8DFDC] bg-white px-5 py-3 text-sm font-medium text-[#59625F] transition hover:bg-[#F5F7F6]"
            >
              취소
            </button>

            <button
              type="submit"
              disabled={!isFormFilled}
              className={`rounded-lg px-5 py-3 text-sm font-semibold transition ${
                isFormFilled
                  ? 'bg-[#101211] text-white hover:opacity-80'
                  : 'cursor-not-allowed bg-[#E4E9E7] text-[#A7B0AC]'
              }`}
            >
              예약하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MeetingReservationModal;
