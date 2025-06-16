<template>
  <div class="ai-agent-create">
    <!-- Learning Section -->
    <div class="learning-section">
      <div class="learning-content">
        <div class="learning-text">
          <h2>#LearnWithConvo</h2>
          <h1 v-if="activeTab === 'general'">
            {{ isEditing ? 'Edit' : 'Buat' }} General Information AI Agent
          </h1>
          <h1 v-else>
            {{ isEditing ? 'Edit' : 'Buat' }} Knowledge Resources AI Agent
          </h1>
          <p v-if="activeTab === 'general'">Berisi AI Agent behaviour untuk menset tone chat bot anda, di sebelah kanan adalah sample chat bot</p>
          <p v-else>Berisi sebagai informasi atau sumber pengetahuan terhadap lingkup dan produk bisnis. Klik "Generate Behavior" untuk mendapatkan saran otomatis!</p>
        </div>
        <div class="learning-illustration">
          <div class="illustration-icon" v-if="activeTab === 'general'">📋</div>
          <div class="illustration-icon" v-else>📚</div>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="content-section">
      <!-- Left Side - Form -->
      <div class="form-section">
        <!-- Tabs -->
        <div class="tabs">
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'general' }" 
            @click="activeTab = 'general'"
          >
            General Information
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'knowledge' }" 
            @click="activeTab = 'knowledge'"
          >
            Knowledge Resources
          </button>
        </div>

        <!-- General Information Tab -->
        <div v-if="activeTab === 'general'" class="tab-content">
          <form @submit.prevent="saveAgent" class="agent-form">
            <div class="form-group">
              <label for="agentName">Nama AI Agent</label>
              <input 
                type="text" 
                id="agentName" 
                v-model="agentData.name"
                placeholder="Type Here..."
                required
              >
            </div>

            <div class="form-group">
              <label for="agentBehaviour">AI Agent Behaviour</label>
              <textarea 
                id="agentBehaviour" 
                v-model="agentData.behaviour"
                placeholder="Type Here..."
                rows="6"
                required
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="goBack" :disabled="loading">Cancel</button>
              <button type="submit" class="save-btn" :disabled="loading">
                {{ loading ? 'Saving...' : (isEditing ? 'Update Agent' : 'Save Agent') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Knowledge Resources Tab -->
        <div v-if="activeTab === 'knowledge'" class="tab-content">
          <form @submit.prevent="saveAgent" class="agent-form">
            <div class="form-group">
              <label for="businessDescription">Deskripsi Bisnis</label>
              <textarea 
                id="businessDescription" 
                v-model="agentData.businessDescription"
                placeholder="Describe your business (e.g., Toko kue dan bakery yang menjual berbagai macam kue ulang tahun...)"
                rows="6"
                required
              ></textarea>
            </div>

            <!-- PDF Upload Section -->
            <div v-if="isEditing && agentId" class="form-group">
              <label>Knowledge Base Documents</label>
              
              <!-- Upload Area -->
              <div class="upload-area">
                <input 
                  type="file" 
                  ref="fileInput"
                  accept=".pdf,.jpg,.jpeg,.png"
                  @change="handleFileSelect"
                  style="display: none"
                />
                <div class="upload-box" @click="$refs.fileInput.click()" :class="{ uploading: uploadLoading }">
                  <div class="upload-icon">📁</div>
                  <p>{{ uploadLoading ? 'Uploading...' : 'Click to upload documents & images' }}</p>
                  <small>Supports PDF, JPG, PNG files (max 10MB)</small>
                </div>
              </div>

              <!-- Documents List -->
              <div v-if="knowledgeDocuments.length > 0" class="documents-list">
                <h4>Uploaded Documents ({{ knowledgeDocuments.length }})</h4>
                                 <div class="document-item" v-for="doc in knowledgeDocuments" :key="doc.id">
                   <div class="document-info">
                     <span class="document-name">{{ getFileIcon(doc.fileType) }} {{ doc.filename }}</span>
                     <span class="document-size">{{ formatFileSize(doc.fileSize) }}</span>
                     <span class="document-date">{{ formatDate(doc.uploadedAt) }}</span>
                   </div>
                  <button type="button" class="delete-doc-btn" @click="deleteDocument(doc.id)" :disabled="uploadLoading">
                    🗑️
                  </button>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="goBack" :disabled="loading">Cancel</button>
              <button type="button" class="generate-btn" @click="generateBehavior" :disabled="loading || !agentData.businessDescription.trim()">
                {{ loading ? 'Generating...' : 'Generate Behavior' }}
              </button>
              <button type="submit" class="save-btn" :disabled="loading">
                {{ loading ? 'Saving...' : (isEditing ? 'Update Agent' : 'Save Agent') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Right Side - Chat Preview -->
      <div class="preview-section" v-if="activeTab === 'general'">
        <div class="chat-preview">
          <div class="chat-header">
            <div class="chat-user">
              <div class="chat-avatar">🤖</div>
              <span class="chat-name">AI Agent</span>
            </div>
            <div class="chat-actions">
              <button class="chat-action-btn">📞</button>
              <button class="chat-action-btn">⋯</button>
            </div>
          </div>

          <div class="chat-messages">
            <div class="message user-message">
              <span class="message-text">Hallo, Selamat datang di tokoro bakery!</span>
              <span class="message-time">16:20 PM</span>
            </div>

            <div class="message bot-message">
              <span class="message-text">Helo, iya saya mau pesan cake untuk ulang tahun anak saya.</span>
              <span class="message-time">16:20 PM</span>
            </div>

            <div class="message user-message">
              <span class="message-text">Baik berikut pilihan kue kami, Bisa kurang ayah ini list!</span>
              <span class="message-time">16:20 PM</span>
            </div>

            <div class="product-showcase">
              <div class="product-image" v-for="i in 3" :key="i">
                <div class="product-img">🎂</div>
              </div>
            </div>
            <span class="message-time">16:20 PM</span>
          </div>

          <div class="chat-input">
            <input type="text" placeholder="Type a message..." class="message-input">
            <button class="send-btn">📤</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { agentsAPI } from '../services/api'
import { db } from '../services/supabase'

const router = useRouter()
const route = useRoute()

const activeTab = ref('general')
const loading = ref(false)
const uploadLoading = ref(false)
const error = ref(null)
const isEditing = ref(false)
const agentId = ref(null)
const knowledgeDocuments = ref([])

const agentData = reactive({
  name: '',
  behaviour: '',
  businessDescription: ''
})

// Check if we're editing an existing agent
onMounted(async () => {
  const editId = route.query.edit
  if (editId) {
    isEditing.value = true
    agentId.value = parseInt(editId)
    await loadAgent(agentId.value)
    await loadKnowledgeDocuments()
  }
})

// Load existing agent data for editing
const loadAgent = async (id) => {
  try {
    loading.value = true
    const response = await agentsAPI.getAgent(id)
    
    agentData.name = response.name || ''
    agentData.behaviour = response.behaviour || ''
    agentData.businessDescription = response.businessDescription || ''
  } catch (err) {
    error.value = err.message || 'Failed to load agent data'
    console.error('Error loading agent:', err)
  } finally {
    loading.value = false
  }
}

// Generate AI behavior suggestion
const generateBehavior = async () => {
  if (!agentData.businessDescription.trim()) {
    alert('Please enter a business description first')
    return
  }

  try {
    loading.value = true
    const response = await agentsAPI.generateBehavior(agentData.businessDescription)
    agentData.behaviour = response.suggestedBehavior
  } catch (err) {
    console.error('Error generating behavior:', err)
    alert('Failed to generate behavior suggestion: ' + err.message)
  } finally {
    loading.value = false
  }
}

const saveAgent = async () => {
  if (!agentData.name.trim() || !agentData.behaviour.trim()) {
    alert('Please fill in all required fields')
    return
  }

  try {
    loading.value = true
    error.value = null

    const payload = {
      name: agentData.name.trim(),
      behaviour: agentData.behaviour.trim(),
      businessDescription: agentData.businessDescription.trim()
    }

    if (isEditing.value) {
      await agentsAPI.updateAgent(agentId.value, payload)
      alert('Agent updated successfully!')
    } else {
      await agentsAPI.createAgent(payload)
      alert('Agent created successfully!')
    }
    
    goBack()
  } catch (err) {
    error.value = err.message || 'Failed to save agent'
    alert('Failed to save agent: ' + error.value)
  } finally {
    loading.value = false
  }
}

// Load knowledge documents for editing
const loadKnowledgeDocuments = async () => {
  if (!agentId.value) return
  
  try {
    const response = await agentsAPI.getKnowledgeDocuments(agentId.value)
    knowledgeDocuments.value = response.documents || []
  } catch (err) {
    console.error('Error loading knowledge documents:', err)
  }
}

// Handle file selection for document upload
const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // Validate file type
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
  if (!allowedTypes.includes(file.type)) {
    alert('Please select a PDF, JPG, or PNG file')
    return
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB
    alert('File size must be less than 10MB')
    return
  }
  
  try {
    uploadLoading.value = true
    
    const formData = new FormData()
    formData.append('document', file)
    
    const response = await agentsAPI.uploadDocument(agentId.value, formData)
    
    // Refresh documents list
    await loadKnowledgeDocuments()
    
    // Clear file input
    event.target.value = ''
    
    alert('Document uploaded and processed successfully!')
  } catch (err) {
    console.error('Error uploading document:', err)
    alert('Failed to upload document: ' + err.message)
  } finally {
    uploadLoading.value = false
  }
}

// Delete a knowledge document
const deleteDocument = async (documentId) => {
  if (!confirm('Are you sure you want to delete this document?')) return
  
  try {
    uploadLoading.value = true
    await agentsAPI.deleteKnowledgeDocument(agentId.value, documentId)
    await loadKnowledgeDocuments()
    alert('Document deleted successfully!')
  } catch (err) {
    console.error('Error deleting document:', err)
    alert('Failed to delete document: ' + err.message)
  } finally {
    uploadLoading.value = false
  }
}

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Get file icon based on file type
const getFileIcon = (fileType) => {
  if (fileType === 'application/pdf') return '📄'
  if (fileType === 'image/jpeg' || fileType === 'image/jpg') return '🖼️'
  if (fileType === 'image/png') return '🖼️'
  return '📁'
}

const goBack = () => {
  router.push('/dashboard/ai-agent')
}
</script>

<style scoped>
.ai-agent-create {
  padding: 2rem;
  max-width: 1400px;
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.illustration-icon {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #ff69b4, #ff1493);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
}

.content-section {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.form-section {
  flex: 1;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
}

.tab-btn {
  flex: 1;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  transition: all 0.2s;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  background: #f8f9fa;
}

.tab-btn.active {
  color: #ff385c;
  border-bottom-color: #ff385c;
  background: white;
}

.tab-content {
  padding: 2rem;
}

.agent-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ff385c;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #999;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.cancel-btn,
.save-btn,
.generate-btn {
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: white;
  border: 1px solid #e0e0e0;
  color: #666;
}

.cancel-btn:hover {
  border-color: #999;
  color: #333;
}

.save-btn {
  background: #ff385c;
  border: none;
  color: white;
}

.save-btn:hover {
  background: #e73147;
}

.generate-btn {
  background: #28a745;
  border: none;
  color: white;
}

.generate-btn:hover {
  background: #218838;
}

.generate-btn:disabled,
.save-btn:disabled,
.cancel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.preview-section {
  flex: 1;
  max-width: 400px;
}

.chat-preview {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  overflow: hidden;
  height: 600px;
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.chat-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff69b4, #ff1493);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.chat-name {
  font-weight: 500;
  color: #333;
}

.chat-actions {
  display: flex;
  gap: 0.5rem;
}

.chat-action-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
  transition: background-color 0.2s;
}

.chat-action-btn:hover {
  background: #e0e0e0;
}

.chat-messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 80%;
}

.user-message {
  align-self: flex-end;
}

.user-message .message-text {
  background: #ff385c;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 18px 18px 4px 18px;
}

.bot-message {
  align-self: flex-start;
}

.bot-message .message-text {
  background: #f0f0f0;
  color: #333;
  padding: 0.75rem 1rem;
  border-radius: 18px 18px 18px 4px;
}

.message-time {
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.25rem;
  align-self: flex-end;
}

.product-showcase {
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.product-image {
  border-radius: 8px;
  overflow: hidden;
}

.product-img {
  width: 80px;
  height: 60px;
  background: linear-gradient(135deg, #ff69b4, #ff1493);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
}

.chat-input {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.message-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 0.9rem;
}

.message-input:focus {
  outline: none;
  border-color: #ff385c;
}

.send-btn {
  background: #ff385c;
  border: none;
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  color: white;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.send-btn:hover {
  background: #e73147;
}

.upload-area {
  margin-top: 0.5rem;
}

.upload-box {
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #fafafa;
}

.upload-box:hover {
  border-color: #ff385c;
  background: #fff5f7;
}

.upload-box.uploading {
  border-color: #ff385c;
  background: #fff5f7;
  opacity: 0.7;
  cursor: not-allowed;
}

.upload-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #666;
}

.upload-box p {
  margin: 0.5rem 0;
  color: #333;
  font-weight: 500;
}

.upload-box small {
  color: #666;
  font-size: 0.8rem;
}

.documents-list {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.documents-list h4 {
  margin-bottom: 1rem;
  color: #333;
  font-size: 1rem;
}

.document-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.document-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.document-name {
  font-weight: 500;
  color: #333;
}

.document-size,
.document-date {
  font-size: 0.8rem;
  color: #666;
}

.delete-doc-btn {
  background: none;
  border: 1px solid #e0e0e0;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  color: #999;
  transition: all 0.2s;
}

.delete-doc-btn:hover {
  border-color: #ff4757;
  color: #ff4757;
}

.delete-doc-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 1024px) {
  .content-section {
    flex-direction: column;
  }
  
  .preview-section {
    max-width: none;
  }
  
  .chat-preview {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .ai-agent-create {
    padding: 1rem;
  }
  
  .learning-content {
    flex-direction: column;
    text-align: center;
  }
  
  .learning-text h1 {
    font-size: 1.5rem;
  }
  
  .illustration-icon {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }
  
  .tab-content {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style> 