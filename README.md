# CapstonDesign

매일 제공되는 주제를 바탕으로 일기를 작성하고, 다른 사용자의 일기를 둘러볼 수 있는 React 기반 일기 공유 서비스입니다.

## 프로젝트 소개

CapstonDesign은 "오늘 어떤 이야기를 남길까?"라는 고민을 덜어주는 일기 작성 웹 애플리케이션입니다. 사용자는 매일 제공되는 랜덤 주제로 일기를 작성할 수 있고, 자유 주제로도 기록을 남길 수 있습니다. 작성한 일기는 캘린더와 개인 일기 목록에서 다시 확인할 수 있으며, 공개된 다른 사용자의 최근 일기도 함께 살펴볼 수 있습니다.

## 주요 기능

- 오늘의 일기 주제 조회 및 주제 기반 일기 작성
- 자유 주제 일기 작성 옵션
- 최근 작성된 공개 일기 목록 및 상세 모달
- 제목 기반 일기 검색 및 최신순/오래된순 정렬
- 내 일기 목록 조회, 수정, 삭제
- 일기 작성 여부를 월별 캘린더에 표시
- 회원가입, 로그인, 로그아웃
- Access Token 만료 시 Refresh Token 기반 자동 재발급
- 내 정보 조회, 프로필 이미지 변경, 비밀번호 변경
- 내 일기 및 내 프로필 공개 여부 설정

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| Framework | React 19, Vite |
| Routing | React Router DOM |
| HTTP Client | Axios |
| State / Form | React Context API, React Hook Form |
| Date | Day.js, date-fns |
| UI | CSS Modules, React Slick, React Calendar |
| Auth | react-cookie 기반 토큰 저장 |
| Lint / Format | ESLint, Prettier |

## 프로젝트 구조

```text
CapstonDesign
├─ public
│  ├─ calendar.png
│  ├─ diary.png
│  ├─ footer1.png
│  ├─ footer2.png
│  ├─ footer3.png
│  ├─ lock.png
│  └─ pen.png
├─ src
│  ├─ App.jsx
│  ├─ main.jsx
│  ├─ App.css
│  ├─ index.css
│  └─ component
│     ├─ Calendar
│     ├─ Changepw
│     ├─ CreatContextAPI
│     ├─ Hook
│     ├─ Join
│     ├─ Layout
│     ├─ Login
│     ├─ Main
│     ├─ Modal
│     ├─ Mydiary
│     ├─ Nav
│     ├─ Previous
│     ├─ Profile
│     ├─ UserDiaryList
│     ├─ Userrinfo
│     └─ WriteDiary
├─ package.json
├─ vite.config.js
└─ README.md
```

## 라우팅

| Path | 화면 |
| --- | --- |
| `/` | 메인 화면, 오늘의 주제, 최근 공개 일기 |
| `/login` | 로그인 |
| `/join` | 회원가입 |
| `/calendar` | 내 일기 캘린더 |
| `/write-diary` | 일기 작성 |
| `/my-diary` | 내 일기 목록 |
| `/edit-diary` | 내 일기 수정 |
| `/user-diaries` | 공개 일기 목록 |
| `/users-diaries` | 사용자 일기 목록 |
| `/user-info` | 내 정보 및 공개 설정 |
| `/exinfo` | 다른 사용자 정보 |
| `/profile` | 프로필 이미지 변경 |
| `/changepw` | 비밀번호 변경 |
| `/previous-page` | 같은 주제로 작성한 이전 일기 확인 |

## API 설정

Axios 인스턴스는 `src/component/CreatContextAPI/api.jsx`에서 관리합니다.

```js
baseURL: "https://daisy.wisoft.io/yehwan/app1"
```

요청 인터셉터에서 `access_token` 쿠키를 Authorization 헤더에 추가하고, 응답 인터셉터에서 토큰 만료(`TOKEN_EXPIRED`) 시 `/auth/refresh`로 Access Token을 재발급합니다.

## 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/jinkong9/CapstonDesign.git
cd CapstonDesign
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

Vite 개발 서버가 실행되면 터미널에 표시되는 로컬 주소로 접속합니다.

## 사용 가능한 스크립트

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 생성 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | ESLint 검사 |

## 개발 메모

- 인증 토큰은 `react-cookie`를 통해 `access_token`, `refresh_token` 쿠키로 관리합니다.
- 로그인 상태와 사용자 이름은 `AuthProvider`에서 Context로 제공합니다.
- 일기 상세 보기 모달 상태는 `ModalProvider`에서 관리합니다.
- 각 화면의 스타일은 컴포넌트별 CSS Module로 분리되어 있습니다.
- 백엔드 API 서버 연결이 필요하므로 일부 기능은 네트워크 및 서버 상태에 영향을 받습니다.
