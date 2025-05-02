class LegalChatbot {
    constructor() {
      this.isOpen = false;
      this.init();
    }
  
    init() {
      this.createUI();
      this.setupEventListeners();
      this.addWelcomeMessage();
    }
  
    createUI() {
      const chatbotHTML = `
        <div id="chatbot-container" class="chatbot-container">
          <div class="chatbot-header">
            <h3>Legal Assistant</h3>
            <button id="chatbot-close" class="chatbot-close">&times;</button>
          </div>
          <div id="chatbot-messages" class="chatbot-messages"></div>
          <div class="chatbot-input">
            <input type="text" id="chatbot-input" placeholder="Ask about IPC sections...">
            <button id="chatbot-send">Send</button>
          </div>
        </div>
        <button id="chatbot-toggle" class="chatbot-toggle">
          <i class="fas fa-balance-scale"></i>
        </button>
      `;
      document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }
  
    setupEventListeners() {
      document.getElementById('chatbot-toggle').addEventListener('click', () => this.toggleChatbot());
      document.getElementById('chatbot-close').addEventListener('click', () => this.closeChatbot());
      document.getElementById('chatbot-send').addEventListener('click', () => this.handleSend());
      document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleSend();
      });
    }
  
    toggleChatbot() {
      this.isOpen = !this.isOpen;
      document.getElementById('chatbot-container').style.display = 
        this.isOpen ? 'block' : 'none';
    }
  
    closeChatbot() {
      this.isOpen = false;
      document.getElementById('chatbot-container').style.display = 'none';
    }
  
    addWelcomeMessage() {
      const welcomeMsg = `
        Welcome to Legal Assistant! I'm trained on Indian Penal Code (IPC).<br><br>
        You can ask me about:<br>
        • Specific IPC sections (e.g., "IPC Section 302")<br>
        • Legal procedures (e.g., "How to file an FIR?")<br>
        • General legal concepts (e.g., "What is bail?")<br><br>
        How may I assist you today?
      `;
      this.addMessage(welcomeMsg, 'bot');
    }
  
    async handleSend() {
      const input = document.getElementById('chatbot-input');
      const message = input.value.trim();
      
      if (message) {
        this.addMessage(message, 'user');
        input.value = '';
        
        try {
          const response = await this.getBotResponse(message);
          this.addMessage(response, 'bot');
        } catch (error) {
          this.addMessage("Sorry, I'm having trouble connecting to the legal database.", 'bot');
        }
      }
    }
  
    async getBotResponse(message) {
      const response = await fetch('/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      
      const data = await response.json();
      return data.response;
    }
  
    addMessage(text, sender) {
      const messagesDiv = document.getElementById('chatbot-messages');
      const messageDiv = document.createElement('div');
      messageDiv.className = `chatbot-message ${sender}`;
      messageDiv.innerHTML = text;
      messagesDiv.appendChild(messageDiv);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  }
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => new LegalChatbot());