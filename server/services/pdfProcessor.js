const pdf = require('pdf-parse');
const fs = require('fs').promises;
const path = require('path');
const { db } = require('./supabase');

class DocumentProcessor {
  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || 'uploads';
    this.ensureUploadDirectory();
  }

  async ensureUploadDirectory() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      console.error('Error creating upload directory:', error);
    }
  }

  async processDocument(filePath, mimeType) {
    try {
      if (mimeType === 'application/pdf') {
        const dataBuffer = await fs.readFile(filePath);
        const data = await pdf(dataBuffer);
        
        return {
          text: data.text,
          numPages: data.numpages,
          info: data.info,
          metadata: data.metadata
        };
      } else if (mimeType.startsWith('image/')) {
        // For images, we'll use a placeholder text that describes the image
        // In a production environment, you'd want to use OCR or image recognition
        return {
          text: `Image file uploaded: ${path.basename(filePath)}. This is a visual content that can be referenced by the AI agent when discussing products or services.`,
          numPages: 1,
          info: { type: 'image' },
          metadata: { contentType: mimeType }
        };
      } else {
        throw new Error('Unsupported file type');
      }
    } catch (error) {
      console.error('Error processing document:', error);
      throw new Error('Failed to process document file');
    }
  }

  async saveDocumentToKnowledgeBase(agentId, file, extractedContent) {
    try {
      const documentData = {
        agent_id: agentId,
        filename: file.filename,
        original_filename: file.originalname,
        content: extractedContent.text,
        file_type: file.mimetype,
        file_size: file.size,
        upload_path: file.path
      };

      const { data: savedDocument, error } = await db.knowledgeDocuments.create(documentData);
      
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return savedDocument;
    } catch (error) {
      console.error('Error saving document to knowledge base:', error);
      throw error;
    }
  }

  async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  async getDocumentsByAgent(agentId) {
    try {
      const { data: documents, error } = await db.knowledgeDocuments.getByAgent(agentId);
      
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return documents || [];
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  }

  async deleteDocument(documentId) {
    try {
      // Get document info first to delete the file
      const { data: document, error: fetchError } = await db.knowledgeDocuments.getById(documentId);
      
      if (fetchError) {
        throw new Error(`Database error: ${fetchError.message}`);
      }

      // Delete the physical file
      if (document?.upload_path) {
        await this.deleteFile(document.upload_path);
      }

      // Delete from database
      const { error: deleteError } = await db.knowledgeDocuments.delete(documentId);
      
      if (deleteError) {
        throw new Error(`Database error: ${deleteError.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  async searchDocuments(agentId, searchTerm) {
    try {
      const { data: documents, error } = await db.knowledgeDocuments.searchContent(agentId, searchTerm);
      
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return documents || [];
    } catch (error) {
      console.error('Error searching documents:', error);
      throw error;
    }
  }
}

module.exports = new DocumentProcessor(); 