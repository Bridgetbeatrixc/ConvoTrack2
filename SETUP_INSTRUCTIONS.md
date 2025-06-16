# ConvoTrack Setup Instructions

## 🚀 Quick Setup

### Step 1: Database Setup (Supabase)
1. Go to your Supabase project: https://vjtlmaawyqhduijrduza.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Copy the entire content from `database_schema.sql`
4. Paste it into the SQL Editor and click **Run**
5. This will create all the necessary tables and sample data

### Step 2: Start the Application

**Backend Server:**
```powershell
cd server
node index.js
```

**Frontend Client:**
```powershell
cd client/convotrack2
npm run dev
```

### Step 3: Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🎯 Features Ready to Use

### ✅ AI Agent Management
- Create, edit, delete AI agents
- Customizable behavior and business descriptions
- OpenAI integration for intelligent responses

### ✅ Real-time Chat System
- Live messaging with AI agents
- Persistent conversation history
- Real-time updates across browser tabs

### ✅ Database Integration
- All data stored in Supabase
- Real-time synchronization
- Scalable architecture

## 🔧 Environment Configuration

The system uses these key configurations:
- **Supabase URL:** https://vjtlmaawyqhduijrduza.supabase.co
- **OpenAI API:** Configured in server/.env
- **Database Tables:** ai_agents, chat_sessions, chat_messages

## 📱 Navigation

1. **Dashboard:** `/dashboard` - Main dashboard view
2. **AI Agents:** `/dashboard/ai-agent` - Manage your AI agents
3. **Create Agent:** `/dashboard/ai-agent/create` - Create new AI agents
4. **Chat:** `/dashboard/chat` - Real-time chat with AI agents

## 🎉 You're Ready!

After running the SQL schema in Supabase, your application will have:
- Sample AI agents ready to use
- Real-time chat functionality
- Complete CRUD operations for agents
- OpenAI-powered intelligent responses

Start by creating your first AI agent or use the existing sample agents to test the chat functionality! 