<template>
  <!-- Chat Container with Sidebar -->
  <div class="chat-layout">
    <!-- Chat History Sidebar -->
    <div class="chat-sidebar">
      <div class="sidebar-header">
        <h3>Chat History</h3>
        <div class="sidebar-actions">
          <select v-model="selectedAgentId" class="agent-selector-compact">
            <option value="">Select Agent</option>
            <option v-for="agent in agents" :key="agent.id" :value="agent.id">
              {{ agent.name }}
            </option>
          </select>
          <button @click="startNewChat" class="new-chat-btn" :disabled="!selectedAgentId">
            ➕ New Chat
          </button>
        </div>
      </div>
      
      <div class="sessions-list">
        <div 
          v-for="session in chatSessions" 
          :key="session.id"
          class="session-item"
          :class="{ active: currentSessionId === session.id }"
        >
          <div class="session-content" @click="switchSession(session)">
            <div class="session-info">
              <span class="session-name">{{ formatSessionName(session) }}</span>
              <span class="session-time">{{ formatTime(session.created_at) }}</span>
            </div>
            <p class="session-preview">{{ getLastMessage(session) }}</p>
          </div>
          <button 
            @click="deleteSession(session)" 
            class="delete-session-btn"
            :disabled="currentSessionId === session.id"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>

    <!-- Main Chat Area -->
    <div class="chat-container">
      <!-- Chat Header -->
      <div class="chat-header">
        <div class="header-left">
          <h2>💬 AI Chat Assistant</h2>
          <span class="online-status">
            <span class="status-dot"></span>
            AI Agent Online
          </span>
        </div>
        <div class="header-right">
          <button 
            v-if="currentSessionId"
            @click="deleteSession({ id: currentSessionId })" 
            class="delete-chat-btn"
            title="Delete current chat"
          >
            🗑️ Delete Chat
          </button>
        </div>
      </div>

      <!-- Main Chat Area -->
      <div class="chat-main">
        <div v-if="!currentSessionId" class="welcome-screen">
          <div class="welcome-content">
            <div class="welcome-icon">🤖</div>
            <h2>Welcome to AI Chat</h2>
            <p v-if="agents.length === 0">No AI agents available. Please create an agent first.</p>
            <p v-else>Select an AI agent and start a conversation</p>
            <button v-if="agents.length > 0" @click="startNewChat" class="welcome-start-btn" :disabled="!selectedAgentId">
              Start New Conversation
            </button>
            <button v-else @click="goToCreateAgent" class="welcome-start-btn">
              Create AI Agent
            </button>
          </div>
        </div>

        <div v-else class="chat-content">
          <!-- Loading Indicator -->
          <div v-if="isLoadingHistory" class="loading-history">
            <div class="loading-spinner"></div>
            <p>Loading chat history...</p>
          </div>

          <!-- Messages Area -->
          <div class="messages-container" ref="messagesContainer">
            <!-- Load More Button -->
            <button 
              v-if="hasMoreMessages" 
              @click="loadMoreMessages" 
              class="load-more-btn"
              :disabled="isLoadingMore"
            >
              {{ isLoadingMore ? 'Loading...' : 'Load Previous Messages' }}
            </button>

            <div 
              v-for="message in messages" 
              :key="message.id"
              class="message"
              :class="[message.sender, { 'failed': message.failed }]"
            >
              <div class="message-bubble">
                <div class="message-content">{{ message.content }}</div>
                <div class="message-time">
                  {{ formatTime(message.timestamp) }}
                  <span v-if="message.failed" class="error-indicator">
                    ⚠️ Failed to send
                    <button @click="retryMessage(message)" class="retry-btn">🔄 Retry</button>
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Typing Indicator -->
            <div v-if="isTyping" class="message agent typing-message">
              <div class="message-bubble">
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Message Input -->
          <div class="message-input-container">
            <div class="input-area">
              <input 
                type="text" 
                v-model="newMessage" 
                @keypress.enter="sendMessage"
                placeholder="Type your message..."
                class="message-input"
                :disabled="isLoading || !selectedAgentId"
              />
              <button 
                @click="sendMessage" 
                class="send-button"
                :disabled="!newMessage.trim() || isLoading || !selectedAgentId"
              >
                <span v-if="isLoading">⏳</span>
                <span v-else>📤</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-message">
        <div class="error-content">
          <span class="error-icon">❌</span>
          <p>{{ error }}</p>
          <button @click="clearError" class="error-close">✕</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { chatAPI, agentsAPI } from '../services/api'
import { db } from '../services/supabase'

const router = useRouter()

// Reactive state
const selectedAgentId = ref('')
const currentSessionId = ref(null)
const messages = ref([])
const agents = ref([])
const newMessage = ref('')
const isLoading = ref(false)
const isTyping = ref(false)
const error = ref('')

