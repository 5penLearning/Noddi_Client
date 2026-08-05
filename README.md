# Frontend Convention

## 1. 프로젝트 개요

### 한 줄 정의

AI 기반 팀별 소통 및 정보 공유 플랫폼

### 주요 기능 방향

* 팀 회의 내용 기록 및 요약
* 팀별 업무 맥락을 기반으로 한 AI Q&A
* 과거 회의, 결정 사항 및 업무 자료 통합 검색
* 글로벌 팀을 위한 다국어 번역
* 국가별 협업 방식과 문화적 맥락을 고려한 커뮤니케이션 지원

현재 서비스 기획은 변경될 수 있으므로, 특정 기능에 종속되지 않는 구조로 시작합니다. 새로운 기능이 확정되면 `features` 내부에 기능 단위 폴더를 추가합니다.

---

## 2. Frontend Team

| 이름  | 역할       |
| --- | -------- |
| 이남혁 | Frontend |
| 이주희 | Frontend |

담당 기능은 GitHub Issue를 기준으로 구분합니다.

개인별 고정 브랜치를 사용하지 않고, 각 기능 또는 작업 단위로 브랜치를 생성합니다.

---

## 3. 기술 스택

### Core

* React
* JavaScript
* Vite

### Styling

* Tailwind CSS

### Routing

* React Router DOM

### API

* Axios

### Code Quality

* ESLint
* Prettier
* Prettier Plugin for Tailwind CSS

새로운 라이브러리는 임의로 설치하지 않습니다. 도입 전 아래 내용을 팀에 공유합니다.

* 라이브러리가 필요한 이유
* 기존 방식으로 해결하기 어려운 이유
* 프로젝트에 추가되는 의존성
* 사용 범위

---

## 4. 프로젝트 초기 설정

### 4.1 React 프로젝트 생성

현재 폴더에 프로젝트를 생성하는 경우 다음 명령어를 사용합니다.

```bash
npm create vite@latest . -- --template react
npm install
```

### 4.2 기본 라이브러리 설치

```bash
npm install react-router-dom axios
```

### 4.3 Tailwind CSS 설치

```bash
npm install -D tailwindcss @tailwindcss/vite
```

### 4.4 Prettier 설치

```bash
npm install -D prettier prettier-plugin-tailwindcss
```

---

## 5. Tailwind CSS 설정

### `vite.config.js`

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### `src/index.css`

```css
@import 'tailwindcss';

@layer base {
  * {
    box-sizing: border-box;
  }

  html {
    min-width: 320px;
  }

  body {
    min-width: 320px;
    min-height: 100vh;
    margin: 0;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  button {
    cursor: pointer;
  }
}
```

서비스의 색상, 폰트, 간격 등 디자인 시스템은 디자인 방향이 확정된 후 추가합니다.

초기 단계에서는 특정 서비스 색상을 전역에 하드코딩하지 않습니다.

---

## 6. Prettier 설정

프로젝트 루트에 `.prettierrc` 파일을 생성합니다.

### `.prettierrc`

