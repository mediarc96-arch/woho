# WoHo API

현지 젊은 호스트(워홀러·유학생)와 여행자를 연결하는 투어 & 커뮤니티 플랫폼의 백엔드 API.

NestJS + Prisma(PostgreSQL) 기반이며 **클린 아키텍처**(도메인 / 애플리케이션 / 인프라 / 프레젠테이션 4계층)로 구성돼 있습니다.

## 요구 사항

- **Node.js ≥ 20** (권장: 22 LTS)
- **Docker** (로컬 PostgreSQL 실행용) — 또는 접근 가능한 PostgreSQL 16

Windows / macOS / Linux 어디서나 동일하게 개발·실행됩니다. (네이티브 의존성 없음 — 비밀번호 해싱은 순수 JS `bcryptjs` 사용)

## 빠른 시작

```bash
# 1) 의존성 설치 (postinstall 로 Prisma Client 자동 생성)
npm install

# 2) 환경 변수 준비
cp .env.example .env          # Windows(PowerShell): copy .env.example .env
#   .env 의 JWT_SECRET 을 임의의 긴 문자열로 바꾸세요

# 3) PostgreSQL 기동
docker compose up -d

# 4) 마이그레이션 적용 (스키마 → DB)
npx prisma migrate dev

# 5) 개발 서버 실행 (watch)
npm run start:dev
```

기본 포트는 `3000` (`.env` 의 `PORT` 로 변경). API 루트: `http://localhost:3000`.

## 환경 변수 (`.env`)

| 변수 | 설명 | 예시 |
|---|---|---|
| `DATABASE_URL` | PostgreSQL 접속 문자열 | `postgresql://user:password@localhost:5432/woho?schema=public` |
| `PORT` | HTTP 포트 | `3000` |
| `JWT_SECRET` | JWT 서명 비밀키 (**운영 시 반드시 교체**) | `change-me-to-a-long-random-secret` |
| `JWT_EXPIRES_IN` | 액세스 토큰 만료 | `7d` |

`docker-compose.yml` 의 기본 DB 자격증명은 `user / password / woho` 이며 `.env.example` 과 일치합니다.

## 주요 스크립트

| 명령 | 설명 |
|---|---|
| `npm run start:dev` | watch 모드 개발 서버 |
| `npm run build` | 프로덕션 빌드 (`dist/`) |
| `npm run start:prod` | 빌드 결과 실행 |
| `npm run lint` | ESLint (+ 자동 수정) |
| `npm run prisma:studio` | Prisma Studio (DB GUI) |
| `npx prisma migrate dev` | 마이그레이션 생성·적용 |

## API 개요

- `POST /auth/register`, `POST /auth/login` — 가입 / 로그인 (JWT 발급)
- `POST /tours` (HOST), `PATCH /tours/:id/publish` (HOST), `GET /tours`, `GET /tours/:id`
- `POST /bookings`, `GET /bookings`, `PATCH /bookings/:id/{confirm|cancel|complete}`
- `POST /reviews`, `GET /reviews?tourId=`, `GET /tours/:id/rating`
- `GET /hosts/:id` — 호스트 프로필(종합 평점 + 공개 투어)
- `POST /conversations`, `GET /conversations`, `GET|POST /conversations/:id/messages`
- WebSocket `/chat` 네임스페이스 — 실시간 채팅 (핸드셰이크 시 `auth.token` 으로 인증)

보호된 엔드포인트는 `Authorization: Bearer <accessToken>` 헤더가 필요합니다.

## 아키텍처

각 도메인 모듈(`src/modules/*`)은 4계층으로 나뉩니다.

```
domain/          엔티티 · 값 객체 · 리포지토리 포트 · 도메인 예외 (프레임워크 무지)
application/     유스케이스 · DTO · 정책
infrastructure/  Prisma 리포지토리 · 매퍼 · 외부 서비스 구현
presentation/    컨트롤러 · 게이트웨이 · 가드
```

모듈 간 결합은 도메인 리포지토리 포트(예: `USER_REPOSITORY`)를 통해서만 이뤄집니다.
