# AYXX Office 프로젝트 초기 계획

## 1. 프로젝트 개요

이 문서는 AYXX Office 프로젝트의 초기 기획과 개발 시작을 위한 기본 문서입니다.
현재는 React + TypeScript + Vite 기반의 설치형 데스크톱 앱 구조를 먼저 세팅한 상태입니다.

## 2. 목표

- 설치형 데스크톱 앱으로 실행 가능한 기본 구조 만들기
- TypeScript 기반으로 안정적인 개발 환경 구성하기
- 이후 기능 확장에 따라 페이지, 상태 관리, API 연동을 유연하게 추가할 수 있도록 준비하기

## 3. 기본 기술 스택

- React 19
- TypeScript
- Vite 8
- Electron
- CSS

## 4. 현재 구조

- src/App.tsx: 메인 화면 컴포넌트
- src/main.tsx: 앱 진입점
- src/App.css: 기본 스타일
- electron/main.js: Electron 메인 프로세스
- electron/preload.js: Electron preload 스크립트

## 5. 다음 개발 단계

1. 서비스 요구사항 정리
2. 주요 페이지 구조 설계
3. 공통 레이아웃 구성
4. 데이터/API 연동 설계
5. 설치 파일 패키징 구성

## 6. 실행 방법

```bash
npm install
npm run dev:electron
```

## 7. 참고

이 문서는 초기 세팅용이며, 프로젝트의 실제 기능 명세가 정리되면 이어서 상세화할 예정입니다.