// Additional reactive state
const chatSessions = ref([])
const isLoadingHistory = ref(false)
const isLoadingMore = ref(false)
const hasMoreMessages = ref(false)
const currentPage = ref(1)
const messagesPerPage = 50

// Refs
const messagesContainer = ref(null)

// Real-time subscription
let messageSubscription = null

// Component lifecycle
onMounted(async () => {
  await Promise.all([
    loadAgents(),
    loadChatSessions()
  ])
})

onUnmounted(() => {
  if (messageSubscription) {
    messageSubscription.unsubscribe()
  }
})

// Methods
const loadAgents = async () => {
  try {
    isLoading.value = true
    const response = await agentsAPI.getAgents()
    agents.value = response.agents || response || []
    
    // Auto-select first agent if available
    if (agents.value.length > 0 && !selectedAgentId.value) {
      selectedAgentId.value = agents.value[0].id
    }
  } catch (err) {
    error.value = 'Failed to load AI agents'
    console.error('Error loading agents:', err)
  } finally {
    isLoading.value = false
  }
}

const loadChatSessions = async () => {
  try {
    const response = await chatAPI.getSessions()
    chatSessions.value = response.sessions || []
  } catch (err) {
    console.error('Error loading chat sessions:', err)
    error.value = 'Failed to load chat history'
  }
}

const startNewChat = async () => {
  if (!selectedAgentId.value) {
    error.value = 'Please select an AI agent first'
    return
  }

  try {
    isLoading.value = true
    const sessionData = {
      agentId: selectedAgentId.value,
      customerName: 'Customer',
      platform: 'web'
    }
    
    const response = await chatAPI.createSession(sessionData)
    console.log('Create session response:', response);
    const newSession = response.session || response;
    console.log('New session:', newSession);
    if (!newSession || !newSession.id) {
      error.value = 'Failed to create chat session: Invalid session data';
      return;
    }
    // Add new session to list
    chatSessions.value = [newSession, ...chatSessions.value]
    // Select the new session
    await switchSession(newSession)
    
  } catch (err) {
    console.error('Error starting new chat:', err)
    error.value = 'Failed to start new chat'
  } finally {
    isLoading.value = false
  }
}

const setupRealtimeSubscription = (sessionId) => {
  // Unsubscribe from previous subscription if any
  if (messageSubscription) {
    messageSubscription.unsubscribe()
  }

  // Subscribe to new messages for this session
  messageSubscription = db.chatMessages.subscribeToSession(sessionId, (payload) => {
    console.log('New message received:', payload)
    
    if (payload.eventType === 'INSERT') {
      const newMessage = payload.new
      
      // Only add the message if it's not already in our local messages
      // Check both real IDs and temporary IDs
      const exists = messages.value.find(m => 
        m.id === newMessage.id || 
        (m.content === newMessage.content && 
         m.sender === newMessage.sender && 
         Math.abs(new Date(m.timestamp) - new Date(newMessage.timestamp)) < 5000) // Within 5 seconds
      )
      
      if (!exists) {
        messages.value.push(newMessage)
        scrollToBottom()
      } else {
        // If we found a temporary message with same content, replace it with the real one
        const tempMsgIndex = messages.value.findIndex(m => 
          m.id.toString().startsWith('temp-') && 
          m.content === newMessage.content && 
          m.sender === newMessage.sender
        )
        if (tempMsgIndex !== -1) {
          messages.value[tempMsgIndex] = newMessage
        }
      }
    }
  })
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !currentSessionId.value) return

  const messageContent = newMessage.value.trim()
  
  // Create a temporary message
  const tempMessage = {
    id: `temp-${Date.now()}`,
    content: messageContent,
    sender: 'customer',
    timestamp: new Date().toISOString(),
    session_id: currentSessionId.value
  }
  
  // Add message to UI immediately
  messages.value.push(tempMessage)
  
  // Clear input immediately
  newMessage.value = ''
  
  // Scroll to bottom
  await scrollToBottom()

  try {
    isTyping.value = true
    
    const response = await chatAPI.sendMessage(currentSessionId.value, {
      content: messageContent,
      type: 'text',
      sender: 'customer'
    })

    // Remove temporary message
    const tempIndex = messages.value.findIndex(m => m.id === tempMessage.id)
    if (tempIndex !== -1) {
      messages.value.splice(tempIndex, 1)
    }

    // Add real messages from response
    if (response.userMessage) {
      messages.value.push(response.userMessage)
    }
    if (response.aiResponse) {
      messages.value.push(response.aiResponse)
    }

    // Update session preview in the sidebar
    const sessionIndex = chatSessions.value.findIndex(s => s.id === currentSessionId.value)
    if (sessionIndex !== -1) {
      chatSessions.value[sessionIndex].last_message = response.aiResponse || response.userMessage
    }

    await scrollToBottom()
    
  } catch (err) {
    // If there's an error, mark the temporary message as failed
    const tempIndex = messages.value.findIndex(m => m.id === tempMessage.id)
    if (tempIndex !== -1) {
      messages.value[tempIndex] = {
        ...tempMessage,
        failed: true,
        error: 'Failed to send'
      }
    }
    
    error.value = 'Failed to send message'
    console.error('Error sending message:', err)
  } finally {
    isTyping.value = false
  }
}

