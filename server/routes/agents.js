const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { generateAgentBehavior } = require('../services/openai');
const { db } = require('../services/supabase');
const documentProcessor = require('../services/pdfProcessor');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, and PNG files are allowed'));
    }
  }
});

// GET /api/agents - Get all agents
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 8, search = '', userId = 'demo-user' } = req.query;
    
    // Get all agents for the user from Supabase
    const { data: agents, error } = await db.agents.getAll(userId);
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch agents from database', message: error.message });
    }
    
    let filteredAgents = agents || [];
    
    // Search functionality
    if (search) {
      filteredAgents = filteredAgents.filter(agent => 
        agent.name.toLowerCase().includes(search.toLowerCase()) ||
        (agent.platform && agent.platform.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedAgents = filteredAgents.slice(startIndex, endIndex);
    
    res.json({
      agents: paginatedAgents,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredAgents.length / limit),
        totalAgents: filteredAgents.length,
        hasNext: endIndex < filteredAgents.length,
        hasPrev: startIndex > 0
      }
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents', message: error.message });
  }
});

// GET /api/agents/:id - Get specific agent
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: agent, error } = await db.agents.getById(parseInt(id));
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch agent from database', message: error.message });
    }
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    res.json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({ error: 'Failed to fetch agent', message: error.message });
  }
});

// POST /api/agents - Create new agent
router.post('/', async (req, res) => {
  try {
    const { name, behaviour, businessDescription, platform = 'Whatsapp', userId = 'demo-user' } = req.body;
    
    // Validation
    if (!name || !behaviour) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        required: ['name', 'behaviour'] 
      });
    }
    
    const agentData = {
      name,
      behaviour,
      business_description: businessDescription || '',
      platform,
      status: 'active',
      user_id: userId
    };
    
    const { data: newAgent, error } = await db.agents.create(agentData);
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to create agent in database', message: error.message });
    }
    
    res.status(201).json({
      message: 'Agent created successfully',
      agent: newAgent
    });
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({ error: 'Failed to create agent', message: error.message });
  }
});

// PUT /api/agents/:id - Update agent
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, behaviour, businessDescription, platform, status } = req.body;
    
    const updates = {};
    if (name) updates.name = name;
    if (behaviour) updates.behaviour = behaviour;
    if (businessDescription !== undefined) updates.business_description = businessDescription;
    if (platform) updates.platform = platform;
    if (status) updates.status = status;
    
    const { data: updatedAgent, error } = await db.agents.update(parseInt(id), updates);
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to update agent in database', message: error.message });
    }
    
    if (!updatedAgent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    res.json({
      message: 'Agent updated successfully',
      agent: updatedAgent
    });
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).json({ error: 'Failed to update agent', message: error.message });
  }
});

// DELETE /api/agents/:id - Delete agent
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await db.agents.delete(parseInt(id));
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to delete agent from database', message: error.message });
    }
    
    res.json({
      message: 'Agent deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ error: 'Failed to delete agent', message: error.message });
  }
});

// POST /api/agents/generate-behavior - Generate AI behavior based on business description
router.post('/generate-behavior', async (req, res) => {
  try {
    const { businessDescription } = req.body;
    
    if (!businessDescription) {
      return res.status(400).json({ 
        error: 'Business description is required' 
      });
    }
    
    const suggestedBehavior = await generateAgentBehavior(businessDescription);
    
    res.json({
      message: 'Behavior generated successfully',
      suggestedBehavior
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to generate behavior', 
      message: error.message 
    });
  }
});

