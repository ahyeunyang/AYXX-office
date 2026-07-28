# AYXX Office 프로젝트 초기 계획

## 1. 프로젝트 개요

이 문서는 AYXX Office 프로젝트의 초기 기획과 개발 시작을 위한 기본 문서입니다.
현재는 React, TypeScript, Vite, Electron을 사용해 설치형 데스크톱 앱으로 실행할 수 있는 기본 구조를 만들고 있습니다.

## 2. 목표

- 설치형 데스크톱 앱으로 실행 가능한 기본 구조 만들기
- TypeScript 기반으로 안정적인 개발 환경 구성하기
- 페이지/컴포넌트/스타일/이미지 자원을 분리해 확장 가능한 구조 만들기
- SCSS와 토큰 기반 디자인 시스템으로 UI 확장성을 높이기
- 이후 기능 확장에 따라 상태 관리, API 연동, 라우팅을 유연하게 추가할 수 있도록 준비하기

## 3. 기본 기술 스택

- React 19
- TypeScript
- Vite 8
- Electron
- SCSS
- CSS 토큰 기반 스타일 관리

## 4. 현재 구조

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

## 5. 현재 정리된 개발 원칙

1. 페이지별로 스타일과 자원을 분리해 관리한다.
2. 컴포넌트는 재사용 가능하게 분리한다.
3. SCSS와 토큰 기반으로 디자인 시스템을 확장 가능하게 설계한다.
4. 기능이 늘어날 때마다 구조를 깨지 않도록 폴더 책임을 분명히 한다.

## 6. 다음 개발 단계

1. 서비스 요구사항 정리
2. 주요 페이지 구조 설계
3. 공통 레이아웃 및 네비게이션 구성
4. 데이터 및 API 연동 설계
5. 설치 파일 패키징 구성
6. 다크모드, 타이포그래피 토큰, 테마 확장 설계

## 7. 실행 방법

```bash
npm install
npm run dev:electron
```

## 8. 참고

이 문서는 초기 세팅용 문서이며, 프로젝트의 구조와 개발 방향이 정리되면 계속 업데이트할 예정입니다.
