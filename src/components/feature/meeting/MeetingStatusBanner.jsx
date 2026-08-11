function MeetingStatusBanner() {
  return (
    <section className="flex min-h-[76px] items-center justify-between rounded-xl bg-[#31F5A0] px-6 py-4">
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 rounded-full bg-[#F64E42]" />

        <div>
          <p className="text-xs font-medium text-[#F64E42]">
            현재 진행 중이에요
          </p>

          <p className="mt-1 text-sm font-semibold text-[#101211]">
            18시 전체 회의
          </p>
        </div>
      </div>

      <button
        type="button"
        className="rounded-lg bg-[#101211] px-5 py-3 text-sm font-medium text-white transition hover:opacity-80"
      >
        참여하러 가기
      </button>
    </section>
  );
}

export default MeetingStatusBanner;
