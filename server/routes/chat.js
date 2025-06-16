const express = require('express');
const router = express.Router();
const { generateChatResponse, validateMessageContent, generateBusinessInsights } = require('../services/openai');
const { db } = require('../services/supabase');

// Log all incoming requests to this router
router.use((req, res, next) => {
  console.log(`[CHAT ROUTE] ${req.method} ${req.originalUrl}`);
  next();
});

// POST /api/chat/sessions - Create new chat session
router.post('/sessions', async (req, res) => {
  console.log('Incoming body:', req.body); // Debug log

  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Invalid or missing request body' });
  }

  try {
    const { agentId, customerName, customerPhone, platform = 'web', userId = 'demo-user' } = req.body;
    
    if (!agentId) {
      return res.status(400).json({ error: 'Agent ID is required' });
    }
    
    // Verify agent exists
    const { data: agent, error: agentError } = await db.agents.getById(parseInt(agentId));
    if (agentError || !agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    const sessionData = {
      agent_id: parseInt(agentId),
      customer_name: customerName || 'Anonymous Customer',
      customer_phone: customerPhone || null,
      platform,
      user_id: userId
    };
    
    const { data: newSession, error } = await db.chatSessions.create(sessionData);
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to create chat session in database', message: error.message });
    }
    
    res.status(201).json({
      message: 'Chat session created successfully',
      session: Array.isArray(newSession) ? newSession[0] : newSession
    });
  } catch (error) {
    console.error('Error creating chat session:', error);
    res.status(500).json({ error: 'Failed to create chat session', message: error.message });
  }
});

// GET /api/chat/sessions - Get all chat sessions
router.get('/sessions', async (req, res) => {
  try {
    const { agentId, status, page = 1, limit = 10, userId = 'demo-user' } = req.query;
    
    const filters = { userId };
    if (agentId) filters.agentId = parseInt(agentId);
    if (status) filters.status = status;
    
    // Get sessions with agent info and last message
    const { data: sessions, error } = await db.chatSessions.getAllWithDetails(filters);
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch chat sessions', message: error.message });
    }
    
    // Sort sessions by last message timestamp or creation date
    const sortedSessions = sessions.sort((a, b) => {
      const aTime = a.last_message?.timestamp || a.created_at;
      const bTime = b.last_message?.timestamp || b.created_at;
      return new Date(bTime) - new Date(aTime);
    });
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedSessions = sortedSessions.slice(startIndex, endIndex);
    
    res.json({
      sessions: paginatedSessions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(sessions.length / limit),
        totalSessions: sessions.length,
        hasNext: endIndex < sessions.length,
        hasPrev: startIndex > 0
      }
    });
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    res.status(500).json({ error: 'Failed to fetch chat sessions', message: error.message });
  }
});

// GET /api/chat/sessions/:sessionId/messages - Get messages for a session
router.get('/sessions/:sessionId/messages', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    // Get total message count for pagination
    const { count: totalMessages, error: countError } = await db.chatMessages.getCount(parseInt(sessionId));
    
    if (countError) {
      console.error('Error getting message count:', countError);
      return res.status(500).json({ error: 'Failed to get message count', message: countError.message });
    }
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit;
    
    // Get messages with pagination
    const { data: messages, error } = await db.chatMessages.getBySession(
      parseInt(sessionId),
      limit,
      offset
    );
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch messages', message: error.message });
    }
    
    const totalPages = Math.ceil(totalMessages / limit);
    
    res.json({
      messages: messages || [],
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalMessages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages', message: error.message });
  }
});

