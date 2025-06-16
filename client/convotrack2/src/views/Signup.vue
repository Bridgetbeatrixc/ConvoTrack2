<template>
  <div class="signup-page">
    <!-- Pink Sign Up Header -->
    <div class="signup-header">
      <h1>SIGN UP</h1>
    </div>

    <!-- Initial Signup Form -->
    <div v-if="currentStep === 0" class="main-content">
      <!-- Left Side - Signup Form -->
      <div class="signup-section">
        <div class="signup-container">
          <div class="logo-section">
            <span class="logo">ConvoTrack</span>
          </div>
          
          <h2>Buat Akun Sekarang</h2>
          <p class="subtitle">Daftar sekarang dan mulai optimalkan bisnis Anda</p>

          <!-- Error Message -->
          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <form @submit.prevent="handleInitialSignup" class="signup-form">
            <div class="form-group">
              <label for="name">Nama</label>
              <input 
                type="text" 
                id="name" 
                v-model="initialData.name" 
                required
                placeholder="e.g John Doe"
              >
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="initialData.email" 
                required
                placeholder="e.g john@example.com"
              >
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <div class="input-wrapper">
                <input 
                  :type="showPassword ? 'text' : 'password'"
                  id="password" 
                  v-model="initialData.password" 
                  required
                  placeholder="Minimum 8 characters"
                >
                <button type="button" class="toggle-password" @click="togglePassword">
                  👁️
                </button>
              </div>
            </div>

            <div class="terms-checkbox">
              <label class="checkbox-label">
                <input type="checkbox" v-model="agreeToTerms" required>
                <span>Saya setuju dengan Terms of Service dan Privacy Policy</span>
              </label>
            </div>

            <button type="submit" class="create-account-btn" :disabled="!agreeToTerms || isSubmitting">
              {{ isSubmitting ? 'Creating Account...' : 'Create Account' }}
            </button>
            
            <button type="button" class="google-btn">
              <span>G</span>
              Sign up with Google
            </button>

            <div class="login-prompt">
              <span>Sudah Punya Akun?</span>
              <RouterLink to="/login" class="login-link">Sign In</RouterLink>
            </div>
          </form>
        </div>
      </div>

      <!-- Right Side - Dashboard Preview -->
      <div class="preview-section">
        <div class="preview-container">
          <h3>Sign up to ConvoTrack</h3>
          <p class="preview-subtitle">Bergabung dengan ribuan bisnis yang sudah menggunakan ConvoTrack</p>
          
          <div class="dashboard-mockup">
            <div class="mockup-header">
              <div class="window-controls">
                <span class="control red"></span>
                <span class="control yellow"></span>
                <span class="control green"></span>
              </div>
            </div>
            
            <div class="mockup-content">
              <div class="dashboard-preview">
                <div class="preview-sidebar">
                  <div class="sidebar-brand">ConvoTrack</div>
                  <div class="sidebar-menu">
                    <div class="menu-item active">Dashboard</div>
                    <div class="menu-item">Conversations</div>
                    <div class="menu-item">AI Agents</div>
                    <div class="menu-item">Customers</div>
                    <div class="menu-item">Analytics</div>
                  </div>
                </div>
                
                <div class="preview-main">
                  <div class="welcome-card">
                    <h4>Welcome to ConvoTrack!</h4>
                    <p>Start optimizing your customer conversations with AI</p>
                  </div>
                  
                  <div class="stats-preview">
                    <div class="stat-item">
                      <span class="stat-number">0</span>
                      <span class="stat-label">Active Chats</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-number">0</span>
                      <span class="stat-label">Total Leads</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-number">0%</span>
                      <span class="stat-label">Response Rate</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 1: Business Info -->
    <div v-else-if="currentStep === 1" class="business-info-step">
      <div class="business-info-container">
        <div class="card-header">
          <span class="logo-icon">📊</span>
          <span class="brand-name">ConvoTrack</span>
        </div>
        
        <div class="card-content">
          <h1>Tambahkan Info Bisnis Anda</h1>
          <p class="subtitle">Kami membutuhkan beberapa informasi bisnis untuk proses detail akun CRM anda</p>
          
          <!-- Error Message -->
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <div class="setup-icons">
            <div class="icon-item">
              <div class="icon-circle pink">
                <span>👤</span>
              </div>
              <span class="icon-label">Personal Info</span>
            </div>
            <div class="icon-item">
              <div class="icon-circle gray">
                <span>🏢</span>
              </div>
              <span class="icon-label">Business Details</span>
            </div>
          </div>

          <form @submit.prevent="handleBusinessInfo" class="business-form">
            <div class="form-group">
              <label for="businessName">Nama Bisnis</label>
              <input 
                type="text" 
                id="businessName" 
                v-model="businessData.name" 
                placeholder="Enter your business"
                required
              >
            </div>
            
            <div class="form-group">
              <label for="businessType">Bidang Bisnis</label>
              <select 
                id="businessType" 
                v-model="businessData.type"
                required
              >
                <option value="">Pilih bidang bisnis</option>
                <option value="retail">Retail</option>
                <option value="ecommerce">E-commerce</option>
                <option value="service">Jasa</option>
                <option value="manufacturing">Manufaktur</option>
                <option value="hospitality">Perhotelan</option>
                <option value="healthcare">Kesehatan</option>
                <option value="education">Pendidikan</option>
                <option value="food">Food and Business</option>
                <option value="other">Lainnya</option>
              </select>
            </div>

            <div class="form-group">
              <label for="businessAddress">Alamat Bisnis</label>
              <textarea 
                id="businessAddress" 
                v-model="businessData.address" 
                placeholder="Masukkan alamat bisnis lengkap"
                rows="3"
                required
              ></textarea>
            </div>

            <div class="add-location">
              <button type="button" class="add-location-btn">
                <span class="plus-icon">+</span>
                Tambah Lokasi Bisnis Anda
              </button>
            </div>

            <div class="form-buttons">
              <button type="submit" class="submit-btn">
                Selanjutnya
              </button>
            </div>
          </form>

          <div class="step-indicator">
            <span class="dot active">•</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 2: Personal Info -->
    <div v-else-if="currentStep === 2" class="personal-info-step">
      <div class="personal-info-container">
        <div class="card-header">
          <span class="logo-icon">📊</span>
          <span class="brand-name">ConvoTrack</span>
        </div>
        
        <div class="card-content">
          <h1>Tambahkan Info Personal Anda</h1>
          <p class="subtitle">Lengkapi informasi personal untuk menyelesaikan pendaftaran akun</p>
          
          <!-- Error Message -->
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <div class="setup-icons">
            <div class="icon-item">
              <div class="icon-circle gray">
                <span>👤</span>
              </div>
              <span class="icon-label">Personal Info</span>
            </div>
            <div class="icon-item">
              <div class="icon-circle pink">
                <span>🏢</span>
              </div>
              <span class="icon-label">Business Details</span>
            </div>
          </div>

          <form @submit.prevent="handlePersonalInfo" class="personal-form">
            <div class="form-group">
              <label for="fullName">Nama Lengkap</label>
              <input 
                type="text" 
                id="fullName" 
                v-model="personalData.fullName" 
                placeholder="Enter your fullname"
                required
              >
            </div>
            
            <div class="form-group">
              <label for="idNumber">Nomor Induk Kependudukan</label>
              <select 
                id="idNumber" 
                v-model="personalData.idType"
                required
              >
                <option value="">Pilih jenis ID</option>
                <option value="ktp">KTP</option>
                <option value="passport">Passport</option>
                <option value="sim">SIM</option>
                <option value="other">Lainnya</option>
              </select>
            </div>

            <div class="form-group">
              <label for="phoneNumber">Nomor Telepon</label>
              <input 
                type="tel" 
                id="phoneNumber" 
                v-model="personalData.phone" 
                placeholder="Masukkan nomor telepon"
                required
              >
            </div>

            <div class="form-buttons">
              <button type="button" class="back-btn" @click="currentStep = 1" :disabled="isSubmitting">
                Kembali
              </button>
              <button type="submit" class="submit-btn" :disabled="isSubmitting">
                {{ isSubmitting ? 'Membuat Akun...' : 'Daftar Sekarang' }}
              </button>
            </div>
          </form>

          <div class="step-indicator">
            <span class="dot active">•</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { authAPI } from '@/services/api'

