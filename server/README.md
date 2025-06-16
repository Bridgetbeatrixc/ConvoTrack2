# ConvoTrack Backend API

A powerful backend API for ConvoTrack - an AI-powered customer service chatbot platform with OpenAI integration.

## Features

- 🤖 **AI-Powered Conversations**: OpenAI GPT integration for intelligent chatbot responses
- 👥 **Agent Management**: Create, update, and manage AI agents with custom behaviors
- 💬 **Real-time Chat**: Handle customer conversations with AI assistance
- 📊 **Analytics & Insights**: AI-generated business insights from chat data
- 🔐 **Authentication**: User registration, login, and profile management
- 🔍 **Content Moderation**: AI-powered message content validation
- 📱 **WhatsApp Ready**: Built for WhatsApp Business API integration

## Tech Stack

- **Node.js** with Express.js
- **OpenAI API** for AI functionality
- **In-memory storage** (easily replaceable with database)
- **CORS** enabled for frontend integration
- **Environment-based configuration**

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### AI Agents
- `GET /api/agents` - Get all agents (with pagination & search)
- `GET /api/agents/:id` - Get specific agent
- `POST /api/agents` - Create new agent
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent
- `POST /api/agents/generate-behavior` - Generate AI behavior suggestions
- `GET /api/agents/:id/stats` - Get agent statistics

### Chat & Conversations
- `POST /api/chat/sessions` - Create new chat session
- `GET /api/chat/sessions` - Get all chat sessions
- `GET /api/chat/sessions/:sessionId/messages` - Get messages for session
- `POST /api/chat/sessions/:sessionId/messages` - Send message & get AI response
- `POST /api/chat/sessions/:sessionId/close` - Close chat session
- `GET /api/chat/sessions/:sessionId/insights` - Get AI insights for session
- `GET /api/chat/stats` - Get chat statistics

### Health Check
- `GET /api/health` - Server health status

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Setup

Copy the example environment file and configure it:

```bash
cp env.example .env
```

Update `.env` with your configuration:

```env
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional (defaults provided)
PORT=5000
CLIENT_URL=http://localhost:5173
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=500
OPENAI_TEMPERATURE=0.7
```

### 3. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Add it to your `.env` file

### 4. Start the Server

For development (with auto-reload):
```bash
npm run dev
```

For production:
```bash
npm start
```

The server will start on `http://localhost:5000`

### 5. Test the API

Visit `http://localhost:5000/api/health` to check if the server is running.

## Example Usage

### Create an AI Agent

```bash
curl -X POST http://localhost:5000/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer Support Bot",
    "behaviour": "You are a helpful customer service agent. Always be polite and professional.",
    "businessDescription": "We sell premium coffee and tea products online."
  }'
```

### Start a Chat Session

```bash
curl -X POST http://localhost:5000/api/chat/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": 1,
    "customerName": "John Doe",
    "customerPhone": "+1234567890"
  }'
```

### Send a Message

```bash
curl -X POST http://localhost:5000/api/chat/sessions/1/messages \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello, I need help with my order",
    "sender": "customer"
  }'
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `OPENAI_API_KEY` | OpenAI API key | **Required** |
| `OPENAI_MODEL` | OpenAI model to use | `gpt-3.5-turbo` |
| `OPENAI_MAX_TOKENS` | Max tokens per response | `500` |
| `OPENAI_TEMPERATURE` | AI creativity level | `0.7` |

## Project Structure

```
server/
├── index.js              # Main server file
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── agents.js         # AI agent management
│   └── chat.js           # Chat and messaging
├── services/
│   └── openai.js         # OpenAI integration
├── package.json          # Dependencies and scripts
├── env.example           # Environment template
└── README.md            # This file
```

## Data Models

### User
```javascript
{
  id: 1,
  email: "user@example.com",
  fullName: "John Doe",
  businessName: "My Business",
  businessField: "Retail",
  businessAddress: "123 Main St",
  phoneNumber: "+1234567890",
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

### AI Agent
```javascript
{
  id: 1,
  name: "Customer Support Bot",
  behaviour: "You are a helpful assistant...",
  businessDescription: "We sell coffee products...",
  platform: "Whatsapp",
  status: "Active",
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

### Chat Session
```javascript
{
  id: 1,
  agentId: 1,
  customerName: "John Doe",
  customerPhone: "+1234567890",
  platform: "whatsapp",
  status: "active",
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

### Message
```javascript
{
  id: 1,
  sessionId: 1,
  content: "Hello, how can I help you?",
  type: "text",
  sender: "agent", // or "customer"
  timestamp: "2024-01-01T00:00:00.000Z",
  status: "delivered"
}
```

## Production Considerations

This is a development version with in-memory storage. For production:

1. **Database**: Replace in-memory storage with PostgreSQL/MongoDB
2. **Authentication**: Implement JWT tokens and proper security
3. **Rate Limiting**: Add rate limiting for API endpoints
4. **Logging**: Implement structured logging
5. **Error Handling**: Enhanced error handling and monitoring
6. **Validation**: Add input validation middleware
7. **HTTPS**: Use HTTPS in production
8. **Environment**: Use proper secret management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support, please contact the ConvoTrack team or create an issue in the repository. 