```json
{
  "singleQuote": true,
  "semi": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### `.prettierignore`

```text
node_modules
dist
coverage
package-lock.json
```

### `package.json` Scripts

기존 `scripts`에 다음 명령어를 추가합니다.

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

작업물을 Push하기 전에 다음 명령어를 실행합니다.

```bash
npm run lint
npm run format
npm run build
```

---

## 7. 디렉터리 구조

```text
src/
├── api/
│   ├── client.js
│   └── endpoints.js
│
├── assets/
│   ├── icons/
│   ├── images/
│   └── fonts/
│
├── components/
│   └── common/
│
├── constants/
│
├── features/
│
├── hooks/
│
├── layouts/
│
├── pages/
│
├── routes/
│   └── AppRouter.jsx
│
├── utils/
│
├── App.jsx
├── index.css
└── main.jsx
```

### 폴더별 역할

#### `api`

API 요청과 Axios 설정을 관리합니다.

```text
api/
├── client.js
├── endpoints.js
└── authApi.js
```

API 주소를 컴포넌트 내부에 직접 작성하지 않습니다.

#### `assets`

이미지, 아이콘, 폰트 등 정적 파일을 관리합니다.

```text
assets/
├── icons/
├── images/
└── fonts/
```

#### `components/common`

여러 페이지나 기능에서 공통으로 사용하는 컴포넌트를 관리합니다.

```text
components/common/
├── Button.jsx
├── Input.jsx
├── Modal.jsx
└── LoadingSpinner.jsx
```

특정 페이지에서 한 번만 사용하는 UI는 무조건 공통 컴포넌트로 분리하지 않습니다.

#### `constants`

변경되지 않는 상수와 옵션 데이터를 관리합니다.

```text
constants/
├── routes.js
├── messages.js
└── storageKeys.js
```

#### `features`

서비스 기능 단위의 코드가 들어갑니다.

```text
features/
├── meeting/
├── search/
├── translation/
└── workspace/
```

위 폴더명은 예시입니다. 기능이 확정되기 전에는 빈 기능 폴더를 미리 만들지 않습니다.

기능이 추가되면 다음과 같은 구조를 사용할 수 있습니다.

```text
features/
└── meeting/
    ├── api/
    ├── components/
    ├── hooks/
    ├── utils/
    └── constants/
```

#### `hooks`

두 개 이상의 컴포넌트에서 공통으로 사용하는 커스텀 훅을 관리합니다.

```text
hooks/
├── useModal.js
├── useDebounce.js
└── useOutsideClick.js
```

특정 기능에서만 사용하는 훅은 해당 `features` 폴더 내부에 둡니다.

#### `layouts`

페이지들이 공통으로 사용하는 레이아웃을 관리합니다.

```text
layouts/
├── RootLayout.jsx
└── WorkspaceLayout.jsx
```

#### `pages`

라우팅되는 페이지 컴포넌트를 관리합니다.

```text
pages/
├── HomePage.jsx
├── LoginPage.jsx
└── NotFoundPage.jsx
```

페이지는 화면을 구성하는 역할에 집중하고, 복잡한 기능 로직은 `features` 또는 `hooks`로 분리합니다.

#### `routes`

애플리케이션 라우팅을 관리합니다.

#### `utils`

특정 기능에 종속되지 않는 공통 함수를 관리합니다.

```text
utils/
├── formatDate.js
├── formatTime.js
└── validateInput.js
```

---

## 8. 파일 및 이름 규칙

### 컴포넌트와 페이지

컴포넌트 파일은 `PascalCase`를 사용합니다.

```text
WorkspaceCard.jsx
MeetingSummary.jsx
LoginPage.jsx
```

컴포넌트 이름과 파일 이름은 동일하게 작성합니다.

```jsx
const WorkspaceCard = () => {
  return <article>Workspace</article>;
};

export default WorkspaceCard;
```

### JavaScript 파일

일반 JavaScript 파일은 `camelCase`를 사용합니다.

```text
meetingApi.js
formatDate.js
routeConfig.js
```

### 커스텀 훅

커스텀 훅은 `use`로 시작합니다.

```text
useModal.js
useWorkspace.js
useMeetingSearch.js
```

### 변수와 함수

```javascript
const workspaceName = 'Global Team';
const meetingList = [];

const getWorkspaceList = () => {};
const formatMeetingDate = () => {};
```

`data`, `value`, `item`, `temp`처럼 역할이 불분명한 이름은 단독으로 사용하지 않습니다.

```javascript
// 지양
const data = response.data;

