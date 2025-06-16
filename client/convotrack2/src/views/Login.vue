<template>
  <div class="login-page">
    <!-- Header Navigation -->
    <header class="header">
      <div class="nav-brand">
        <span class="brand-name">ConvoTrack</span>
      </div>
      <nav class="nav-links">
        <a href="#" class="nav-link">Features</a>
        <a href="#" class="nav-link">Solutions</a>
        <a href="#" class="nav-link">Pricing</a>
        <a href="#" class="nav-link">Resources</a>
        <RouterLink to="/login" class="nav-link login-btn">Log In</RouterLink>
        <RouterLink to="/signup" class="nav-link signup-btn">Sign Up</RouterLink>
      </nav>
    </header>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Left Side - Login Form -->
      <div class="login-section">
        <div class="login-container">
          <h1>Selamat Datang!</h1>
          <p class="subtitle">Masukkan Email Dan Kata Sandi Sekarang</p>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="email" 
                required
                placeholder="e.g bridgetbeatrxc@gmail.com"
              >
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <div class="input-wrapper">
                <input 
                  :type="showPassword ? 'text' : 'password'"
                  id="password" 
                  v-model="password" 
                  required
                  placeholder="e.g satuduatiga"
                >
                <button type="button" class="toggle-password" @click="togglePassword">
                  👁️
                </button>
              </div>
            </div>

            <div class="form-footer">
              <label class="remember-me">
                <input type="checkbox" v-model="rememberMe">
                <span>Ingat Saya</span>
              </label>
              <a href="#" class="forgot-password">Lupa kata sandi</a>
            </div>

            <button type="submit" class="sign-in-btn">Sign In</button>
            
            <button type="button" class="google-btn">
              <span>G</span>
              Sign in with Google
            </button>

            <div class="signup-prompt">
              <span>Belum Punya Akun?</span>
              <RouterLink to="/signup" class="signup-link">Sign Up</RouterLink>
            </div>
          </form>
        </div>
      </div>

      <!-- Right Side - Preview Section -->
      <div class="preview-section">
        <div class="preview-container">
          <div class="browser-mockup">
            <!-- Browser Header -->
            <div class="browser-header">
              <div class="browser-dots">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
              </div>
              <div class="url-bar">
                <span>app.convotrack.dashboard</span>
              </div>
            </div>

            <!-- App Preview Content -->
            <div class="app-preview">
              <div class="sidebar">
                <div class="sidebar-header">
                  <span>ConvoTrack</span>
                </div>
                <nav class="sidebar-nav">
                  <div class="nav-item active">
                    <span>Dashboard</span>
                  </div>
                  <div class="nav-item">
                    <span>Customers</span>
                  </div>
                  <div class="nav-item">
                    <span>Conversations</span>
                  </div>
                  <div class="nav-item">
                    <span>AI Agents</span>
                  </div>
                  <div class="nav-item">
                    <span>Analytics</span>
                  </div>
                </nav>
              </div>

              <div class="main-area">
                <div class="dashboard-preview">
                  <h3>Dashboard Overview</h3>
                  <div class="stats-grid">
                    <div class="stat-card">
                      <h4>24</h4>
                      <p>Active Chats</p>
                    </div>
                    <div class="stat-card">
                      <h4>156</h4>
                      <p>Total Leads</p>
                    </div>
                    <div class="stat-card">
                      <h4>89%</h4>
                      <p>Response Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = () => {
  // TODO: Implement actual login logic
  console.log('Login attempt:', { 
    email: email.value, 
    password: password.value,
    rememberMe: rememberMe.value 
  })
  
  // Redirect to dashboard
  router.push('/dashboard')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #fef7f7 0%, #fff 100%);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ff385c;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-link:hover {
  color: #333;
}

.signup-btn {
  background: #333;
  color: white !important;
  padding: 0.75rem 1.5rem;
}

.signup-btn:hover {
  background: #000;
}

.main-content {
  display: flex;
  min-height: calc(100vh - 80px);
}

.login-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem 4rem;
  max-width: 500px;
  justify-content: center;
}

.login-container {
  width: 100%;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
  background: #fff;
  transition: border-color 0.2s;
}

input::placeholder {
  color: #999;
}

input:focus {
  outline: none;
  border-color: #ff385c;
}

.input-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  cursor: pointer;
}

.forgot-password {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-password:hover {
  text-decoration: underline;
}

.sign-in-btn {
  width: 100%;
  padding: 1rem;
  background: #333;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background-color 0.2s;
}

.sign-in-btn:hover {
  background: #000;
}

.google-btn {
  width: 100%;
  padding: 1rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  transition: background-color 0.2s;
}

.google-btn:hover {
  background: #f5f5f5;
}

.signup-prompt {
  text-align: center;
  color: #666;
}

.signup-link {
  color: #333;
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.25rem;
}

.signup-link:hover {
  text-decoration: underline;
}

.preview-section {
  flex: 1;
  padding: 2rem;
  background: linear-gradient(135deg, #fef7f7 0%, #fff1f3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-container {
  width: 100%;
  max-width: 600px;
}

.browser-mockup {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  overflow: hidden;
}

.browser-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.browser-dots {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.red { background: #ff5f56; }
.dot.yellow { background: #ffbd2e; }
.dot.green { background: #27ca3f; }

.url-bar {
  text-align: center;
  font-size: 0.875rem;
  color: #666;
}

.app-preview {
  display: flex;
  height: 400px;
  background: #fff;
}

.sidebar {
  width: 200px;
  background: #f8f9fa;
  padding: 1rem;
  border-right: 1px solid #e9ecef;
}

.sidebar-header {
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: #ff385c;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.875rem;
  color: #666;
}

.nav-item:hover {
  background: #e9ecef;
}

.nav-item.active {
  background: #ff385c;
  color: white;
}

.main-area {
  flex: 1;
  padding: 1.5rem;
}

.dashboard-preview h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-card {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  text-align: center;
}

.stat-card h4 {
  font-size: 1.5rem;
  color: #ff385c;
  margin-bottom: 0.5rem;
}

.stat-card p {
  color: #666;
  font-size: 0.875rem;
}

@media (max-width: 1024px) {
  .preview-section {
    display: none;
  }
  
  .login-section {
    max-width: none;
    padding: 2rem;
  }
}

@media (max-width: 640px) {
  .header {
    padding: 1rem;
  }
  
  .nav-links {
    gap: 1rem;
  }
  
  .login-section {
    padding: 1.5rem;
  }
  
  h1 {
    font-size: 2rem;
  }
}
</style>
