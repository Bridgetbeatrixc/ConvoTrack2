-- Create Knowledge Base Documents table
CREATE TABLE IF NOT EXISTS knowledge_documents (
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

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_agent_id ON knowledge_documents(agent_id);

-- Create full-text search index for content
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_content_search ON knowledge_documents USING gin(to_tsvector('english', content));

-- Enable Row Level Security
ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;

-- Create policies for knowledge documents (for demo, we'll allow all operations)
-- In production, you'd want user-specific policies
DROP POLICY IF EXISTS "Allow all operations on knowledge_documents" ON knowledge_documents;
CREATE POLICY "Allow all operations on knowledge_documents" ON knowledge_documents
    FOR ALL USING (true);

-- Update trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_knowledge_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_knowledge_documents_updated_at ON knowledge_documents;
CREATE TRIGGER update_knowledge_documents_updated_at 
    BEFORE UPDATE ON knowledge_documents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_knowledge_documents_updated_at(); 