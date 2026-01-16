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

