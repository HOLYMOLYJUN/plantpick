import { createClient } from "@supabase/supabase-js";

// Supabase 환경 변수
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

// 서버 사이드용 Supabase 클라이언트
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 타입 정의
export interface Database {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string;
          session_id: string;
          created_at: string;
          last_accessed_at: string | null;
        };
        Insert: {
          id?: string;
          session_id: string;
          created_at?: string;
          last_accessed_at?: string | null;
        };
        Update: {
          id?: string;
          session_id?: string;
          created_at?: string;
          last_accessed_at?: string | null;
        };
      };
    };
  };
}

