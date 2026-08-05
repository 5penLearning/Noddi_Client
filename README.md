# Frontend Convention

본 문서는 프론트엔드 팀의 코드 작성 방식과 Git 협업 규칙을 통일하기 위한 문서입니다.

## 1. 기술 환경

* React
* JavaScript
* GitHub
* ESLint
* Prettier

추가 라이브러리는 필요성을 팀에 공유한 뒤 도입합니다. 같은 역할을 하는 라이브러리를 중복으로 사용하지 않습니다.

---

## 2. 디렉터리 구조

```text
src/
├── api/              # API 요청 함수
├── assets/           # 이미지, 아이콘, 폰트 등 정적 파일
├── components/
│   ├── common/       # 버튼, 입력창, 모달 등 공통 컴포넌트
│   └── feature/      # 특정 기능에서 사용하는 컴포넌트
├── constants/        # 변경되지 않는 상수
├── hooks/            # 커스텀 훅
├── layouts/          # 공통 레이아웃
├── pages/            # 라우팅 단위 페이지
├── routes/           # 라우팅 설정
├── styles/           # 전역 스타일
├── utils/            # 공통 유틸 함수
├── App.jsx
└── main.jsx
```

### 디렉터리 사용 기준

* 여러 페이지에서 사용하는 컴포넌트는 `components/common`에 작성합니다.
* 특정 기능에서만 사용하는 컴포넌트는 `components/feature`에 작성합니다.
* 페이지 컴포넌트는 `pages`에 작성합니다.
* API 요청 코드는 컴포넌트 내부가 아닌 `api`에서 관리합니다.
* 반복해서 사용하는 값은 `constants`에 분리합니다.
* 반복해서 사용하는 로직은 `hooks` 또는 `utils`에 분리합니다.

---

## 3. 파일 및 폴더 이름

### 컴포넌트

컴포넌트와 페이지 파일은 `PascalCase`를 사용합니다.

```text
LoginPage.jsx
UserProfile.jsx
PrimaryButton.jsx
```

### 일반 JavaScript 파일

유틸 함수, API, 설정 파일은 `camelCase`를 사용합니다.

```text
userApi.js
formatDate.js
routeConfig.js
```

### 커스텀 훅

커스텀 훅은 반드시 `use`로 시작합니다.

```text
useModal.js
useAuth.js
useOutsideClick.js
```

### 스타일 파일

컴포넌트 전용 스타일 파일은 컴포넌트와 같은 이름을 사용합니다.

```text
PrimaryButton.jsx
PrimaryButton.css
```

CSS 클래스 이름은 `kebab-case`를 사용합니다.

```css
.profile-container {
}

.submit-button {
}
```

---

## 4. 변수 및 함수 이름

### 변수와 함수

`camelCase`를 사용하며 역할을 알 수 있는 이름으로 작성합니다.

```javascript
const userName = '홍길동';
const selectedCategory = 'design';

const getUserProfile = () => {};
const formatCreatedDate = () => {};
```

다음과 같이 의미가 불분명한 이름은 피합니다.

```javascript
const data = {};
const value = '';
const temp = [];
```

불가피하게 사용하는 경우 어떤 데이터인지 이름에 표시합니다.

```javascript
const userData = {};
const selectedValue = '';
const filteredItems = [];
```

### 상수

변경되지 않는 상수는 `UPPER_SNAKE_CASE`를 사용합니다.

```javascript
const MAX_IMAGE_COUNT = 5;
const DEFAULT_PAGE_SIZE = 10;
```

### Boolean 값

Boolean 값은 `is`, `has`, `can`, `should` 등으로 시작합니다.

```javascript
const isLoading = false;
const hasPermission = true;
const canSubmit = false;
const shouldShowModal = true;
```

### 이벤트 함수

이벤트를 처리하는 함수는 `handle`로 시작합니다.

```javascript
const handleClick = () => {};
const handleSubmit = () => {};
const handleInputChange = () => {};
```

컴포넌트에 전달하는 이벤트 Props는 `on`으로 시작합니다.

```jsx
<PrimaryButton onClick={handleSubmit} />
```

---

## 5. 컴포넌트 작성 규칙

함수형 컴포넌트를 사용합니다.

