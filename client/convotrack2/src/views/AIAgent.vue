<template>
  <div class="ai-agent-dashboard">
    <!-- Learning Section -->
    <div class="learning-section">
      <div class="learning-content">
        <div class="learning-text">
          <h2>#LearnWithConvo</h2>
          <h1>Apa itu AI Agent ?</h1>
          <p>AI Agent adalah bot yang membantu membalas dan merekap data bisnis anda !</p>
        </div>
        <div class="learning-illustration">
          <div class="bot-illustration">
            <div class="bot-icon">🤖</div>
            <div class="arrow">→</div>
            <div class="chat-icons">
              <div class="chat-bubble">❓</div>
              <div class="user-icons">
                <div class="user-icon">👤</div>
                <div class="user-icon">📊</div>
                <div class="user-icon">📱</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <div class="search-bar">
        <input 
          type="text" 
          placeholder="Search agents..." 
          class="search-input" 
          v-model="searchQuery"
          @keyup.enter="handleSearch"
        >
        <button class="search-btn" @click="handleSearch">🔍</button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-section">
      <div class="loading-spinner">⏳</div>
      <p>Loading agents...</p>
    </div>

    <!-- Error State -->
    <div v-if="error && !loading" class="error-section">
      <div class="error-icon">❌</div>
      <p>{{ error }}</p>
      <button @click="fetchAgents" class="retry-btn">Try Again</button>
    </div>

    <!-- AI Agents Grid -->
    <div v-if="!loading && !error" class="agents-grid">
      <div class="agent-card" v-for="agent in agents" :key="agent.id">
        <div class="agent-avatar">
          <div class="avatar-img">🤖</div>
        </div>
        <div class="agent-info">
          <h3>{{ agent.name }}</h3>
          <span class="agent-status" :class="agent.status?.toLowerCase() || 'active'">{{ agent.status || 'Active' }}</span>
          <div class="agent-platform">
            <span>Platform:</span>
            <span class="platform-name">{{ agent.platform || 'WhatsApp' }}</span>
          </div>
        </div>
        <div class="agent-actions">
          <button class="edit-btn" @click="editAgent(agent.id)">
            ✏️ Edit Agents
          </button>
          <button class="delete-btn" @click="deleteAgent(agent.id)" :disabled="loading">
            🗑️
          </button>
        </div>
      </div>

      <!-- Create New Agent Card -->
      <div class="create-agent-card" @click="createNewAgent">
        <div class="create-icon">+</div>
        <span>Create New Agent</span>
      </div>

      <!-- Empty State -->
      <div v-if="agents.length === 0 && !loading" class="empty-state">
        <div class="empty-icon">🤖</div>
        <h3>No AI Agents Found</h3>
        <p v-if="searchQuery">No agents match your search "{{ searchQuery }}"</p>
        <p v-else>You haven't created any AI agents yet.</p>
        <button @click="createNewAgent" class="create-first-btn">Create Your First Agent</button>
      </div>

      <!-- Create Button when no agents but not loading -->
      <div v-if="agents.length === 0 && !loading && !searchQuery" class="no-agents-prompt">
        <div class="prompt-content">
          <div class="prompt-icon">➕</div>
          <h2>Get Started with AI Agents</h2>
          <p>Create your first AI agent to start automating customer conversations</p>
          <button @click="createNewAgent" class="create-agent-cta">
            <span class="btn-icon">🤖</span>
            Create AI Agent
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <span class="pagination-info">Showing {{ totalAgents }} items</span>
      <div class="pagination-controls">
        <button class="page-btn" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">‹</button>
        <button class="page-btn active">{{ currentPage }}</button>
        <button class="page-btn" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">›</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { agentsAPI } from '../services/api'
import { db } from '../services/supabase'

const router = useRouter()

const agents = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const totalAgents = ref(0)

// Fetch agents from backend
const fetchAgents = async () => {
  try {
    loading.value = true
    error.value = null
    
    const params = {
      page: currentPage.value,
      limit: 8,
      ...(searchQuery.value && { search: searchQuery.value })
    }
    
    const response = await agentsAPI.getAgents(params)
    
    agents.value = response.agents || []
    totalPages.value = response.pagination?.totalPages || 1
    totalAgents.value = response.pagination?.totalAgents || 0
    
  } catch (err) {
    error.value = err.message || 'Failed to fetch agents'
    console.error('Error fetching agents:', err)
  } finally {
    loading.value = false
  }
}

// Search functionality
const handleSearch = async () => {
  currentPage.value = 1
  await fetchAgents()
}

// Pagination
const goToPage = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    await fetchAgents()
  }
}

