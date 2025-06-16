# ConvoTrack2 - Starting the Servers

## Method 1: Using PowerShell (Recommended)

### Start Backend Server:
```powershell
cd server
node index.js
```

### Start Frontend Server (in a new terminal):
```powershell
cd client/convotrack2
npm run dev
```

## Method 2: Using npm scripts (if available)

### Backend:
```powershell
cd server
npm start
```

### Frontend:
```powershell
cd client/convotrack2
npm run dev
```

## Server URLs:
- **Backend API**: http://localhost:5000
- **Frontend App**: http://localhost:5173

## Features Now Available:
- ✅ Upload PDF, JPG, PNG files to knowledge base
- ✅ Sales-focused AI agents
- ✅ Knowledge-based responses
- ✅ Document management interface

## To Test Knowledge Base:
1. Create an AI agent
2. Edit the agent → Go to "Knowledge Resources" tab
3. Upload documents (PDF, JPG, PNG)
4. Test chat with questions related to uploaded content

## Database Setup:
Run the SQL commands from `setup_knowledge_table.sql` in your Supabase SQL editor to create the knowledge_documents table. 