```jsx
const UserProfile = ({ name, profileImage }) => {
  return (
    <section className="user-profile">
      <img src={profileImage} alt={`${name} 프로필`} />
      <p>{name}</p>
    </section>
  );
};

export default UserProfile;
```

### 기본 규칙

* 한 파일에는 하나의 주요 컴포넌트만 작성합니다.
* Props는 구조 분해 할당으로 받습니다.
* 컴포넌트 이름과 파일 이름을 동일하게 작성합니다.
* 컴포넌트는 하나의 역할만 담당하도록 작성합니다.
* 반복되는 UI는 공통 컴포넌트로 분리합니다.
* 지나치게 큰 컴포넌트는 UI와 로직을 기준으로 분리합니다.
* 컴포넌트 내부에서 직접 DOM을 조작하지 않습니다.
* DOM 접근이 필요한 경우 React의 `ref`를 사용합니다.

### 조건부 렌더링

복잡한 삼항 연산자를 중첩하지 않습니다.

```jsx
// 지양
return isLoading ? <Loading /> : hasError ? <Error /> : <Content />;

// 권장
if (isLoading) {
  return <Loading />;
}

if (hasError) {
  return <Error />;
}

return <Content />;
```

### 반복 렌더링

배열의 순서가 변경되거나 항목이 추가·삭제될 수 있는 경우 배열의 인덱스를 `key`로 사용하지 않습니다.

```jsx
{users.map((user) => (
  <UserCard key={user.id} user={user} />
))}
```

---

## 6. 코드 작성 스타일

### 공통 규칙

* 들여쓰기는 공백 2칸을 사용합니다.
* 문자열은 작은따옴표를 사용합니다.
* 문장 끝에는 세미콜론을 작성합니다.
* 사용하지 않는 변수와 import는 제거합니다.
* 한 줄에 지나치게 많은 내용을 작성하지 않습니다.
* 코드 정렬은 Prettier 설정을 따릅니다.

```javascript
const getUserName = (user) => {
  return user.name;
};
```

### Import 순서

Import는 다음 순서로 작성하고 그룹 사이에 한 줄을 띄웁니다.

1. React 및 외부 라이브러리
2. 내부 컴포넌트와 함수
3. 이미지와 스타일 파일

```jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PrimaryButton from '../components/common/PrimaryButton';
import { getUserProfile } from '../api/userApi';

import profileImage from '../assets/images/profile.png';
import './ProfilePage.css';
```

---

## 7. 상태 관리

* 특정 컴포넌트에서만 사용하는 값은 지역 상태로 관리합니다.
* 부모와 자식 사이에서만 사용하는 값은 Props로 전달합니다.
* 여러 페이지에서 공유하는 값만 전역 상태로 관리합니다.
* 서버에서 받아온 데이터와 UI 상태를 구분합니다.
* 동일한 데이터를 여러 위치에서 중복으로 저장하지 않습니다.

```javascript
const [isModalOpen, setIsModalOpen] = useState(false);
const [userList, setUserList] = useState([]);
```

Props가 여러 단계를 거쳐 전달되는 경우 컴포넌트 구조를 먼저 검토한 뒤 전역 상태 도입 여부를 결정합니다.

---

## 8. API 작성 규칙

API 요청은 컴포넌트 내부에 직접 작성하지 않고 `api` 디렉터리에서 관리합니다.

```javascript
// api/userApi.js

export const getUserProfile = async () => {
  const response = await fetch('/api/users/me');

  if (!response.ok) {
    throw new Error('사용자 정보를 불러오지 못했습니다.');
  }

  return response.json();
};
```

컴포넌트에서는 API 함수를 호출하고 화면 상태를 처리합니다.

```jsx
const loadUserProfile = async () => {
  try {
    setIsLoading(true);

    const userProfile = await getUserProfile();
    setUser(userProfile);
  } catch (error) {
    setErrorMessage(error.message);
  } finally {
    setIsLoading(false);
  }
};
```

### API 관련 규칙

* 로딩, 성공, 실패 상태를 구분합니다.
* 에러를 비워둔 `catch`문으로 무시하지 않습니다.
* 서버 응답 구조를 컴포넌트마다 다르게 가공하지 않습니다.
* API 주소와 키를 코드에 직접 작성하지 않습니다.
* 환경변수는 `.env` 파일에서 관리합니다.
* 민감한 환경변수 파일은 GitHub에 올리지 않습니다.