const createNewAgent = () => {
  router.push('/dashboard/ai-agent/create')
}

const editAgent = (agentId) => {
  router.push(`/dashboard/ai-agent/create?edit=${agentId}`)
}

const deleteAgent = async (agentId) => {
  if (confirm('Are you sure you want to delete this agent?')) {
    try {
      loading.value = true
      await agentsAPI.deleteAgent(agentId)
      
      // Refresh the agents list
      await fetchAgents()
      
      // Show success message
      alert('Agent deleted successfully!')
      
    } catch (err) {
      error.value = err.message || 'Failed to delete agent'
      alert('Failed to delete agent: ' + error.value)
    } finally {
      loading.value = false
    }
  }
}

// Load agents on component mount
onMounted(() => {
  fetchAgents()
})
</script>

<style scoped>
.ai-agent-dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.learning-section {
  background: linear-gradient(135deg, #ffe6ed 0%, #fff1f3 100%);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.learning-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.learning-text {
  flex: 1;
}

.learning-text h2 {
  color: #ff385c;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.learning-text h1 {
  color: #333;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.learning-text p {
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
}

.learning-illustration {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bot-illustration {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.bot-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #4F46E5, #7C3AED);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
}

.arrow {
  font-size: 2rem;
  color: #666;
}

.chat-icons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.chat-bubble {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.user-icons {
  display: flex;
  gap: 0.5rem;
}

.user-icon {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.search-section {
  margin-bottom: 2rem;
}

.search-bar {
  position: relative;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #ff385c;
}

.search-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: #ff385c;
  border: none;
  color: white;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-btn:hover {
  background: #e73147;
}

.loading-section,
.error-section {
  text-align: center;
  padding: 3rem 1rem;
  background: white;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.loading-spinner,
.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.loading-section p,
.error-section p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.retry-btn,
.create-first-btn {
  background: #ff385c;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-btn:hover,
.create-first-btn:hover {
  background: #e73147;
}

.no-agents-prompt {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
  border-radius: 12px;
  border: 2px dashed #e0e0e0;
  margin: 2rem 0;
}

.prompt-content {
  text-align: center;
  padding: 3rem 2rem;
  max-width: 500px;
}

.prompt-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  color: #ff385c;
  background: rgba(255, 56, 92, 0.1);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.prompt-content h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 600;
}

.prompt-content p {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.create-agent-cta {
  background: linear-gradient(135deg, #ff385c 0%, #e73147 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 15px rgba(255, 56, 92, 0.3);
}

.create-agent-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 56, 92, 0.4);
  background: linear-gradient(135deg, #e73147 0%, #d22b3d 100%);
}

.create-agent-cta:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(255, 56, 92, 0.3);
}

.btn-icon {
  font-size: 1.2rem;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #666;
  margin-bottom: 1.5rem;
}

.agents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.agent-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.agent-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.agent-avatar {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.avatar-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff69b4, #ff1493);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
}

.agent-info {
  text-align: center;
  margin-bottom: 1.5rem;
}

.agent-info h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.agent-status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.agent-status.active {
  background: #d4edda;
  color: #155724;
}

.agent-platform {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #666;
}

.platform-name {
  font-weight: 500;
  color: #333;
}

.agent-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.edit-btn {
  flex: 1;
  background: none;
  border: 1px solid #e0e0e0;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #666;
  transition: all 0.2s;
}

.edit-btn:hover {
  border-color: #ff385c;
  color: #ff385c;
}

.delete-btn {
  background: none;
  border: 1px solid #e0e0e0;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  color: #999;
  transition: all 0.2s;
}

.delete-btn:hover {
  border-color: #ff4757;
  color: #ff4757;
}

.create-agent-card {
  background: white;
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  padding: 3rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
}

.create-agent-card:hover {
  border-color: #ff385c;
  color: #ff385c;
}

.create-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 300;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.pagination-info {
  color: #666;
  font-size: 0.9rem;
}

.pagination-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.page-btn {
  background: white;
  border: 1px solid #e0e0e0;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #666;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  border-color: #ff385c;
  color: #ff385c;
}

.page-btn.active {
  background: #ff385c;
  border-color: #ff385c;
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .ai-agent-dashboard {
    padding: 1rem;
  }
  
  .learning-content {
    flex-direction: column;
    text-align: center;
  }
  
  .learning-text h1 {
    font-size: 1.5rem;
  }
  
  .bot-illustration {
    gap: 1rem;
  }
  
  .agents-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .pagination {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .learning-section {
    padding: 1.5rem;
  }
  
  .bot-icon {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
  
  .agent-card {
    padding: 1rem;
  }
  
  .agent-actions {
    flex-direction: column;
  }
}
</style> 