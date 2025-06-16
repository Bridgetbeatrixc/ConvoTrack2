const { OpenAI } = require('openai');
const { db } = require('./supabase');

// Initialize OpenAI client with error handling
let openai = null;

try {
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('✅ OpenAI client initialized successfully');
  } else {
    console.log('⚠️  OpenAI API key not configured. AI features will be disabled.');
  }
} catch (error) {
  console.error('❌ Failed to initialize OpenAI client:', error.message);
}

/**
 * Get relevant knowledge base context for a message
 * @param {number} agentId - AI agent ID
 * @param {string} userMessage - User's message
 * @returns {Promise<string>} - Relevant knowledge context
 */
async function getKnowledgeContext(agentId, userMessage) {
  try {
    const { data: documents, error } = await db.knowledgeDocuments.getByAgent(agentId);
    
    if (error || !documents || documents.length === 0) {
      return '';
    }

    // Simple keyword matching - in production, you might want to use vector embeddings
    const keywords = userMessage.toLowerCase().split(' ').filter(word => word.length > 3);
    let relevantContent = '';
    
    for (const doc of documents) {
      const content = doc.content.toLowerCase();
      const matchCount = keywords.filter(keyword => content.includes(keyword)).length;
      
      if (matchCount > 0) {
        // Add relevant parts of the document (first 1000 chars as example)
        relevantContent += `\n\nFrom ${doc.original_filename}:\n${doc.content.substring(0, 1000)}...`;
      }
    }
    
    return relevantContent.substring(0, 2000); // Limit context to prevent token overflow
  } catch (error) {
    console.error('Error fetching knowledge context:', error);
    return '';
  }
}

/**
 * Generate AI response for chat messages
 * @param {Array} messages - Array of message objects with role and content
 * @param {Object} agentConfig - AI agent configuration
 * @returns {Promise<string>} - AI response
 */
async function generateChatResponse(messages, agentConfig = {}) {
  if (!openai) {
    // Return fallback response when OpenAI is not available
    return 'Terima kasih atas pesan Anda. Saat ini sistem AI sedang dalam pemeliharaan. Tim kami akan segera membalas pesan Anda.';
  }

  try {
    let systemPrompt = agentConfig.behaviour || 
      'Anda adalah sales agent yang berpengalaman untuk ConvoTrack. Tujuan Anda adalah membantu pelanggan dan mengkonversi mereka menjadi pembeli. Gunakan pendekatan yang ramah namun persuasif, tanyakan kebutuhan mereka, dan tawarkan solusi yang tepat. Selalu dorong untuk melakukan tindakan atau pembelian. Gunakan bahasa Indonesia yang profesional dan meyakinkan.';

    // Get knowledge context if agent has knowledge base
    if (agentConfig.agentId && messages.length > 0) {
      const lastUserMessage = messages[messages.length - 1];
      if (lastUserMessage.role === 'user') {
        const knowledgeContext = await getKnowledgeContext(agentConfig.agentId, lastUserMessage.content);
        
        if (knowledgeContext) {
          systemPrompt += '\n\nRelevant information from knowledge base:' + knowledgeContext;
          systemPrompt += '\n\nUse this information to provide accurate and specific answers when relevant.';
        }
      }
    }

    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: chatMessages,
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 500,
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate AI response');
  }
}

/**
 * Generate agent behavior suggestions based on business description
 * @param {string} businessDescription - Description of the business
 * @returns {Promise<string>} - Suggested AI behavior
 */
async function generateAgentBehavior(businessDescription) {
  if (!openai) {
    // Return fallback behavior when OpenAI is not available
    return `Anda adalah sales agent yang sangat berpengalaman dan persuasif untuk ${businessDescription}. Tujuan utama Anda adalah mengkonversi setiap pelanggan menjadi pembeli. Selalu sapa pelanggan dengan antusias, tanyakan kebutuhan mereka, tawarkan produk/layanan yang sesuai, dan dorong mereka untuk melakukan pembelian. Gunakan teknik closing yang efektif dan selalu berikan urgency atau penawaran terbatas untuk mendorong keputusan cepat.`;
  }

  try {
    const prompt = `
Based on this business description, create a professional sales-focused AI chatbot behavior guide in Indonesian:

Business: ${businessDescription}

Create a behavior guide for a sales agent that includes:
1. Enthusiastic greeting and rapport building
2. Proactive sales approach and persuasive communication tone
3. How to identify customer needs and pain points
4. Product/service recommendation strategies
5. Closing techniques and urgency creation
6. Handling objections professionally
7. Follow-up strategies

The agent should act like a skilled salesperson who aims to convert every interaction into a sale while maintaining professionalism. Keep it concise but comprehensive in Indonesian language.
`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
      temperature: 0.6,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate agent behavior');
  }
}

/**
 * Validate message content for safety
 * @param {string} content - Message content to validate
 * @returns {Promise<boolean>} - True if content is safe
 */
async function validateMessageContent(content) {
  if (!openai) {
    // Default to safe when OpenAI is not available
    return true;
  }

  try {
    const moderation = await openai.moderations.create({
      input: content,
    });

    return !moderation.results[0].flagged;
  } catch (error) {
    console.error('OpenAI Moderation Error:', error);
    // Default to safe if moderation fails
    return true;
  }
}

/**
 * Generate business insights from chat history
 * @param {Array} chatHistory - Array of chat messages
 * @returns {Promise<Object>} - Business insights
 */
async function generateBusinessInsights(chatHistory) {
  if (!openai) {
    // Return fallback insights when OpenAI is not available
    return {
      sentiment: 'neutral',
      commonTopics: ['Pertanyaan umum', 'Informasi produk'],
      suggestions: ['Tingkatkan respon time', 'Sediakan FAQ yang lebih lengkap'],
      satisfaction: 'belum tersedia'
    };
  }

  try {
    const prompt = `
Analyze this customer chat history and provide business insights in Indonesian:

${JSON.stringify(chatHistory, null, 2)}

Provide insights on:
1. Customer sentiment
2. Common inquiries
3. Potential improvements
4. Customer satisfaction indicators

Return as JSON with keys: sentiment, commonTopics, suggestions, satisfaction
`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
      temperature: 0.3,
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI Analysis Error:', error);
    throw new Error('Failed to generate business insights');
  }
}

/**
 * Check if OpenAI is available
 * @returns {boolean} - True if OpenAI is configured and available
 */
function isOpenAIAvailable() {
  return openai !== null;
}

module.exports = {
  generateChatResponse,
  generateAgentBehavior,
  validateMessageContent,
  generateBusinessInsights,
  getKnowledgeContext,
  isOpenAIAvailable,
  openai
}; 