// 권장
const meetingData = response.data;
```

### Boolean

Boolean 값은 상태를 알 수 있는 접두사를 사용합니다.

```javascript
const isLoading = false;
const hasPermission = true;
const canSubmit = false;
const shouldTranslate = true;
```

### 이벤트 함수

컴포넌트 내부 이벤트 함수는 `handle`로 시작합니다.

```javascript
const handleSubmit = () => {};
const handleSearchChange = () => {};
const handleModalClose = () => {};
```

Props로 전달하는 이벤트는 `on`으로 시작합니다.

```jsx
<SearchInput onChange={handleSearchChange} />
```

### 상수

변경되지 않는 상수는 `UPPER_SNAKE_CASE`를 사용합니다.

```javascript
const MAX_SEARCH_LENGTH = 100;
const DEFAULT_LANGUAGE = 'ko';
```

---

## 9. React 작성 규칙

함수형 컴포넌트를 사용합니다.

```jsx
const TeamCard = ({ teamName, description }) => {
  return (
    <article>
      <h2>{teamName}</h2>
      <p>{description}</p>
    </article>
  );
};

export default TeamCard;
```

### 기본 원칙

* 한 컴포넌트는 하나의 주요 역할을 담당합니다.
* Props는 구조 분해 할당으로 받습니다.
* 동일한 UI가 반복될 때만 컴포넌트로 분리합니다.
* 페이지에 API 요청 코드와 복잡한 데이터 가공 코드를 함께 작성하지 않습니다.
* 컴포넌트 내부에서 DOM을 직접 조작하지 않습니다.
* 사용하지 않는 State와 Effect는 제거합니다.
* 하나의 Effect에서 관련 없는 여러 작업을 처리하지 않습니다.

### 조건부 렌더링

삼항 연산자를 여러 번 중첩하지 않습니다.

```jsx
if (isLoading) {
  return <LoadingSpinner />;
}

if (hasError) {
  return <ErrorMessage />;
}

