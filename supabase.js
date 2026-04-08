// src/lib/supabase.js
// ─── Mitchell Realty Hub — Supabase Client ───────────────────
//
// SETUP:
// 1. Create a .env file in your project root (NEVER commit this)
// 2. Add these two lines with YOUR values from Supabase Dashboard → Settings → API:
//
//    VITE_SUPABASE_URL=https://your-project-id.supabase.co
//    VITE_SUPABASE_ANON_KEY=your-anon-key-here
//
// 3. Add .env to your .gitignore (the template below includes it)
// ──────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase credentials. Copy .env.example to .env and fill in your values.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── AUTH HELPERS ────────────────────────────────────────────

export async function signUp(email, password, fullName, role = 'client') {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role },
    },
  });
  return { data, error };
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signInWithMagicLink(email) {
  const { data, error } = await supabase.auth.signInWithOtp({ email });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getProfile() {
  const session = await getSession();
  if (!session) return null;

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return data;
}

// ─── DATA HELPERS ────────────────────────────────────────────

export const db = {
  // Clients
  async getClients() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('updated_at', { ascending: false });
    return { data, error };
  },

  async getClient(id) {
    const { data, error } = await supabase
      .from('clients')
      .select('*, client_notes(*), transactions(*)')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async createClient(client) {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();
    return { data, error };
  },

  async updateClient(id, updates) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Notes
  async addNote(clientId, content) {
    const session = await getSession();
    const { data, error } = await supabase
      .from('client_notes')
      .insert({ client_id: clientId, author_id: session.user.id, content })
      .select()
      .single();
    return { data, error };
  },

  // Transactions
  async getTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, transaction_steps(*), clients(name)')
      .order('updated_at', { ascending: false });
    return { data, error };
  },

  async updateStep(stepId, completed) {
    const { data, error } = await supabase
      .from('transaction_steps')
      .update({ completed, completed_date: completed ? new Date().toISOString() : null })
      .eq('id', stepId)
      .select()
      .single();
    return { data, error };
  },

  // Files
  async getFiles(clientId = null) {
    let query = supabase.from('files').select('*, clients(name)').order('created_at', { ascending: false });
    if (clientId) query = query.eq('client_id', clientId);
    const { data, error } = await query;
    return { data, error };
  },

  async uploadFile(file, clientId, category = 'general', visibleToClient = false) {
    const session = await getSession();
    const path = `${clientId}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('client-files')
      .upload(path, file);

    if (uploadError) return { data: null, error: uploadError };

    const { data, error } = await supabase
      .from('files')
      .insert({
        client_id: clientId,
        uploaded_by: session.user.id,
        file_name: file.name,
        file_path: path,
        file_size: file.size,
        category,
        visible_to_client: visibleToClient,
      })
      .select()
      .single();

    return { data, error };
  },

  // Messages
  async getMessages(otherUserId) {
    const session = await getSession();
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:profiles!sender_id(full_name), recipient:profiles!recipient_id(full_name)')
      .or(`sender_id.eq.${session.user.id},recipient_id.eq.${session.user.id}`)
      .order('created_at', { ascending: true });
    return { data, error };
  },

  async sendMessage(recipientId, content, clientId = null) {
    const session = await getSession();
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: session.user.id,
        recipient_id: recipientId,
        client_id: clientId,
        content,
      })
      .select()
      .single();
    return { data, error };
  },

  // Team
  async getTeammates() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('role', ['admin', 'teammate'])
      .order('full_name');
    return { data, error };
  },

  async updatePermissions(userId, permissions) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ permissions })
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  // Saved Searches
  async getSavedSearches(clientId = null) {
    let query = supabase.from('saved_searches').select('*').order('last_updated', { ascending: false });
    if (clientId) query = query.eq('client_id', clientId);
    const { data, error } = await query;
    return { data, error };
  },

  // Activity Log
  async logActivity(action, detail, entityType = null, entityId = null) {
    const session = await getSession();
    await supabase.from('activity_log').insert({
      user_id: session?.user?.id,
      action,
      detail,
      entity_type: entityType,
      entity_id: entityId,
    });
  },

  async getRecentActivity(limit = 20) {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },
};
