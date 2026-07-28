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
- 페이지/컴포넌트/스타일/이미지 자원 분리 구조 정리
- 디자인 토큰 기반 색상, 간격, 반경, 그림자 관리

## 프로젝트 구조

- src/App.tsx: 앱 진입점
- src/pages/HomePage.tsx: 홈 페이지 컴포넌트
- src/components/HeroCard.tsx: 공통 UI 컴포넌트
- src/styles/pages/HomePage.scss: 페이지별 SCSS
- src/styles/tokens/\_colors.scss: 색상 토큰
- src/styles/tokens/\_tokens.scss: 간격/반경/그림자 토큰
- src/styles/base/\_mixins.scss: 공통 믹스인
- src/assets/images: 이미지 자원 폴더
- electron/main.js: Electron 메인 프로세스
- electron/preload.js: Electron preload 스크립트

## 개발 방향

- 페이지별로 스타일과 자원을 분리해 관리
- 컴포넌트는 재사용 가능하게 분리
- SCSS와 토큰 기반으로 디자인 시스템 확장 가능하게 구성
- 이후 기능이 늘어나면 라우팅, 상태 관리, 데이터 연동을 추가할 예정

## 참고 문서

- 프로젝트 계획서: PROJECT_PLAN.md