return <MeetingList />;
```

### 반복 렌더링

항목을 식별할 수 있는 고유 값을 `key`로 사용합니다.

```jsx
{meetings.map((meeting) => (
  <MeetingCard key={meeting.id} meeting={meeting} />
))}
```

데이터의 순서나 개수가 변경될 수 있는 경우 배열의 인덱스를 `key`로 사용하지 않습니다.

---

## 10. Tailwind CSS 작성 규칙

### 기본 원칙

* 일반 CSS보다 Tailwind Utility Class를 우선 사용합니다.
* 반복되는 UI는 React 컴포넌트로 분리합니다.
* 반복되는 색상과 크기는 디자인 토큰으로 관리합니다.
* 임의 값 사용을 최소화합니다.
* 반응형은 모바일 화면을 먼저 작성합니다.
* 지나치게 긴 클래스는 줄바꿈하여 정리합니다.
* Prettier를 통해 클래스 순서를 통일합니다.

```jsx
const PrimaryButton = ({ children, onClick }) => {
  return (
    <button
      type="button"
      className="
        rounded-lg
        px-4
        py-2
        text-sm
        font-semibold
        transition
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
```

Prettier 적용 후 클래스는 자동 정렬됩니다.

### 클래스 동적 생성

Tailwind 클래스 이름을 문자열 조합으로 생성하지 않습니다.

```jsx
// 지양
<div className={`bg-${color}-500`} />
```

필요한 클래스 전체를 미리 정의합니다.

```javascript
const backgroundVariants = {
  blue: 'bg-blue-500',
  red: 'bg-red-500',
  gray: 'bg-gray-500',
};
```

```jsx
<div className={backgroundVariants[color]} />
```

### 임의 값

디자인 시안에 반드시 필요한 값이 아니라면 임의 값을 남용하지 않습니다.

```jsx
// 지양
<div className="mt-[13px] w-[347px]" />

// 권장
<div className="mt-3 w-full max-w-sm" />
```

### 공통 컴포넌트 기준

다음 조건 중 하나에 해당하면 공통 컴포넌트 분리를 검토합니다.

* 서로 다른 페이지에서 두 번 이상 사용
* 동일한 디자인과 동작을 반복
* 버튼, 입력창, 모달 등 프로젝트 전반에 사용
* 수정 시 여러 파일을 동시에 변경해야 하는 UI

---

## 11. API 규칙

API 요청은 `api` 또는 해당 `features` 내부에서 관리합니다.

```javascript
// api/client.js

import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

export default apiClient;
```

```javascript
// features/meeting/api/meetingApi.js

import apiClient from '../../../api/client';

export const getMeetingList = async () => {
  const response = await apiClient.get('/meetings');

  return response.data;
};
```

### API 작성 원칙

* API URL을 컴포넌트에 직접 작성하지 않습니다.
* 요청 함수 이름에는 동작과 대상을 표시합니다.
* 로딩, 성공, 실패 상태를 구분합니다.
* 빈 `catch`문을 작성하지 않습니다.
* 서버 응답을 여러 컴포넌트에서 각각 다르게 가공하지 않습니다.
* 임시 API 데이터는 실제 API 연결 후 제거합니다.
* `console.log`로 오류 처리를 대신하지 않습니다.

---

## 12. 환경변수 관리

로컬 환경에서는 `.env.local`을 사용합니다.

```env
VITE_API_BASE_URL=http://localhost:8080
```

GitHub에는 실제 환경변수 대신 `.env.example`을 등록합니다.

```env
VITE_API_BASE_URL=
```

API 비밀키, 비밀번호, 개인 토큰 등 민감한 값은 프론트엔드 코드에 저장하지 않습니다.

---

## 13. Git 브랜치 전략

### 브랜치 구조

```text
main
└── develop
    ├── feat/#12-login
    ├── feat/#18-workspace
    ├── fix/#25-modal-scroll
    └── design/#31-main-responsive
```

### `main`

* 배포 가능한 안정 버전
* 발표, 시연 또는 최종 제출 버전
* 직접 Push 금지
* `develop`에서 PR을 통해 병합

### `develop`

* 프론트엔드 통합 개발 브랜치
* 기능 브랜치의 PR 대상
* 직접 Push 금지
* 두 팀원의 기능을 통합하고 확인하는 브랜치

### 작업 브랜치

모든 작업은 `develop`에서 새로운 브랜치를 생성하여 진행합니다.

```text
종류/#이슈번호-작업명
```

예시:

```text
feat/#12-login
feat/#18-ai-chat
fix/#24-search-error
design/#31-dashboard
refactor/#42-api-structure
docs/#50-readme
chore/#55-eslint-setting
```

### 브랜치 종류

| 종류         | 사용 범위                |
| ---------- | -------------------- |
| `feat`     | 새로운 기능 구현            |
| `fix`      | 기능 오류 수정             |
| `design`   | UI 및 Tailwind 스타일 수정 |
| `refactor` | 기능 변경 없는 구조 개선       |
| `docs`     | README 등 문서 수정       |
| `chore`    | 패키지 및 프로젝트 설정        |
| `test`     | 테스트 코드 작성            |

개인 이름을 사용한 브랜치는 생성하지 않습니다.

```text
// 사용하지 않음
lnh
ljh
namhyuk
juhee
```

담당자는 GitHub Issue의 Assignee로 구분합니다.

---

## 14. Git 작업 흐름

### 1. develop 최신화

```bash
git checkout develop
git pull origin develop
```

### 2. 작업 브랜치 생성

```bash
git checkout -b feat/#12-login
```

### 3. 작업 및 커밋

```bash
git add .
git commit -m "[Feat] : 로그인 페이지 구현"
```

### 4. 원격 브랜치 Push

```bash
git push origin feat/#12-login
```

### 5. Pull Request 생성

* Base 브랜치: `develop`
* Compare 브랜치: 현재 작업 브랜치
* Reviewer: 본인을 제외한 프론트엔드 팀원

### 6. 리뷰 및 Merge

* 이남혁이 작성한 PR은 이주희가 확인
* 이주희가 작성한 PR은 이남혁이 확인
* 리뷰 반영 후 Merge
* Merge 완료 후 작업 브랜치 삭제

---

## 15. 커밋 메시지

### 형식

```text
[Type] : 작업 내용
```

### 예시

```text
[Feat] : 워크스페이스 목록 조회 기능 구현
[Fix] : 검색 결과가 중복 표시되는 오류 수정
[Design] : 대시보드 모바일 반응형 스타일 적용
[Refactor] : 회의 API 요청 로직 분리
[Docs] : 프론트엔드 컨벤션 추가
[Chore] : Tailwind CSS 초기 설정
```

### Type

| Type       | 내용           |
| ---------- | ------------ |
| `Feat`     | 기능 추가        |
| `Fix`      | 오류 수정        |
| `Design`   | UI 및 스타일 수정  |
| `Refactor` | 코드 구조 개선     |
| `Docs`     | 문서 수정        |
| `Chore`    | 환경 및 패키지 설정  |
| `Test`     | 테스트 작성       |
| `Rename`   | 파일 또는 폴더명 변경 |
| `Remove`   | 코드 또는 파일 삭제  |

### 커밋 원칙

* 하나의 커밋에는 하나의 작업을 담습니다.
* 작업 내용을 구체적으로 작성합니다.
* 기능 구현과 대규모 디자인 변경은 분리합니다.
* 의미 없는 커밋 메시지를 사용하지 않습니다.

```text
// 지양
[Fix] : 수정
[Feat] : 기능 작업

// 권장
[Fix] : 빈 검색어 입력 시 API가 호출되는 오류 수정
[Feat] : 회의록 키워드 검색 기능 구현
```

---

## 16. Pull Request 규칙

### PR 제목

```text
[Type] : 작업 내용
```

예시:

```text
[Feat] : 팀별 AI 질의응답 화면 구현
```

### PR 본문

```markdown
## 작업 내용

- AI 질의응답 화면 구현
- 질문 입력 상태 관리
- 답변 로딩 화면 구현

## 확인 사항

- 빈 질문 제출 방지
- 답변 로딩 상태 확인
- 모바일 화면 확인

## 관련 이슈

- close #12

## 참고 이미지

UI 작업인 경우 실행 화면을 첨부합니다.
```

### PR 원칙

* 하나의 PR에는 하나의 기능 또는 작업 범위를 담습니다.
* PR 크기가 지나치게 커지지 않도록 작업을 나눕니다.
* UI 작업은 이미지 또는 영상을 첨부합니다.
* 작업자가 직접 실행하고 확인한 뒤 PR을 생성합니다.
* 충돌은 작업 브랜치 작성자가 해결합니다.
* 리뷰 요청 사항을 반영하면 반영 내용을 댓글로 남깁니다.

---

## 17. Merge 전 확인

* 기능이 요구사항대로 동작하는가?
* 모바일 화면에서 UI가 깨지지 않는가?
* 콘솔 오류가 없는가?
* 임시 `console.log`가 제거됐는가?
* 사용하지 않는 import와 변수가 제거됐는가?
* 주석 처리된 이전 코드가 제거됐는가?
* 환경변수나 민감한 정보가 포함되지 않았는가?
* 로딩, 오류, 빈 데이터 상태를 처리했는가?
* `npm run lint`를 통과하는가?
* `npm run build`를 통과하는가?
* 관련 Issue와 PR 내용이 작성됐는가?

---

## 18. 초기 개발 원칙

서비스 기획이 변경될 가능성이 있으므로 다음 원칙을 적용합니다.

* 기능이 확정되기 전에 세부 기능 폴더를 미리 만들지 않습니다.
* 페이지 이름에 임시 기획 용어를 과도하게 사용하지 않습니다.
* 공통 컴포넌트와 기능 컴포넌트를 구분합니다.
* API 응답 구조를 UI에 직접 강하게 결합하지 않습니다.
* 화면 문구와 옵션 데이터는 가능한 한 상수로 분리합니다.
* 특정 국가나 언어에 종속된 UI 구조를 만들지 않습니다.
* 다국어 지원 가능성을 고려해 문구를 컴포넌트 내부에 반복 작성하지 않습니다.
* 변경 가능성이 높은 기능은 작은 컴포넌트와 함수 단위로 분리합니다.
* 초기 단계에서 불필요한 전역 상태 관리 라이브러리를 도입하지 않습니다.
* 실제로 공유해야 하는 상태가 확인된 후 상태 관리 방식을 결정합니다.
