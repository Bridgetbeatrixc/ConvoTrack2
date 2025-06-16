-- Create AI Agents table
CREATE TABLE ai_agents (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'demo-user',
    name TEXT NOT NULL,
    behaviour TEXT NOT NULL,
    business_description TEXT,
    platform TEXT DEFAULT 'web',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Chat Sessions table
CREATE TABLE chat_sessions (
    id BIGSERIAL PRIMARY KEY,
    agent_id BIGINT REFERENCES ai_agents(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL DEFAULT 'demo-user',
    customer_name TEXT DEFAULT 'Anonymous',
    customer_phone TEXT,
    platform TEXT DEFAULT 'web',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity TIMESTAMPTZ DEFAULT NOW()
);

-- Create Chat Messages table
CREATE TABLE chat_messages (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT REFERENCES chat_sessions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'text',
    sender TEXT NOT NULL CHECK (sender IN ('customer', 'agent')),
    status TEXT DEFAULT 'delivered',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Knowledge Base Documents table
CREATE TABLE knowledge_documents (
    id BIGSERIAL PRIMARY KEY,
    agent_id BIGINT REFERENCES ai_agents(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    content TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    upload_path TEXT,
    processed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_ai_agents_user_id ON ai_agents(user_id);
CREATE INDEX idx_chat_sessions_agent_id ON chat_sessions(agent_id);
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_knowledge_documents_agent_id ON knowledge_documents(agent_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_ai_agents_updated_at 
    BEFORE UPDATE ON ai_agents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to update last_activity on chat_sessions
CREATE OR REPLACE FUNCTION update_session_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_sessions 
    SET last_activity = NOW() 
    WHERE id = NEW.session_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update session activity when new message is added
CREATE TRIGGER update_session_activity_trigger
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_session_activity();

-- Insert sample AI agents
INSERT INTO ai_agents (name, behaviour, business_description, platform, user_id) VALUES
(
    'Admin Rina',
    'Anda adalah asisten customer service yang ramah dan profesional untuk bisnis toko kue. Selalu sapa pelanggan dengan hangat, tawarkan bantuan, dan berikan informasi produk dengan detail. Gunakan bahasa Indonesia yang sopan dan mudah dipahami.',
    'Toko kue dan bakery yang menjual berbagai macam kue ulang tahun, kue custom, roti, dan pastry premium.',
    'WhatsApp',
    'demo-user'
),
(
    'Customer Support Bot',
    'Anda adalah asisten customer service yang membantu pelanggan dengan pertanyaan umum, keluhan, dan permintaan informasi. Berikan respon yang cepat, akurat, dan empati.',
    'Platform e-commerce yang menjual berbagai produk elektronik dan gadget terbaru.',
    'Web',
    'demo-user'
);

-- Enable Row Level Security (RLS)
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (for demo, we'll use simple policies)
-- In production, you'd want more sophisticated user-based policies

-- AI Agents policies
CREATE POLICY "Users can view their own agents" ON ai_agents
    FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert their own agents" ON ai_agents
    FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update their own agents" ON ai_agents
    FOR UPDATE USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can delete their own agents" ON ai_agents
    FOR DELETE USING (user_id = current_setting('app.current_user_id', true));

-- Chat Sessions policies
CREATE POLICY "Users can view their own chat sessions" ON chat_sessions
    FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert their own chat sessions" ON chat_sessions
    FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update their own chat sessions" ON chat_sessions
    FOR UPDATE USING (user_id = current_setting('app.current_user_id', true));

-- Chat Messages policies
CREATE POLICY "Users can view messages from their sessions" ON chat_messages
    FOR SELECT USING (
        session_id IN (
            SELECT id FROM chat_sessions 
            WHERE user_id = current_setting('app.current_user_id', true)
        )
    );

CREATE POLICY "Users can insert messages to their sessions" ON chat_messages
    FOR INSERT WITH CHECK (
        session_id IN (
            SELECT id FROM chat_sessions 
            WHERE user_id = current_setting('app.current_user_id', true)
        )
    );

-- For demo purposes, allow public access (disable RLS temporarily)
-- In production, implement proper authentication
ALTER TABLE ai_agents DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY; 