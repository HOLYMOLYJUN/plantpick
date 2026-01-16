# PlantPick 🌱

식물 키우기 홍보용 앱 프로젝트

## 프로젝트 개요

QR 코드를 통해 접속하여 4가지 식물 중 하나를 선택하고, 며칠간 물, 비료, 햇빛, 바람을 주며 키운 후, 현장에서 실제 꽃과 교환하는 이벤트 앱입니다.

## 기술 스택

### Frontend
- **Language**: TypeScript
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4, clsx
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Validation**: Zod
- **Date Handling**: dayjs
- **Animation**: Framer Motion
- **QR Code**: qrcode.react

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: 세션 기반 (QR 코드 세션 ID)
- **API**: Next.js API Routes

## 프로젝트 구조

```
plantpick/
├── app/              # Next.js App Router
├── components/        # React 컴포넌트
├── lib/              # 유틸리티 함수 및 설정
├── stores/           # Zustand 스토어
├── types/            # TypeScript 타입 정의
└── public/           # 정적 파일
```

## 주요 기능

1. **QR 접속 기능**: QR 코드를 통해 앱 접속
2. **식물 선택**: 4가지 식물 중 선택 (해바라기, 진달래, 장미, 튤립)
3. **식물 키우기**: 4일간 물, 비료, 햇빛, 바람 제공
4. **교환 처리**: 현장에서 실제 꽃과 교환 후 완료 처리

## 시스템 아키텍처

### 사용자 식별
- **QR 코드 세션 ID**: QR 코드에 포함된 고유 세션 ID로 사용자 식별
- 추가 인증 없이 세션 기반으로 동작

### 데이터베이스
- **Supabase**: PostgreSQL 기반 데이터베이스 사용
- 실시간 데이터 동기화 및 영구 저장

### 인증 방식
- **세션 기반 인증**: 추가 인증 없이 QR 코드 세션 ID로 식별
- 회원가입/로그인 불필요

### 데이터 구조

#### 사용자 (User)
```typescript
{
  id: string
  sessionId: string      // QR 코드 세션 ID
  createdAt: Date
}
```

#### 식물 (Plant)
```typescript
{
  id: string
  userId: string
  type: PlantType        // sunflower | azalea | rose | tulip
  createdAt: Date
  careHistory: CareRecord[]
  isMature: boolean
  isExchanged: boolean
  exchangedAt?: Date
}
```

#### 케어 기록 (CareRecord)
```typescript
{
  id: string
  plantId: string
  type: CareType         // water | fertilizer | sunlight | wind
  timestamp: Date
}
```

## 케어 시스템 규칙

### 케어 제한
- **하루 최대 5회**: 하루 동안 최대 5번의 케어 가능
- **4일간 케어 기간**: 식물을 키우는 기간은 총 4일

### 케어 요구사항
각 식물마다 4일간 다음 케어가 필요합니다 (예: 물 3회, 바람 5회, 비료 2회, 햇빛 6회 = 총 16회):

| 식물 | 물 | 비료 | 햇빛 | 바람 | 총합 |
|------|----|----|----|----|----|
| 해바라기 | 5회 | 3회 | 7회 | 2회 | 17회 |
| 진달래 | 4회 | 4회 | 5회 | 3회 | 16회 |
| 장미 | 6회 | 4회 | 6회 | 3회 | 19회 |
| 튤립 | 5회 | 3회 | 5회 | 4회 | 17회 |

**참고**: 
- 현재 설정된 케어 횟수는 예시이며, 실제 요구사항에 맞게 조정 예정입니다
- 각 식물마다 4일간 총 16회의 케어가 필요할 예정입니다 (물/비료/햇빛/바람 합계)
- 케어 타입별 횟수는 식물마다 다를 수 있습니다

### 케어 로직
1. **하루 최대 5회 제한**: 하루 동안 5회를 초과하여 케어 불가
2. **케어 타입별 필요 횟수 확인**: 각 케어 타입(물/비료/햇빛/바람)별로 필요한 횟수 확인
3. **4일 경과 확인**: 식물 생성일로부터 4일이 경과해야 함
4. **성체 상태 변경**: 4일 경과 + 모든 케어 완료 시 성체 상태로 변경
5. **현장 교환**: 성체 상태에서 현장에서 실제 꽃과 교환 가능

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
npm run build
```

### 프로덕션 실행

```bash
npm start
```

## 라이선스

이 프로젝트는 이벤트 홍보용으로 제작되었습니다.
