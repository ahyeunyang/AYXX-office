# AYXX Office

AYXX Office는 React, TypeScript, Vite, Electron으로 만든 설치형 데스크톱 앱 프로젝트입니다.

## 실행 방법

아래 명령으로 개발용 데스크톱 앱을 실행할 수 있습니다.

```bash
npm install
npm run dev:electron
```

## 현재 반영된 내용

- Electron 기반 데스크톱 앱 실행 환경 구성
- React + TypeScript + Vite 프로젝트 기본 구조 세팅
- SCSS 기반 스타일 시스템 적용
- 공통 사이드바와 페이지별 스타일 분리
- 디자인 토큰 기반 색상, 글꼴, 반경 관리
- 공지사항 목록·검색·분류·작성·수정·삭제·상단 고정 (기기 내 저장)

## 프로젝트 구조

- src/App.tsx: 앱 진입점
- src/pages/NoticesPage.tsx: 공지사항 페이지
- src/styles/pages/NoticesPage.scss: 공지사항 SCSS
- src/styles/\_tokens.scss: 공통 디자인 토큰
- src/styles/layout/AppLayout.scss: 공통 레이아웃 스타일
- src/styles/base/global.scss: 전역 스타일
- src/assets: 이미지 자원 폴더
- electron/main.js: Electron 메인 프로세스
- electron/preload.cjs: Electron preload 스크립트

## 개발 방향

- 페이지별로 스타일과 자원을 분리해 관리
- 컴포넌트는 재사용 가능하게 분리
- SCSS와 토큰 기반으로 디자인 시스템 확장 가능하게 구성
- 이후 기능이 늘어나면 라우팅, 상태 관리, 데이터 연동을 추가할 예정

## 참고 문서

- 프로젝트 계획서: PROJECT_PLAN.md



## 스타일 단위

기준 글자 크기는 `src/styles/base/_reset.scss`에서만 px로 정의합니다.
나머지 스타일 길이는 rem으로 작성하며, 현재 기준은 1rem = 14px입니다.
