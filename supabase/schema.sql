-- 세션 테이블 생성
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ,
  CONSTRAINT sessions_session_id_key UNIQUE (session_id)
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON public.sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON public.sessions(created_at DESC);

-- RLS (Row Level Security) 정책 설정
-- 모든 사용자가 읽기/쓰기 가능하도록 설정 (세션 기반 인증)
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Allow public read access" ON public.sessions
  FOR SELECT
  USING (true);

-- 모든 사용자가 쓰기 가능
CREATE POLICY "Allow public insert access" ON public.sessions
  FOR INSERT
  WITH CHECK (true);

-- 모든 사용자가 업데이트 가능
CREATE POLICY "Allow public update access" ON public.sessions
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 식물 테이블 생성
CREATE TABLE IF NOT EXISTS public.plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES public.sessions(session_id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('sunflower', 'azalea', 'rose', 'tulip')),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_cared_at TIMESTAMPTZ,
  is_mature BOOLEAN NOT NULL DEFAULT false,
  is_exchanged BOOLEAN NOT NULL DEFAULT false,
  exchanged_at TIMESTAMPTZ,
  CONSTRAINT plants_session_id_unique UNIQUE (session_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_plants_session_id ON public.plants(session_id);
CREATE INDEX IF NOT EXISTS idx_plants_created_at ON public.plants(created_at DESC);

-- RLS 정책 설정
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.plants
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON public.plants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON public.plants
  FOR UPDATE USING (true) WITH CHECK (true);

-- 케어 기록 테이블 생성
CREATE TABLE IF NOT EXISTS public.care_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID NOT NULL REFERENCES public.plants(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('water', 'fertilizer', 'sunlight', 'wind')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_care_records_plant_id ON public.care_records(plant_id);
CREATE INDEX IF NOT EXISTS idx_care_records_timestamp ON public.care_records(timestamp DESC);

-- RLS 정책 설정
ALTER TABLE public.care_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.care_records
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON public.care_records
  FOR INSERT WITH CHECK (true);

