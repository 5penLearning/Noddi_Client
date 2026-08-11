/**
 * 임시 조직 데이터
 *
 * 현재 백엔드 DB에 등록되어 있는 Organization 정보를
 * 프론트에서 임시로 사용합니다.
 *
 * 추후 Organization 목록/검색 API가 추가되면
 * 이 파일의 정적 배열은 삭제하고 API 조회 방식으로 변경합니다.
 *
 * 중요:
 * id는 백엔드 DB의 organizationId와 반드시 일치해야 합니다.
 * domain은 해당 조직에 등록된 email_domain과 일치해야 합니다.
 */

export const organizations = [
  {
    id: 1,
    name: '구글',
    domain: 'gmail.com',
  },
  {
    id: 2,
    name: '홍익대학교',
    domain: 'g.hongik.ac.kr',
  },
  {
    id: 3,
    name: '네이버',
    domain: 'naver.com',
  },
  {
    id: 4,
    name: '카카오',
    domain: 'kakao.com',
  },
];

/**
 * ============================================
 * 테스트 방법
 * ============================================
 *
 * 1. 구글 선택
 *    organizationId: 1
 *    사용할 이메일: example@gmail.com
 *
 * 2. 홍익대학교 선택
 *    organizationId: 2
 *    사용할 이메일: example@g.hongik.ac.kr
 *
 * 3. 네이버 선택
 *    organizationId: 3
 *    사용할 이메일: example@naver.com
 *
 * 4. 카카오 선택
 *    organizationId: 4
 *    사용할 이메일: example@kakao.com
 *
 *
 * 예를 들어 구글을 선택한 뒤
 *
 * example@naver.com
 *
 * 을 입력하면 백엔드에서 도메인이 다르기 때문에
 *
 * "해당 조직의 이메일 도메인과 일치하지 않습니다."
 *
 * 오류가 발생하는 것이 정상입니다.
 *
 *
 * ============================================
 * 추후 변경
 * ============================================
 *
 * 백엔드에서 Organization 조회 API가 추가되면
 * 이 organizations 배열은 제거합니다.
 *
 * 예:
 *
 * GET /api/v1/organizations
 *
 * 실제 엔드포인트와 응답 구조는 Swagger 업데이트 후 확인합니다.
 */
