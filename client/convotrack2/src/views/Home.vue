<template>
  <div class="home">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <div class="logo">
          <img src="/src/assets/Logo.png" alt="logo" class="logo-image">
        </div>
        <nav class="nav">
          <a href="#features">Features</a>
          <a href="#solutions">Solutions</a>
          <a href="#pricing">Pricing</a>
          <a href="#resources">Resources</a>
        </nav>
        <div class="auth-buttons">
          <RouterLink to="/login" class="btn-signin">Sign In</RouterLink>
          <RouterLink to="/signup" class="btn-signup">Sign Up</RouterLink>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-left">
            <div class="hero-tag">
              <span class="tag-icon">🔥</span>
              <span>Supercharge strategi operasional bisnis anda</span>
            </div>
            <h1 class="hero-title">
              Optimalkan Penjualan<br>
              & Layanan Pelanggan<br>
              <span class="highlight">24/7 Dengan AI Agents</span>
            </h1>
            <p class="hero-description">
              Tingkatkan strategi bisnis operasional anda dengan AI agents<br>
              ConvoTrack yang terhubung dengan software CRM
            </p>
            <div class="cta-section">
              <div class="email-input-group">
                <input 
                  type="email" 
                  placeholder="Enter your email..." 
                  v-model="email" 
                  class="email-input"
                />
                <button class="btn-demo" @click="requestDemo">Request Demo</button>
              </div>
            </div>
          </div>
          <div class="hero-right">
            <div class="hero-image-placeholder">
              <!-- Placeholder for the laptop with AI agents illustration -->
              <div class="laptop-mockup">
                <img src="/src/assets/hero1.png" alt="AI Agents" class="hero-image">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Summary -->
    <section id="features" class="features">
      <div class="container">
        <h2>AI Agent Terbaik Untuk Pelayanan Konsumen Modern</h2>
        <p class="features-subtitle">Semua Langsung Dalam Satu Platform</p>
        
        <div class="features-layout">
          <!-- Top Left Feature -->
          <div class="feature-item top-left">
            <div class="feature-icon">💬</div>
            <h3>Natural Language Style</h3>
            <p>Tone dari AI Agent convo track bot bisa disesuaikan dan diatur</p>
          </div>
          
          <!-- Top Right Feature -->
          <div class="feature-item top-right">
            <div class="feature-icon">🎯</div>
            <h3>Fitur Leads Tracker</h3>
            <p>AI Agent kami dapat langsung mengirimkan link payment order sesuai apa yang ditanyakan konsumen</p>
          </div>
          
          <!-- Central Image Area -->
          <div class="central-image">
            <img src="/src/assets/hero2.png" alt="AI Agents" class="hero-image">
          </div>
          
          <!-- Bottom Left Feature -->
          <div class="feature-item bottom-left">
            <div class="feature-icon">🛒</div>
            <h3>Dapat Closing Order</h3>
            <p>AI Agent kami dapat langsung mengirimkan link payment order sesuai apa yang ditanyakan konsumen</p>
          </div>
          
          <!-- Bottom Right Feature -->
          <div class="feature-item bottom-right">
            <div class="feature-icon">📊</div>
            <h3>Laporan Penjualan</h3>
            <p>Sistem kami akan membuat laporan keuangan harian, bulanan dan tahunan</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Features Showcase -->
    <section id="solutions" class="solutions">
      <div class="container">
        <h2>Fitur Unggulan Yang Dapat Anda Nikmati</h2>
        <div class="showcase">
          <div class="card">
            <div class="img-placeholder">[AI Bot]</div>
            <h3>AI Agent Bot</h3>
            <p>Menjawab pertanyaan, rekomendasi produk, dan otomatisasi pesanan.</p>
          </div>
          <div class="card">
            <div class="img-placeholder">[Leads]</div>
            <h3>Lead Management</h3>
            <p>Sistem pengelolaan prospek otomatis dan terstruktur.</p>
          </div>
          <div class="card">
            <div class="img-placeholder">[Reports]</div>
            <h3>Laporan Keuangan</h3>
            <p>Statistik penjualan lengkap dan visualisasi data terperinci.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="pricing">
      <div class="container">
        <h2>Pilih Paket Sesuai Kebutuhan Anda</h2>
        <div class="pricing-grid">
          <div class="pricing-card">
            <h3>Rp 300k</h3>
            <p>Basic Plan untuk bisnis pemula</p>
            <ul>
              <li>✓ CRM dasar</li>
              <li>✓ Tracking chat</li>
              <li>✓ 1000 Credits</li>
            </ul>
            <button class="btn primary">Coba Sekarang</button>
          </div>
          <div class="pricing-card">
            <h3>Rp 500k</h3>
            <p>Growth Plan untuk skala menengah</p>
            <ul>
              <li>✓ Semua di Basic</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Workflow automation</li>
            </ul>
            <button class="btn primary">Coba Sekarang</button>
          </div>
          <div class="pricing-card">
            <h3>Rp 1.000k</h3>
            <p>Enterprise Plan untuk bisnis besar</p>
            <ul>
              <li>✓ Unlimited Chat</li>
              <li>✓ Custom AI</li>
              <li>✓ Dedicated Manager</li>
            </ul>
            <button class="btn primary">Coba Sekarang</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Business Section -->
    <section id="resources" class="business">
      <div class="container">
        <div class="business-content">
          <div class="business-text">
            <h2>Kelola Operasional Bisnis Dalam Satu Tempat</h2>
            <ul>
              <li>🎯 UI Design Yang Beginner Friendly</li>
              <li>📍 Semua Dilakukan Secara Terpusat</li>
            </ul>
            <button class="btn primary">Book A Demo</button>
          </div>
          <div class="business-img">
            <div class="img-placeholder">[Dashboard Screenshot]</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 ConvoTrack. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const email = ref('')