// POST /api/chat/sessions/:sessionId/messages - Send message and get AI response
router.post('/sessions/:sessionId/messages', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { content, type = 'text', sender = 'customer' } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Message content is required' });
    }
    
    // Find session with agent info
    const { data: session, error: sessionError } = await db.chatSessions.getById(parseInt(sessionId));
    if (sessionError || !session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }
    
    // Validate message content
    const isContentSafe = await validateMessageContent(content);
    if (!isContentSafe) {
      return res.status(400).json({ error: 'Message content violates content policy' });
    }
    
    // Create user message
    const userMessageData = {
      session_id: parseInt(sessionId),
      content,
      type,
      sender
    };
    
    const { data: userMessage, error: userMsgError } = await db.chatMessages.create(userMessageData);
    
    if (userMsgError) {
      console.error('Error creating user message:', userMsgError);
      return res.status(500).json({ error: 'Failed to save user message', message: userMsgError.message });
    }
    
    // Generate AI response if sender is customer
    let aiResponse = null;
    if (sender === 'customer') {
      try {
        const agent = session.ai_agents;
        
        // Get recent conversation history for context
        const { data: recentMessages } = await db.chatMessages.getRecent(parseInt(sessionId), 10);
        
        const conversationHistory = (recentMessages || []).map(m => ({
          role: m.sender === 'customer' ? 'user' : 'assistant',
          content: m.content
        }));
        
        const aiResponseContent = await generateChatResponse(conversationHistory, {
          agentId: agent.id,
          behaviour: agent.behaviour,
          businessDescription: agent.business_description
        });
        
        // Create AI response message
        const aiMessageData = {
          session_id: parseInt(sessionId),
          content: aiResponseContent,
          type: 'text',
          sender: 'agent'
        };
        
        const { data: aiMsg, error: aiMsgError } = await db.chatMessages.create(aiMessageData);
        
        if (!aiMsgError) {
          aiResponse = aiMsg;
        }
        
      } catch (error) {
        console.error('Error generating AI response:', error);
        // Create fallback response
        const fallbackData = {
          session_id: parseInt(sessionId),
          content: 'Maaf, saya sedang mengalami kendala teknis. Mohon tunggu sebentar atau coba lagi.',
          type: 'text',
          sender: 'agent'
        };
        
        const { data: fallbackMsg } = await db.chatMessages.create(fallbackData);
        aiResponse = fallbackMsg;
      }
    }
    
    res.status(201).json({
      message: 'Message sent successfully',
      userMessage: Array.isArray(userMessage) ? userMessage[0] : userMessage,
      aiResponse: Array.isArray(aiResponse) ? aiResponse[0] : aiResponse
    });
    
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message', message: error.message });
  }
});

