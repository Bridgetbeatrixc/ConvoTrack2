const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vjtlmaawyqhduijrduza.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqdGxtYWF3eXFoZHVpanJkdXphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1Njg2NDMsImV4cCI6MjA2NTE0NDY0M30.bbScxk_Bl_D-QbV55JiQ3jnCSa66fbhDxJqe-eO5b-k';

let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase client initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Supabase client:', error.message);
  process.exit(1);
}

// Database table names
const TABLES = {
  AGENTS: 'ai_agents',
  CHAT_SESSIONS: 'chat_sessions',
  CHAT_MESSAGES: 'chat_messages',
  KNOWLEDGE_DOCUMENTS: 'knowledge_documents',
  USERS: 'users'
};

// Database operations
const db = {
  // AI Agents
  agents: {
    create: async (agentData) => {
      const { data, error } = await supabase
        .from(TABLES.AGENTS)
        .insert([{
          ...agentData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
      return { data: data?.[0], error };
    },

    getAll: async (userId) => {
      const { data, error } = await supabase
        .from(TABLES.AGENTS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return { data, error };
    },

    getById: async (id) => {
      const { data, error } = await supabase
        .from(TABLES.AGENTS)
        .select('*')
        .eq('id', id)
        .single();
      return { data, error };
    },

    update: async (id, updates) => {
      const { data, error } = await supabase
        .from(TABLES.AGENTS)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();
      return { data: data?.[0], error };
    },

    delete: async (id) => {
      const { data, error } = await supabase
        .from(TABLES.AGENTS)
        .delete()
        .eq('id', id);
      return { data, error };
    }
  },

  // Chat Sessions
  chatSessions: {
    create: async (data) => {
      return supabase
        .from('chat_sessions')
        .insert([{
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'active'
        }])
        .select('*, ai_agents(*)');
    },

    getById: async (sessionId) => {
      return supabase
        .from('chat_sessions')
        .select('*, ai_agents(*)')
        .eq('id', sessionId)
        .single();
    },

    getAllWithDetails: async (filters = {}) => {
      let query = supabase
        .from('chat_sessions')
        .select(`
          *,
          ai_agents(*),
          last_message:chat_messages(
            id,
            content,
            sender,
            timestamp
          )
        `)
        .eq('user_id', filters.userId)
        .order('created_at', { ascending: false });

      if (filters.agentId) {
        query = query.eq('agent_id', filters.agentId);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      return query;
    },

    update: async (sessionId, data) => {
      return supabase
        .from('chat_sessions')
        .update(data)
        .eq('id', sessionId)
        .select('*, ai_agents(*)');
    },

    delete: async (sessionId) => {
      if (!sessionId || isNaN(sessionId)) {
        throw new Error('Valid session ID is required');
      }
      return supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);
    }
  },

  // Chat Messages
  chatMessages: {
    create: async (data) => {
      return supabase
        .from('chat_messages')
        .insert([{
          ...data,
          timestamp: new Date().toISOString()
        }])
        .select();
    },

    getBySession: async (sessionId, limit = 50, offset = 0) => {
      return supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true })
        .range(offset, offset + limit - 1);
    },

    getCount: async (sessionId) => {
      return supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('session_id', sessionId);
    },

    getRecent: async (sessionId, limit = 10) => {
      return supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: false })
        .limit(limit);
    },

    deleteBySession: async (sessionId) => {
      if (!sessionId || isNaN(sessionId)) {
        throw new Error('Valid session ID is required');
      }
      return supabase
        .from('chat_messages')
        .delete()
        .eq('session_id', sessionId);
    }
  },

  // Knowledge Documents
  knowledgeDocuments: {
    create: async (documentData) => {
      const { data, error } = await supabase
        .from(TABLES.KNOWLEDGE_DOCUMENTS)
        .insert([{
          ...documentData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
      return { data: data?.[0], error };
    },

    getByAgent: async (agentId) => {
      const { data, error } = await supabase
        .from(TABLES.KNOWLEDGE_DOCUMENTS)
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false });
      return { data, error };
    },

    getById: async (id) => {
      const { data, error } = await supabase
        .from(TABLES.KNOWLEDGE_DOCUMENTS)
        .select('*')
        .eq('id', id)
        .single();
      return { data, error };
    },

    delete: async (id) => {
      const { data, error } = await supabase
        .from(TABLES.KNOWLEDGE_DOCUMENTS)
        .delete()
        .eq('id', id);
      return { data, error };
    },

    searchContent: async (agentId, searchTerm) => {
      const { data, error } = await supabase
        .from(TABLES.KNOWLEDGE_DOCUMENTS)
        .select('*')
        .eq('agent_id', agentId)
        .textSearch('content', searchTerm);
      return { data, error };
    }
  }
};

module.exports = {
  supabase,
  db,
  TABLES
}; 