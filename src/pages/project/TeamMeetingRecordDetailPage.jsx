import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import AiMeetingSummaryCard from '../../components/project/AiMeetingSummaryCard';
import { meetingRecordMockData } from '../../mocks/projectPageData';

import chevronIcon from '../../assets/icons/profile/chevron.svg';

const summaryWidths = ['107px', '110px', '113px'];
const transcriptWidths = ['76px', '77px', '78px', '79px', '80px', '81px', '108px'];
const actionItemRows = [
  ['48px', '61px', '74px', '87px'],
  ['55px', '68px', '81px', '54px'],
  ['62px', '75px', '48px', '61px'],
  ['69px', '82px', '55px', '68px'],
];

function SkeletonLine({ width, height = '11px', radius = '4px' }) {
  return (
    <span
      style={{ width, height, borderRadius: radius }}
      className="block bg-[var(--color-gray-200)]"
    />
  );
}

function DetailSection({ title, children }) {
  return (
    <section className="flex w-full flex-col gap-3 rounded-[6px] border border-[var(--color-gray-200)] bg-[var(--color-gray-50)] p-3">
      <h2 className="body-3 text-[#1F2937]">{title}</h2>
      {children}
    </section>
  );
}

function TeamMeetingRecordDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId, teamId, meetingId } = useParams();
  const meetingRecord = useMemo(
    () =>
      location.state?.meetingRecord ??
      meetingRecordMockData.find((record) => String(record.id) === String(meetingId)),
    [location.state, meetingId],
  );
  const title = meetingRecord?.title ?? '회의록 상세';

  return (
    <main className="mx-auto h-full w-full max-w-[1347px] [scrollbar-width:none] overflow-y-auto rounded-[10px] bg-[var(--color-white)] [&::-webkit-scrollbar]:hidden">
      <div className="min-h-[970px] px-[22px] pt-[38px] pb-10">
        <header className="flex items-center pl-4">
          <button
            type="button"
            onClick={() => navigate(`/projects/${projectId}/teams/${teamId}/meetings`)}
            className="flex size-6 items-center justify-center"
          >
            <img src={chevronIcon} className="h-[7px] w-[15px] -rotate-90" />
          </button>
          <h1 className="subhead-3 ml-[7px] text-[var(--color-black)]">{title}</h1>
        </header>

        <nav className="mt-[23px] flex gap-2 pl-4">
          <button
            type="button"
            className="min-w-10 rounded-full bg-[#1F2937] px-3 py-1.5 text-[14px] leading-none font-medium text-white"
          >
            회의록
          </button>
          <button
            type="button"
            className="min-w-10 rounded-full border border-[#E5E7EB] bg-[#F3F4F6] px-3 py-1.5 text-[14px] leading-none font-medium text-[#1F2937]"
          >
            AI 요약
          </button>
          <button
            type="button"
            className="min-w-10 rounded-full border border-[#E5E7EB] bg-[#F3F4F6] px-3 py-1.5 text-[14px] leading-none font-medium text-[#1F2937]"
          >
            할 일
          </button>
        </nav>

        <div className="mt-[26px] flex items-start gap-6">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <AiMeetingSummaryCard />

            <DetailSection title="주요 결정사항">
              <ol className="flex flex-col gap-2">
                {summaryWidths.map((width, index) => (
                  <li key={width} className="flex items-center gap-2 text-[12px] text-[#1F2937]">
                    <span>{index + 1}.</span>
                    <SkeletonLine width={width} />
                  </li>
                ))}
              </ol>
            </DetailSection>

            <DetailSection title="논의된 이슈">
              <div className="flex flex-col gap-2 text-[12px] text-[#1F2937]">
                <p className="flex gap-2">
                  이슈 1 <span className="text-[11px]">미해결</span>
                </p>
                <p className="flex gap-2">
                  이슈 2 <span className="text-[11px]">검토 중</span>
                </p>
                <p className="flex gap-2">
                  이슈 3 <span className="text-[11px]">완료</span>
                </p>
              </div>
            </DetailSection>

            <DetailSection title="담당자별 할 일">
              <div className="overflow-hidden rounded-[6px] border border-[var(--color-gray-200)]">
                <div className="grid grid-cols-4 border-b border-[var(--color-gray-200)] text-[13px] text-[#6B7280]">
                  {['담당자', '할 일', '기한', '상태'].map((label) => (
                    <span key={label} className="px-[14px] py-[10px]">
                      {label}
                    </span>
                  ))}
                </div>
                {actionItemRows.map((row, rowIndex) => (
                  <div
                    key={row.join('-')}
                    className={`grid grid-cols-4 ${
                      rowIndex < actionItemRows.length - 1
                        ? 'border-b border-[var(--color-gray-200)]'
                        : ''
                    }`}
                  >
                    {row.map((width, columnIndex) => (
                      <span key={`${width}-${columnIndex}`} className="px-[14px] py-[10px]">
                        <SkeletonLine width={width} height="12px" radius="6px" />
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </DetailSection>
          </div>

          <aside className="flex w-[360px] shrink-0 flex-col gap-4">
            <DetailSection title="원문 기록">
              <div className="flex flex-col gap-3">
                {transcriptWidths.map((width) => (
                  <SkeletonLine key={width} width={width} />
                ))}
              </div>
            </DetailSection>

            <section className="flex w-full flex-col gap-3 rounded-[6px] border border-[var(--color-gray-200)] bg-[var(--color-gray-50)] p-3">
              <header className="flex items-center">
                <h2 className="body-4 text-[#1F2937]">녹음 파일</h2>
                <span className="ml-auto text-[11px] leading-none text-[#1F2937]">54:12</span>
              </header>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="min-w-[60px] rounded-[6px] border border-[#1F2937] bg-white px-4 py-2 text-[14px] font-medium text-[#1F2937]"
                >
                  재생
                </button>
                <span className="text-[12px] text-[#1F2937]">2025-06-12 회의녹음.mp3</span>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default TeamMeetingRecordDetailPage;