const requestDemo = () => {
  console.log('Demo request for:', email.value)
  // TODO: Implement demo request logic
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.home {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  overflow-x: hidden;
  width: 100%;
  margin: 0;
  padding: 0;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Header Styles */
.header {
  background: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  height: 70px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
 
  font-weight: 700;
  color: #333;
}

.logo-icon {
  background: linear-gradient(135deg, #ff385c, #e73147);
  border-radius: 8px;
  padding: 4px;
  color: white;
  font-size: 1.2rem;
}

.logo-image {
  width: 250px;
  height: 50px;
}

.nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav a {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.nav a:hover {
  color: #333;
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-signin {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-signin:hover {
  color: #333;
  background: #f5f5f5;
}

.btn-signup {
  text-decoration: none;
  background: #333;
  color: white;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-signup:hover {
  background: #222;
}

/* Hero Section Styles */
.hero {
  background: linear-gradient(135deg, #fafbfc 0%, #f8f9fa 100%);
  padding: 120px 0 80px 0;
  min-height: 600px;
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
}

.hero-left {
  flex: 1;
  max-width: 600px;
}

.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 56, 92, 0.1);
  background-color: #ffffff;
  color: #000000;
  background-origin: padding-box;
  padding: 0.5rem 1rem;
  border-radius: 85.199px;
  border: 2.13px solid #E1E1E1;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 2rem;
}

.tag-icon {
  font-size: 1rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  color: #333;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.highlight {
  color: #ff385c;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 2.5rem;
}

.cta-section {
  margin-top: 2rem;
}

.email-input-group {
  display: flex;
  gap: 0;
  background: white;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 450px;
}

.email-input {
  flex: 1;
  border: none;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border-radius: 6px;
  outline: none;
  background: transparent;
}

.email-input::placeholder {
  color: #999;
}

.btn-demo {
  background: #333;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-demo:hover {
  background: #222;
  transform: translateY(-1px);
}

.hero-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image-placeholder {
  position: relative;
  width: 100%;
  max-width: 600px;
  aspect-ratio: 1.2;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  border-radius: 12px;
}

.laptop-mockup {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

/* .laptop-screen {
  width: 100%;
  height: 100%;
  background: #000;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
} */

/* .chat-bubble {
  position: absolute;
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  color: white;
  padding: 12px 16px;
  border-radius: 20px;
  font-size: 1.2rem;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
  animation: float 3s ease-in-out infinite;
}

.chat-1 {
  top: 20%;
  left: -20px;
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  animation-delay: 0s;
}

.chat-2 {
  bottom: 30%;
  right: -25px;
  background: linear-gradient(135deg, #2196F3, #1565C0);
  animation-delay: 1s;
}

.smiley-face {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  background: linear-gradient(135deg, #FFD700, #FFA000);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.1); }
} */

/* Responsive Design */
@media (max-width: 968px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
    gap: 3rem;
  }
  
  .hero-title {
    font-size: 2.8rem;
  }
  
  .hero-image-placeholder {
    max-width: 400px;
    aspect-ratio: 1.3;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .hero {
    padding: 100px 0 60px 0;
  }
  
  .hero-title {
    font-size: 2.2rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .email-input-group {
    flex-direction: column;
    max-width: 100%;
  }
  
  .btn-demo {
    width: 100%;
  }
  
  .hero-image-placeholder {
    max-width: 300px;
    aspect-ratio: 1.1;
  }
}

.logo {
  font-weight: bold;
  font-size: 1.5rem;
  color: #ff385c;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav a, .btn {
  text-decoration: none;
  color: #333;
  background: none;
  border: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s;
  cursor: pointer;
  font-size: 1rem;
}

.nav a:hover, .btn:hover {
  background: #f5f5f5;
}

.btn.primary {
  background: #ff385c;
  color: #fff;
}

.btn.primary:hover {
  background: #e73147;
}

.hero {
  padding: 6rem 0 4rem;
  background: linear-gradient(135deg, #fef7f7 0%, #fff 100%);
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 3rem;
}

.hero-text {
  flex: 1;
  min-width: 300px;
}

.hero-text h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #222;
  line-height: 1.2;
}

.hero-text p {
  font-size: 1.125rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.cta-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.cta-group input {
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  min-width: 220px;
  flex: 1;
}

.hero-img {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 300px;
}

.img-placeholder {
  width: 300px;
  height: 200px;
  background: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  border: 1px dashed #ccc;
  border-radius: 8px;
}

.features, .solutions, .pricing, .business {
  padding: 4rem 0;
  text-align: center;
}

.features h2, .solutions h2, .pricing h2, .business h2 {
  font-size: 2rem;
  margin-bottom: 3rem;
  color: #222;
}

.feature-grid, .showcase, .pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-item {
  text-align: center;
  padding: 1rem;
}

.feature-item h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #333;
}

.feature-item p {
  color: #666;
  line-height: 1.6;
}

.card, .pricing-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  text-align: center;
}

.pricing-card h3 {
  font-size: 2rem;
  color: #ff385c;
  margin-bottom: 1rem;
}

.pricing-card ul {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
}

.pricing-card li {
  padding: 0.5rem 0;
  color: #666;
}

.business {
  background: #f8f9fa;
}

.business-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 3rem;
  text-align: left;
}

.business-text {
  flex: 1;
  min-width: 300px;
}

.business-text ul {
  list-style: none;
  padding: 0;
  margin: 2rem 0;
}

.business-text li {
  padding: 0.5rem 0;
  font-size: 1.125rem;
  color: #333;
}

.business-img {
  flex: 1;
  display: flex;
  justify-content: center;
  min-width: 300px;
}

.footer {
  background: #333;
  color: white;
  padding: 2rem 0;
  text-align: center;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .nav {
    gap: 1rem;
  }
  
  .hero-text h1 {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .header .container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .hero {
    padding: 5rem 0 3rem;
  }
  
  .hero-content, .business-content {
    flex-direction: column;
    text-align: center;
  }
  
  .hero-text h1 {
    font-size: 1.75rem;
  }
  
  .features, .solutions, .pricing, .business {
    padding: 3rem 0;
  }
  
  .feature-grid, .showcase, .pricing-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .cta-group {
    flex-direction: column;
  }
  
  .cta-group input {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 0.5rem;
  }
  
  .hero-text h1 {
    font-size: 1.5rem;
  }
  
  .hero-text p {
    font-size: 1rem;
  }
  
  .card, .pricing-card {
    padding: 1.5rem 1rem;
  }
}

/* Features Section */
.features {
  padding: 6rem 0;
  background: #fafbfc;
}

.features h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
  font-weight: 700;
}

.features-subtitle {
  text-align: center;
  font-size: 1.2rem;
  color: #888;
  margin-bottom: 4rem;
}

.features-layout {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 500px 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 3rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 600px;
  align-items: center;
}

.feature-item {
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  max-width: 350px;
}

.feature-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  display: block;
}

.feature-item h3 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #333;
  font-weight: 600;
  line-height: 1.3;
}

.feature-item p {
  color: #666;
  line-height: 1.6;
  font-size: 0.95rem;
}

/* Positioning for better alignment */
.top-left {
  grid-column: 1;
  grid-row: 1;
  justify-self: end;
  text-align: right;
}

.top-right {
  grid-column: 3;
  grid-row: 1;
  justify-self: start;
  text-align: left;
}

.bottom-left {
  grid-column: 1;
  grid-row: 2;
  justify-self: end;
  text-align: right;
}

.bottom-right {
  grid-column: 3;
  grid-row: 2;
  justify-self: start;
  text-align: left;
}

/* Central Image Area - Fixed Proportions */
.central-image {
  grid-column: 2;
  grid-row: 1 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  aspect-ratio: 4/3;
  max-width: 500px;
  max-height: 400px;
  justify-self: center;
  align-self: center;
}

.central-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  border-radius: 12px;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .features-layout {
    grid-template-columns: 1fr 400px 1fr;
    gap: 2rem;
    max-width: 1200px;
  }
  
  .central-image {
    max-width: 400px;
    max-height: 320px;
  }
  
  .feature-item {
    padding: 2rem 1.5rem;
    max-width: 300px;
  }
}

@media (max-width: 968px) {
  .features-layout {
    grid-template-columns: 1fr 350px 1fr;
    gap: 1.5rem;
  }
  
  .central-image {
    max-width: 350px;
    max-height: 280px;
  }
  
  .feature-item {
    max-width: 280px;
  }
}

@media (max-width: 768px) {
  .features {
    padding: 4rem 0;
  }
  
  .features-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: 2rem;
    max-width: 500px;
  }
  
  .top-left, .top-right, .bottom-left, .bottom-right {
    grid-column: 1;
    text-align: center;
    justify-self: center;
    max-width: 100%;
  }
  
  .central-image {
    grid-column: 1;
    order: 3;
    max-width: 400px;
    max-height: 300px;
    aspect-ratio: 4/3;
  }
  
  .top-left { order: 1; }
  .top-right { order: 2; }
  .bottom-left { order: 4; }
  .bottom-right { order: 5; }
}

@media (max-width: 480px) {
  .features {
    padding: 3rem 0;
  }
  
  .feature-item {
    padding: 1.5rem;
  }
  
  .central-image {
    max-width: 320px;
    max-height: 240px;
    padding: 1rem;
  }
  
  .features h2 {
    font-size: 2rem;
  }
  
  .features-subtitle {
    font-size: 1rem;
  }
}
</style>