const router = useRouter()

const currentStep = ref(0)
const agreeToTerms = ref(false)
const showPassword = ref(false)
const isSubmitting = ref(false)
const error = ref('')

const initialData = reactive({
  name: '',
  email: '',
  password: ''
})

const businessData = reactive({
  name: '',
  type: '',
  address: ''
})

const personalData = reactive({
  fullName: '',
  idType: '',
  phone: ''
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const validateInitialData = () => {
  if (!initialData.name.trim()) {
    throw new Error('Name is required')
  }
  if (!initialData.email.trim()) {
    throw new Error('Email is required')
  }
  if (!initialData.password || initialData.password.length < 6) {
    throw new Error('Password must be at least 6 characters long')
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(initialData.email)) {
    throw new Error('Please enter a valid email address')
  }
}

const handleInitialSignup = async () => {
  error.value = ''
  
  if (!agreeToTerms.value) {
    error.value = 'Please agree to the terms and conditions'
    return
  }
  
  try {
    validateInitialData()
    console.log('Initial signup data validated:', initialData)
    currentStep.value = 1
  } catch (err) {
    error.value = err.message
  }
}

const handleBusinessInfo = () => {
  error.value = ''
  
  if (!businessData.name.trim()) {
    error.value = 'Business name is required'
    return
  }
  if (!businessData.type) {
    error.value = 'Please select a business type'
    return
  }
  if (!businessData.address.trim()) {
    error.value = 'Business address is required'
    return
  }
  
  console.log('Business info:', businessData)
  currentStep.value = 2
}

const handlePersonalInfo = async () => {
  error.value = ''
  isSubmitting.value = true
  
  try {
    if (!personalData.fullName.trim()) {
      throw new Error('Full name is required')
    }
    if (!personalData.phone.trim()) {
      throw new Error('Phone number is required')
    }
    
    // Combine all data for submission
    const completeUserData = {
      email: initialData.email,
      password: initialData.password,
      fullName: personalData.fullName,
      businessName: businessData.name,
      businessField: businessData.type,
      businessAddress: businessData.address,
      idNumber: personalData.idType,
      phoneNumber: personalData.phone
    }
    
    console.log('Submitting complete registration data:', completeUserData)
    
    // Submit to backend
    const response = await authAPI.signup(completeUserData)
    
    if (response.token) {
      // Store token
      localStorage.setItem('auth_token', response.token)
    }
    
    // Show success message
    alert('Registration completed successfully! Welcome to ConvoTrack!')
    
    // Redirect to dashboard
    router.push('/dashboard')
    
  } catch (err) {
    console.error('Registration error:', err)
    error.value = err.message || 'Registration failed. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.signup-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.signup-header {
  background: linear-gradient(135deg, #ff69b4, #ff1493);
  color: white;
  padding: 1rem 2rem;
  position: relative;
}

.signup-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #fcc;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

/* Initial Signup Styles */
.main-content {
  display: flex;
  min-height: calc(100vh - 80px);
  background: white;
}

.signup-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem 3rem;
  max-width: 450px;
  justify-content: center;
}

.logo-section {
  margin-bottom: 2rem;
}

.logo {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ff385c;
}

h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1rem;
  margin-bottom: 2rem;
}

/* Business/Personal Info Steps */
.business-info-step,
.personal-info-step {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 2rem;
}

.business-info-container,
.personal-info-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  padding: 0;
  width: 100%;
  max-width: 600px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f0f0f0;
}

.logo-icon {
  font-size: 1.25rem;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ff385c;
}

.card-content {
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
  text-align: center;
}

.card-content .subtitle {
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.setup-icons {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 2rem;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.icon-circle.pink {
  background: linear-gradient(135deg, #ff69b4, #ff1493);
  color: white;
}

.icon-circle.gray {
  background: #e0e0e0;
  color: #999;
}

.icon-label {
  font-size: 0.8rem;
  color: #666;
}

/* Form Styles */
.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

input, select, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  color: #333;
  background: white;
  transition: border-color 0.2s;
  font-family: inherit;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #ff385c;
}

input::placeholder, textarea::placeholder {
  color: #999;
}

select {
  cursor: pointer;
}

textarea {
  resize: vertical;
  min-height: 80px;
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

.terms-checkbox {
  margin-bottom: 1.5rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: #666;
  cursor: pointer;
  line-height: 1.4;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.add-location {
  margin-bottom: 2rem;
  text-align: center;
}

.add-location-btn {
  background: transparent;
  border: 2px dashed #ff385c;
  color: #ff385c;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
}

.add-location-btn:hover {
  background: rgba(255, 56, 92, 0.05);
}

.plus-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.form-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.back-btn {
  background: transparent;
  color: #666;
  border: 1px solid #ddd;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #bbb;
}

.back-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-btn,
.create-account-btn {
  background: #333;
  color: white;
  border: none;
  padding: 1rem 3rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover,
.create-account-btn:hover:not(:disabled) {
  background: #000;
}

.create-account-btn {
  width: 100%;
  margin-bottom: 1rem;
}

.create-account-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
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

.login-prompt {
  text-align: center;
  color: #666;
}

.login-link {
  color: #333;
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.25rem;
}

.login-link:hover {
  text-decoration: underline;
}

.step-indicator {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.dot {
  color: #ff385c;
  font-size: 1.5rem;
  font-weight: bold;
}

/* Preview Section Styles */
.preview-section {
  flex: 1;
  padding: 3rem;
  background: linear-gradient(135deg, #fef7f7 0%, #fff1f3 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.preview-container h3 {
  font-size: 1.75rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.preview-subtitle {
  color: #666;
  margin-bottom: 2rem;
}

.dashboard-mockup {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  overflow: hidden;
}

.mockup-header {
  background: #f8f9fa;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e9ecef;
}

.window-controls {
  display: flex;
  gap: 0.5rem;
}

.control {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.control.red { background: #ff5f56; }
.control.yellow { background: #ffbd2e; }
.control.green { background: #27ca3f; }

.mockup-content {
  height: 350px;
}

.dashboard-preview {
  display: flex;
  height: 100%;
}

.preview-sidebar {
  width: 180px;
  background: #f8f9fa;
  padding: 1rem;
  border-right: 1px solid #e9ecef;
}

.sidebar-brand {
  font-weight: 600;
  color: #ff385c;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-item {
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
  color: #666;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background: #e9ecef;
}

.menu-item.active {
  background: #ff385c;
  color: white;
}

.preview-main {
  flex: 1;
  padding: 1.5rem;
}

.welcome-card {
  background: linear-gradient(135deg, #ff385c, #e73147);
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.welcome-card h4 {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.welcome-card p {
  font-size: 0.9rem;
  opacity: 0.9;
}

.stats-preview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-item {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.stat-number {
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
  color: #ff385c;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
}

@media (max-width: 1024px) {
  .preview-section {
    display: none;
  }
  
  .signup-section {
    max-width: none;
    padding: 2rem;
  }
  
  .business-info-step,
  .personal-info-step {
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .setup-icons {
    gap: 2rem;
  }
  
  .icon-circle {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }
  
  .card-content {
    padding: 1.5rem;
  }
  
  h1 {
    font-size: 1.75rem;
  }
}

@media (max-width: 640px) {
  .signup-header {
    padding: 1rem;
  }
  
  .signup-section {
    padding: 1.5rem;
  }
  
  .card-header {
    padding: 1rem;
  }
  
  .card-content {
    padding: 1rem;
  }
  
  h2 {
    font-size: 1.75rem;
  }
}
</style>