// GET /api/agents/:id/stats - Get agent statistics
router.get('/:id/stats', (req, res) => {
  try {
    const { id } = req.params;
    const agent = agents.find(a => a.id === parseInt(id));
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    // Mock statistics (replace with real data from database)
    const stats = {
      totalMessages: Math.floor(Math.random() * 1000) + 100,
      totalCustomers: Math.floor(Math.random() * 100) + 20,
      averageResponseTime: (Math.random() * 5 + 1).toFixed(1) + 's',
      satisfactionRate: (Math.random() * 20 + 80).toFixed(1) + '%',
      activeToday: Math.floor(Math.random() * 50) + 5,
      weeklyGrowth: (Math.random() * 30 - 15).toFixed(1) + '%'
    };
    
    res.json({
      agent: agent.name,
      stats
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agent stats', message: error.message });
  }
});

// POST /api/agents/:id/knowledge/upload - Upload documents (PDF, JPG, PNG) to knowledge base
router.post('/:id/knowledge/upload', upload.single('document'), async (req, res) => {
  try {
    const agentId = parseInt(req.params.id);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check if agent exists
    const { data: agent, error: agentError } = await db.agents.getById(agentId);
    if (agentError || !agent) {
      // Clean up uploaded file
      await documentProcessor.deleteFile(req.file.path);
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Process document (PDF, JPG, PNG)
    const extractedContent = await documentProcessor.processDocument(req.file.path, req.file.mimetype);
    
    // Save to knowledge base
    const savedDocument = await documentProcessor.saveDocumentToKnowledgeBase(agentId, req.file, extractedContent);

    res.status(201).json({
      message: 'Document uploaded and processed successfully',
      document: {
        id: savedDocument.id,
        filename: savedDocument.original_filename,
        fileSize: savedDocument.file_size,
        pages: extractedContent.numPages,
        uploadedAt: savedDocument.created_at
      }
    });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    
    // Clean up uploaded file on error
    if (req.file) {
      await documentProcessor.deleteFile(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Failed to upload and process document', 
      message: error.message 
    });
  }
});

// GET /api/agents/:id/knowledge - Get all knowledge documents for an agent
router.get('/:id/knowledge', async (req, res) => {
  try {
    const agentId = parseInt(req.params.id);
    
    const documents = await documentProcessor.getDocumentsByAgent(agentId);
    
    // Return simplified document info (without full content)
    const documentList = documents.map(doc => ({
      id: doc.id,
      filename: doc.original_filename,
      fileSize: doc.file_size,
      fileType: doc.file_type,
      uploadedAt: doc.created_at,
      processedAt: doc.processed_at
    }));
    
    res.json({
      documents: documentList,
      count: documentList.length
    });
  } catch (error) {
    console.error('Error fetching knowledge documents:', error);
    res.status(500).json({ 
      error: 'Failed to fetch knowledge documents', 
      message: error.message 
    });
  }
});

// DELETE /api/agents/:id/knowledge/:docId - Delete a knowledge document
router.delete('/:id/knowledge/:docId', async (req, res) => {
  try {
    const agentId = parseInt(req.params.id);
    const documentId = parseInt(req.params.docId);
    
    // Verify the document belongs to the agent
    const { data: document, error } = await db.knowledgeDocuments.getById(documentId);
    
    if (error || !document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    if (document.agent_id !== agentId) {
      return res.status(403).json({ error: 'Document does not belong to this agent' });
    }
    
    await documentProcessor.deleteDocument(documentId);
    
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ 
      error: 'Failed to delete document', 
      message: error.message 
    });
  }
});

// GET /api/agents/:id/knowledge/search - Search knowledge base
router.get('/:id/knowledge/search', async (req, res) => {
  try {
    const agentId = parseInt(req.params.id);
    const { q: searchTerm } = req.query;
    
    if (!searchTerm) {
      return res.status(400).json({ error: 'Search term is required' });
    }
    
    const results = await documentProcessor.searchDocuments(agentId, searchTerm);
    
    res.json({
      searchTerm,
      results: results.map(doc => ({
        id: doc.id,
        filename: doc.original_filename,
        content: doc.content.substring(0, 500) + '...', // Return first 500 chars
        uploadedAt: doc.created_at
      })),
      count: results.length
    });
  } catch (error) {
    console.error('Error searching documents:', error);
    res.status(500).json({ 
      error: 'Failed to search documents', 
      message: error.message 
    });
  }
});

module.exports = router; 