const switchAgent = () => {
  // Clear current session when switching agents
  currentSessionId.value = null
  messages.value = []
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const clearError = () => {
  error.value = ''
}

const goToCreateAgent = () => {
  router.push('/dashboard/ai-agent/create')
}

const retryMessage = async (failedMessage) => {
  // Remove the failed message from UI
  const messageIndex = messages.value.findIndex(m => m.id === failedMessage.id)
  if (messageIndex !== -1) {
    messages.value.splice(messageIndex, 1)
  }
  
  // Set the message content back to input and try sending again
  newMessage.value = failedMessage.content
  await sendMessage()
}

const formatSessionName = (session) => {
  return `Chat with ${session.ai_agents?.name || 'AI Agent'}`
}

const getLastMessage = (session) => {
  const lastMessage = session && session.last_message;
  if (!lastMessage || !lastMessage.content) return 'No messages yet';
  return lastMessage.content.length > 50 
    ? lastMessage.content.substring(0, 50) + '...'
    : lastMessage.content;
}

const switchSession = async (session) => {
  if (currentSessionId.value === session.id) return
  
  try {
    isLoadingHistory.value = true
    currentSessionId.value = session.id
    selectedAgentId.value = session.agent_id
    messages.value = []
    currentPage.value = 1
    
    await loadSessionMessages(session.id)
    setupRealtimeSubscription(session.id)
  } catch (err) {
    console.error('Error switching session:', err)
    error.value = 'Failed to load chat session'
  } finally {
    isLoadingHistory.value = false
  }
}

const loadSessionMessages = async (sessionId, page = 1) => {
  try {
    const response = await chatAPI.getMessages(sessionId, {
      page,
      limit: messagesPerPage
    })
    
    const newMessages = response.messages || []
    
    if (page === 1) {
      messages.value = newMessages.reverse()
    } else {
      messages.value = [...newMessages.reverse(), ...messages.value]
    }
    
    hasMoreMessages.value = response.pagination.hasNext
    await scrollToBottom()
  } catch (err) {
    console.error('Error loading messages:', err)
    throw err
  }
}

const loadMoreMessages = async () => {
  if (isLoadingMore.value || !hasMoreMessages.value) return
  
  try {
    isLoadingMore.value = true
    currentPage.value++
    await loadSessionMessages(currentSessionId.value, currentPage.value)
  } catch (err) {
    error.value = 'Failed to load more messages'
    currentPage.value--
  } finally {
    isLoadingMore.value = false
  }
}

const deleteSession = async (session) => {
  if (!session?.id) {
    error.value = 'Invalid session selected';
    return;
  }
  
  try {
    if (!confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
      return;
    }

    const sessionToDelete = session.id;
    
    // Disable delete buttons while processing
    isLoading.value = true;
    
    // If we're deleting the current session, clear the UI first
    const isDeletingCurrent = currentSessionId.value === sessionToDelete;
    if (isDeletingCurrent) {
      currentSessionId.value = null;
      messages.value = [];
      
      // Clean up subscription
      if (messageSubscription) {
        messageSubscription.unsubscribe();
        messageSubscription = null;
      }
    }
    
    // Attempt to delete on the server
    console.log('Deleting session:', sessionToDelete);
    const response = await chatAPI.deleteSession(sessionToDelete);
    console.log('Delete response:', response);
    
    // Always refresh chat sessions after delete
    await loadChatSessions();
    
    // Remove from local state (optional, since loadChatSessions will update)
    chatSessions.value = chatSessions.value.filter(s => s.id !== sessionToDelete);
    
    // If we deleted the current session and there are other sessions, switch to the first one
    if (isDeletingCurrent && chatSessions.value.length > 0) {
      await switchSession(chatSessions.value[0]);
    }
    
  } catch (err) {
    console.error('Error deleting session:', err);
    error.value = `Failed to delete chat session: ${err.message}`;
    await loadChatSessions(); // Always refresh on error too
    
    // If deletion failed and this was the current session, restore it
    if (currentSessionId.value === null && session.id) {
      currentSessionId.value = session.id;
      await loadSessionMessages(session.id);
      setupRealtimeSubscription(session.id);
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.chat-layout {
  display: flex;
  height: calc(100vh - 60px);
  background: #f5f7fa;
}

.chat-sidebar {
  width: 300px;
  border-right: 1px solid #e1e4e8;
  display: flex;
  flex-direction: column;
  background: white;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #e1e4e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #1a1a1a;
}

.sessions-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.session-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: #f8f9fa;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
}

.session-item:hover {
  background: #f0f2f5;
  transform: translateY(-1px);
}

.session-item.active {
  background: #e8f0fe;
  border-left: 3px solid #1a73e8;
}

.session-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.session-name {
  font-weight: 500;
  color: #1a1a1a;
}

.session-time {
  font-size: 0.8rem;
  color: #666;
}

.session-preview {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.chat-header {
  background: white;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.header-left h2 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.5rem;
}

.online-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #28a745;
  font-size: 0.9rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #28a745;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.header-right {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.agent-selector-compact {
  flex: 1;
  padding: 0.4rem;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  background: white;
  font-size: 0.9rem;
  color: #1a1a1a;
}

.new-chat-btn {
  padding: 0.4rem 0.8rem;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.new-chat-btn:hover:not(:disabled) {
  background: #1557b0;
}

.new-chat-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.session-content {
  flex: 1;
  cursor: pointer;
}

.delete-session-btn {
  padding: 0.4rem;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;
}

.session-item:hover .delete-session-btn {
  opacity: 1;
}

.delete-session-btn:hover:not(:disabled) {
  background: #fee2e2;
  color: #dc2626;
}

.delete-session-btn:disabled {
  cursor: not-allowed;
  opacity: 0.3;
}

.delete-chat-btn {
  padding: 0.5rem 1rem;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.delete-chat-btn:hover {
  background: #fecaca;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.welcome-screen {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-content {
  text-align: center;
  padding: 2rem;
}

.welcome-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.welcome-content h2 {
  color: #333;
  margin-bottom: 0.5rem;
}

.welcome-content p {
  color: #666;
  margin-bottom: 1.5rem;
}

.welcome-start-btn {
  background: #ff385c;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.welcome-start-btn:hover {
  background: #e73147;
}

.welcome-start-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.message {
  margin-bottom: 1rem;
  max-width: 70%;
}

.message.customer {
  align-self: flex-end;
}

.message.agent {
  align-self: flex-start;
}

.message-bubble {
  padding: 1rem;
  border-radius: 12px;
  background: #f0f2f5;
  position: relative;
}

.message.customer .message-bubble {
  background: #1a73e8;
  color: white;
}

.message.agent .message-bubble {
  background: #f0f2f5;
  color: #1a1a1a;
}

.message-content {
  padding: 0.75rem 1rem;
  line-height: 1.4;
}

.message-time {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
}

.message.customer .message-time {
  color: #fff;
  opacity: 0.8;
}

.error-indicator {
  color: #dc3545;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.retry-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.retry-btn:hover {
  background: rgba(220, 53, 69, 0.1);
}

.typing-message .message-bubble {
  padding: 1rem;
}

.typing-indicator {
  display: flex;
  gap: 0.3rem;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #999;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

.message-input-container {
  border-top: 1px solid #e0e0e0;
  background: white;
  padding: 1rem;
}

.input-area {
  display: flex;
  gap: 0.5rem;
}

.message-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 1rem;
  background: #f8f9fa;
}

.message-input:focus {
  outline: none;
  border-color: #ff385c;
  background: white;
}

.message-input:disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.send-button {
  background: #ff385c;
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-button:hover:not(:disabled) {
  background: #e73147;
}

.send-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-message {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #f5c6cb;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 1001;
  max-width: 400px;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-icon {
  font-size: 1.2rem;
}

.error-close {
  background: none;
  border: none;
  color: #721c24;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: auto;
  border-radius: 3px;
}

.error-close:hover {
  background: rgba(114, 28, 36, 0.1);
}

.loading-history {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #666;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1a73e8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.load-more-btn {
  display: block;
  margin: 1rem auto;
  padding: 0.5rem 1rem;
  background: #f0f2f5;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.2s ease;
}

.load-more-btn:hover:not(:disabled) {
  background: #e8f0fe;
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .chat-layout {
    flex-direction: column;
  }

  .chat-sidebar {
    width: 100%;
    height: 200px;
    border-right: none;
    border-bottom: 1px solid #e1e4e8;
  }

  .sessions-list {
    padding: 0.5rem;
  }

  .session-item {
    padding: 0.5rem;
  }

  .message {
    max-width: 85%;
  }

  .sidebar-actions {
    flex-direction: column;
  }
  
  .delete-session-btn {
    opacity: 1;
    padding: 0.3rem;
  }
}
</style> 