Vite를 사용하는 경우 클라이언트 환경변수는 `VITE_`로 시작합니다.

```env
VITE_API_BASE_URL=https://example.com
```

---

## 9. 스타일 작성 규칙

* 공통 스타일과 컴포넌트 스타일을 구분합니다.
* 인라인 스타일은 동적으로 계산되는 값이 필요한 경우에만 사용합니다.
* 동일한 스타일을 여러 파일에서 반복해서 작성하지 않습니다.
* 색상, 간격, 글자 크기 등 반복되는 디자인 값은 공통 변수로 관리합니다.
* 임시로 작성한 고정 크기와 위치 값은 작업 완료 전에 정리합니다.
* `!important` 사용을 지양합니다.

```css
:root {
  --color-primary: #2563eb;
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-background: #ffffff;

  --spacing-small: 8px;
  --spacing-medium: 16px;
  --spacing-large: 24px;
}
```

---

## 10. 주석 작성 규칙

코드만 읽어도 알 수 있는 내용은 주석으로 작성하지 않습니다.

```javascript
// 지양: 사용자 목록을 가져온다.
const users = getUsers();
```

구현 이유나 예외 상황처럼 코드만으로 알기 어려운 내용을 작성합니다.

```javascript
// 서버 정책상 빈 배열도 유효한 응답이므로 에러로 처리하지 않는다.
const users = response.users ?? [];
```

완료되지 않은 작업은 이유와 남은 작업을 함께 작성합니다.

```javascript
// TODO: 로그인 API 연결 후 임시 사용자 데이터를 제거한다.
```

---

## 11. 접근성 규칙

* 클릭 동작에는 가능한 한 `div` 대신 `button`을 사용합니다.
* 이미지에는 내용을 설명하는 `alt`를 작성합니다.
* 입력창에는 연결된 `label`을 제공합니다.
* 아이콘만 있는 버튼에는 `aria-label`을 작성합니다.
* 키보드로 주요 기능을 사용할 수 있도록 작성합니다.

```jsx
<button
  type="button"
  aria-label="메뉴 닫기"
  onClick={handleClose}
>
  <CloseIcon />
</button>
```

장식용 이미지는 빈 `alt`를 사용합니다.

```jsx
<img src={decorationImage} alt="" />
```

---

## 12. Git 브랜치 규칙

브랜치는 작업 종류와 이슈 번호를 포함해 작성합니다.

```text
feat/#12-login-page
fix/#24-modal-scroll
design/#31-main-page
refactor/#45-api-structure
```

### 브랜치 종류

| 종류         | 설명          |
| ---------- | ----------- |
| `feat`     | 새로운 기능 구현   |
| `fix`      | 오류 수정       |
| `design`   | UI 및 스타일 수정 |
| `refactor` | 코드 구조 개선    |
| `docs`     | 문서 수정       |
| `chore`    | 설정 및 기타 작업  |

### 작업 흐름

```text
develop
  └── feat/#12-login-page
```

1. 작업 시작 전 `develop` 브랜치를 최신 상태로 갱신합니다.
2. `develop`에서 작업 브랜치를 생성합니다.
3. 작업 브랜치에서 개발을 진행합니다.
4. 작업 완료 후 원격 저장소에 Push합니다.
5. `develop` 브랜치를 대상으로 Pull Request를 생성합니다.
6. 코드 리뷰와 수정이 끝난 뒤 Merge합니다.

`develop`과 `main` 브랜치에는 직접 Push하지 않습니다.

---

## 13. 커밋 메시지 규칙

커밋 메시지는 다음 형식을 사용합니다.

```text
[Type] : 작업 내용
```

### 예시

```text
[Feat] : 카카오 로그인 기능 구현
[Fix] : 모달 스크롤 오류 수정
[Design] : 메인 페이지 반응형 스타일 적용
[Refactor] : 사용자 API 요청 함수 분리
[Docs] : 프론트엔드 컨벤션 문서 추가
[Chore] : ESLint 및 Prettier 설정
```

### 커밋 Type

