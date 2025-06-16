<template>
  <div class="dashboard">
    <!-- Main Dashboard Layout -->
    <div class="dashboard-container">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="logo">
          <img src="C:\Users\bridg\OneDrive\Documents\ConvoTrack2\client\convotrack2\src\assets\Logo.png" alt="logo" class="logo-img" width="100" height="32">
        </div>
        <div class="header-actions">
          <div class="search-bar">
            <input type="text" placeholder="Search" class="search-input">
            <span class="search-icon">🔍</span>
          </div>
          <div class="header-buttons">
            <button class="header-btn">⚙️</button>
            <button class="header-btn">🔔</button>
          </div>
          <div class="user-avatar">
            <img src="https://via.placeholder.com/40" alt="User" class="avatar-img">
          </div>
        </div>
      </div>

      <!-- Sidebar and Content -->
      <div class="dashboard-content">
        <div class="sidebar">
          <div class="general-menu">
            <span class="menu-title">GENERAL MENU</span>
          </div>
          <nav class="sidebar-nav">
            <div class="nav-item">
              <span class="nav-icon">📄</span>
              <span>Laporan</span>
            </div>
            <div
              class="nav-item"
              :class="{ active: router.currentRoute.value.path.startsWith('/dashboard/ai-agent') }"
              @click="navigateToAIAgent"
            >
              <span class="nav-icon">🤖</span>
              <span>AI Agent</span>
            </div>
            <div
              class="nav-item"
              :class="{ active: router.currentRoute.value.path.startsWith('/dashboard/chat') }"
              @click="navigateToChat"
            >
              <span class="nav-icon">💬</span>
              <span>Chat</span>
            </div>
            <div class="nav-item logout" @click="logout">
              <span class="nav-icon">🚪</span>
              <span>Logout</span>
            </div>
          </nav>
        </div>

        <!-- Main Content - AI Agent Dashboard -->
        <div class="main-content">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToAIAgent = () => {
  router.push('/dashboard/ai-agent')
}

const navigateToChat = () => {
  router.push('/dashboard/chat')
}

const logout = () => {
  router.push('/')
}

// Redirect to AI Agent by default
onMounted(() => {
  if (router.currentRoute.value.path === '/dashboard') {
    router.replace('/dashboard/ai-agent')
  }
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 0;
  margin: 0;
}

.dashboard-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
}

.dashboard-header {
  background: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ff385c;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 0.9rem;
  width: 300px;
  background: #f8f9fa;
}

.search-input:focus {
  outline: none;
  border-color: #ff385c;
}

.search-icon {
  position: absolute;
  right: 1rem;
  color: #666;
}

.header-buttons {
  display: flex;
  gap: 0.5rem;
}

.header-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background-color 0.2s;
}

.header-btn:hover {
  background: #f0f0f0;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dashboard-content {
  display: flex;
  min-height: calc(100vh - 80px);
}

.sidebar {
  width: 250px;
  background: white;
  border-right: 1px solid #e9ecef;
  padding: 1.5rem 0;
}

.general-menu {
  padding: 0 1rem;
  margin-bottom: 1rem;
}

.menu-title {
  font-size: 0.8rem;
  color: #999;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
  font-weight: 500;
}

.nav-item:hover {
  background: #f8f9fa;
  color: #333;
}

.nav-item.active {
  background: #ffe6ed;
  color: #ff385c;
}

.nav-item.logout {
  margin-top: auto;
  color: #ff4757;
}

.nav-item.logout:hover {
  background: #fff5f5;
}

.nav-icon {
  font-size: 1.25rem;
}

.main-content {
  flex: 1;
  background: #f5f7fa;
  overflow-y: auto;
}

@media (max-width: 1024px) {
  .dashboard-content {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e9ecef;
    padding: 1rem;
  }
  
  .sidebar-nav {
    flex-direction: row;
    gap: 0.5rem;
    overflow-x: auto;
    padding: 0;
  }
  
  .nav-item {
    white-space: nowrap;
    min-width: auto;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .search-input {
    width: 200px;
  }
}

@media (max-width: 480px) {
  .header-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .search-input {
    width: 250px;
  }
  
  .nav-item span:last-child {
    display: none;
  }
}

.logo-img {
  width: 200px;
  height: 50px;
  object-fit: contain;
}
</style> 