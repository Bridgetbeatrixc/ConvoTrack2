import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vjtlmaawyqhduijrduza.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqdGxtYWF3eXFoZHVpanJkdXphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1Njg2NDMsImV4cCI6MjA2NTE0NDY0M30.bbScxk_Bl_D-QbV55JiQ3jnCSa66fbhDxJqe-eO5b-k'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database table names
export const TABLES = {
  AGENTS: 'ai_agents',
  CHAT_SESSIONS: 'chat_sessions', 
  CHAT_MESSAGES: 'chat_messages',
  USERS: 'users'
}

// Auth helpers
export const auth = {
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: () => {
    return supabase.auth.getUser()
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helpers
export const db = {
  // AI Agents
  agents: {
    create: async (agentData) => {
      const { data, error } = await supabase
        .from(TABLES.AGENTS)
        .insert([agentData])
        .select()
      return { data: data?.[0], error }
    },

    getAll: async (userId) => {
      const { data, error } = await supabase
        .from(TABLES.AGENTS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      return { data, error }
    },

    getById: async (id) => {
      const { data, error } = await supabase
        .from(TABLES.AGENTS)
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },

    update: async (id, updates) => {
      const { data, error } = await supabase
        .from(TABLES.AGENTS)
        .update(updates)
        .eq('id', id)
        .select()
      return { data: data?.[0], error }
    },

    delete: async (id) => {
      const { data, error } = await supabase
        .from(TABLES.AGENTS)
        .delete()
        .eq('id', id)
      return { data, error }
    }
  },

  // Chat Sessions
  chatSessions: {
    create: async (sessionData) => {
      const { data, error } = await supabase
        .from(TABLES.CHAT_SESSIONS)
        .insert([sessionData])
        .select()
      return { data: data?.[0], error }
    },

    getAll: async (filters = {}) => {
      let query = supabase
        .from(TABLES.CHAT_SESSIONS)
        .select('*')
        .order('last_activity', { ascending: false })

      if (filters.agentId) {
        query = query.eq('agent_id', filters.agentId)
      }
      if (filters.userId) {
        query = query.eq('user_id', filters.userId)
      }
      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      const { data, error } = await query
      return { data, error }
    },

    getById: async (id) => {
      const { data, error } = await supabase
        .from(TABLES.CHAT_SESSIONS)
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },

    update: async (id, updates) => {
      const { data, error } = await supabase
        .from(TABLES.CHAT_SESSIONS)
        .update(updates)
        .eq('id', id)
        .select()
      return { data: data?.[0], error }
    },

    close: async (id) => {
      const { data, error } = await supabase
        .from(TABLES.CHAT_SESSIONS)
        .update({ 
          status: 'closed',
          last_activity: new Date().toISOString()
        })
        .eq('id', id)
        .select()
      return { data: data?.[0], error }
    }
  },

  // Chat Messages
  chatMessages: {
    create: async (messageData) => {
      const { data, error } = await supabase
        .from(TABLES.CHAT_MESSAGES)
        .insert([messageData])
        .select()
      return { data: data?.[0], error }
    },

    getBySession: async (sessionId, limit = 50) => {
      const { data, error } = await supabase
        .from(TABLES.CHAT_MESSAGES)
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
        .limit(limit)
      return { data, error }
    },

    subscribeToSession: (sessionId, callback) => {
      return supabase
        .channel(`messages:${sessionId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: TABLES.CHAT_MESSAGES,
          filter: `session_id=eq.${sessionId}`
        }, callback)
        .subscribe()
    }
  }
}

export default supabase 