// POST /api/chat/sessions/:sessionId/close - Close chat session
router.post('/sessions/:sessionId/close', (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const sessionIndex = chatSessions.findIndex(s => s.id === parseInt(sessionId));
    if (sessionIndex === -1) {
      return res.status(404).json({ error: 'Chat session not found' });
    }
    
    chatSessions[sessionIndex].status = 'closed';
    chatSessions[sessionIndex].lastActivity = new Date();
    
    res.json({
      message: 'Chat session closed successfully',
      session: chatSessions[sessionIndex]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to close chat session', message: error.message });
  }
});

// GET /api/chat/sessions/:sessionId/insights - Get AI insights for a chat session
router.get('/sessions/:sessionId/insights', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = chatSessions.find(s => s.id === parseInt(sessionId));
    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }
    
    const sessionMessages = messages.filter(m => m.sessionId === parseInt(sessionId));
    
    if (sessionMessages.length === 0) {
      return res.json({
        message: 'No messages found for analysis',
        insights: null
      });
    }
    
    try {
      const insights = await generateBusinessInsights(sessionMessages);
      
      res.json({
        message: 'Insights generated successfully',
        session: {
          id: session.id,
          customerName: session.customerName,
          duration: new Date() - new Date(session.createdAt)
        },
        insights
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      res.json({
        message: 'Could not generate insights at this time',
        insights: {
          sentiment: 'neutral',
          commonTopics: ['general inquiry'],
          suggestions: ['Continue monitoring conversation'],
          satisfaction: 'unknown'
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate insights', message: error.message });
  }
});

// GET /api/chat/stats - Get overall chat statistics
router.get('/stats', (req, res) => {
  try {
    const { agentId, timeframe = '7d' } = req.query;
    
    let filteredSessions = chatSessions;
    let filteredMessages = messages;
    
    // Filter by agent
    if (agentId) {
      filteredSessions = filteredSessions.filter(s => s.agentId === parseInt(agentId));
      const sessionIds = filteredSessions.map(s => s.id);
      filteredMessages = filteredMessages.filter(m => sessionIds.includes(m.sessionId));
    }
    
    // Filter by timeframe
    const now = new Date();
    const timeframeDays = parseInt(timeframe.replace('d', ''));
    const cutoffDate = new Date(now.getTime() - (timeframeDays * 24 * 60 * 60 * 1000));
    
    filteredSessions = filteredSessions.filter(s => new Date(s.createdAt) >= cutoffDate);
    filteredMessages = filteredMessages.filter(m => new Date(m.timestamp) >= cutoffDate);
    
    const stats = {
      totalSessions: filteredSessions.length,
      activeSessions: filteredSessions.filter(s => s.status === 'active').length,
      closedSessions: filteredSessions.filter(s => s.status === 'closed').length,
      totalMessages: filteredMessages.length,
      customerMessages: filteredMessages.filter(m => m.sender === 'customer').length,
      agentMessages: filteredMessages.filter(m => m.sender === 'agent').length,
      averageSessionDuration: calculateAverageSessionDuration(filteredSessions),
      averageMessagesPerSession: filteredSessions.length > 0 ? 
        (filteredMessages.length / filteredSessions.length).toFixed(1) : 0,
      timeframe: `${timeframeDays} days`
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat stats', message: error.message });
  }
});

// Helper function to calculate average session duration
function calculateAverageSessionDuration(sessions) {
  if (sessions.length === 0) return '0 minutes';
  
  const totalDuration = sessions.reduce((total, session) => {
    const start = new Date(session.createdAt);
    const end = new Date(session.lastActivity);
    return total + (end - start);
  }, 0);
  
  const averageMs = totalDuration / sessions.length;
  const averageMinutes = Math.round(averageMs / (1000 * 60));
  
  return `${averageMinutes} minutes`;
}

// PATCH /api/chat/sessions/:sessionId - Update chat session
router.patch('/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status } = req.body;
    
    // Verify session exists
    const { data: session, error: sessionError } = await db.chatSessions.getById(parseInt(sessionId));
    if (sessionError || !session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }
    
    const updateData = {
      status: status || session.status,
      updated_at: new Date().toISOString()
    };
    
    const { data: updatedSession, error } = await db.chatSessions.update(
      parseInt(sessionId),
      updateData
    );
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to update chat session', message: error.message });
    }
    
    res.json({
      message: 'Chat session updated successfully',
      session: updatedSession
    });
  } catch (error) {
    console.error('Error updating chat session:', error);
    res.status(500).json({ error: 'Failed to update chat session', message: error.message });
  }
});

// DELETE /api/chat/sessions/:sessionId - Delete chat session and its messages
router.delete('/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const parsedSessionId = parseInt(sessionId);
    if (isNaN(parsedSessionId)) {
      return res.status(400).json({ error: 'Invalid session ID format' });
    }
    
    // Verify session exists
    const { data: session, error: sessionError } = await db.chatSessions.getById(parsedSessionId);
    if (sessionError) {
      console.error('Error fetching session:', sessionError);
      return res.status(500).json({ error: 'Failed to fetch chat session' });
    }
    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }
    
    // Delete all messages in the session first
    const { error: messagesError } = await db.chatMessages.deleteBySession(parsedSessionId);
    if (messagesError) {
      console.error('Error deleting messages:', messagesError);
      return res.status(500).json({ error: 'Failed to delete chat messages' });
    }
    
    // Delete the session
    const { error: deleteError } = await db.chatSessions.delete(parsedSessionId);
    if (deleteError) {
      console.error('Error deleting session:', deleteError);
      return res.status(500).json({ error: 'Failed to delete chat session' });
    }
    
    // Return 204 No Content for successful deletion
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting chat session:', error);
    res.status(500).json({ 
      error: 'Failed to delete chat session', 
      message: error.message 
    });
  }
});

module.exports = router; 