| Type       | 설명                 |
| ---------- | ------------------ |
| `Feat`     | 새로운 기능 추가          |
| `Fix`      | 오류 수정              |
| `Design`   | UI 및 CSS 수정        |
| `Refactor` | 기능 변경 없는 코드 개선     |
| `Docs`     | 문서 작성 및 수정         |
| `Chore`    | 패키지, 환경 설정 등 기타 작업 |
| `Test`     | 테스트 코드 작성 및 수정     |
| `Rename`   | 파일 또는 폴더 이름 변경     |
| `Remove`   | 파일 또는 코드 삭제        |

### 커밋 기준

* 하나의 커밋에는 하나의 작업 내용을 담습니다.
* 기능 구현과 디자인 수정이 큰 경우 커밋을 분리합니다.
* `수정`, `작업`, `업데이트`처럼 범위가 불분명한 메시지는 사용하지 않습니다.
* 작업 내용을 확인할 수 있도록 구체적으로 작성합니다.

```text
// 지양
[Fix] : 오류 수정
[Feat] : 기능 추가

// 권장
[Fix] : 로그인 실패 시 중복 알림이 표시되는 오류 수정
[Feat] : 사용자 프로필 이미지 등록 기능 구현
```

---

## 14. Pull Request 규칙

PR 제목은 커밋 메시지와 같은 형식을 사용합니다.

```text
[Feat] : 로그인 페이지 구현
```

PR 본문에는 다음 내용을 작성합니다.

```markdown
## 작업 내용

- 로그인 페이지 UI 구현
- 이메일 및 비밀번호 입력 상태 관리
- 로그인 API 연결

## 확인 사항

- 잘못된 입력값에 대한 오류 문구 확인
- 모바일 화면 반응형 확인
- 로그인 성공 후 페이지 이동 확인

## 관련 이슈

- close #12

## 참고 이미지

<!-- UI 작업인 경우 결과 화면을 첨부합니다. -->
```

### PR 작성 기준

* 하나의 PR에는 하나의 기능 또는 하나의 작업 범위를 담습니다.
* UI 작업은 확인할 수 있는 이미지나 영상을 첨부합니다.
* 관련된 이슈 번호를 작성합니다.
* 리뷰어가 확인해야 하는 부분이 있다면 별도로 작성합니다.
* 충돌이 발생한 경우 작성자가 먼저 해결합니다.
* 리뷰 반영 후 변경된 내용을 댓글로 남깁니다.

---

## 15. 코드 리뷰 규칙

리뷰는 사람보다 코드를 기준으로 작성합니다.

```text
수정해주세요.
```

위와 같은 표현보다 수정 이유와 방향을 함께 작성합니다.

```text
이 함수는 다른 페이지에서도 사용될 가능성이 있어 utils로 분리하면 중복을 줄일 수 있을 것 같습니다.
```

### 리뷰 기준

* 기능이 요구사항대로 동작하는지 확인합니다.
* 변수와 함수 이름만으로 역할을 이해할 수 있는지 확인합니다.
* 불필요한 중복 코드가 있는지 확인합니다.
* 공통 컴포넌트로 분리할 부분이 있는지 확인합니다.
* 오류, 로딩, 빈 데이터 상태가 처리됐는지 확인합니다.
* 모바일 화면과 접근성 문제가 없는지 확인합니다.

---

## 16. Merge 전 확인 사항

* 기능이 정상적으로 동작하는가?
* 콘솔 오류가 없는가?
* 임시 `console.log`가 제거됐는가?
* 사용하지 않는 코드와 import가 제거됐는가?
* 주석 처리된 불필요한 코드가 제거됐는가?
* 환경변수나 개인정보가 포함되지 않았는가?
* 모바일 화면에서 UI가 깨지지 않는가?
* 로딩, 오류, 빈 데이터 상태가 처리됐는가?
* ESLint와 Prettier 검사를 통과하는가?
* 관련 이슈와 PR 내용이 작성됐는가?

---

## 17. 지양하는 코드

다음 내용은 특별한 이유가 없다면 사용하지 않습니다.

* 컴포넌트 내부의 직접적인 API URL 작성
* 중첩된 삼항 연산자
* 의미 없는 변수명
* 배열 인덱스를 이용한 무분별한 `key` 설정
* 여러 컴포넌트에서 반복되는 동일 코드
* 병합 전 남아 있는 `console.log`
* 사용하지 않는 import와 변수
* 주석 처리된 이전 코드
* 하드코딩된 민감 정보
* 불필요한 `!important`
* React 외부에서의 직접적인 DOM 조작
