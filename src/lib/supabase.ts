import { createClient, type User } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const db = createClient(supabaseUrl, supabaseAnonKey);
export const supabase = db;

export const signInWithEmailAndPassword = async (_auth: unknown, email: string, password: string) => {
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const createUserWithEmailAndPassword = async (_auth: unknown, email: string, password: string) => {
  const { data, error } = await db.auth.signUp({ email, password });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await db.auth.signOut();
  if (error) throw error;
};

export const updateProfile = async (_user: User | null, { displayName }: { displayName: string }) => {
  if (!_user) throw new Error('No authenticated user');
  const { data, error } = await db.auth.updateUser({ data: { full_name: displayName } });
  if (error) throw error;
  return data;
};

export const getCurrentUser = async () => {
  const { data, error } = await db.auth.getSession();
  if (error) {
    if (error.message?.includes('Auth session missing')) {
      return null;
    }
    throw error;
  }
  return data?.session?.user ?? null;
};

export const getSession = async () => {
  const { data, error } = await db.auth.getSession();
  if (error) throw error;
  return data.session;
};