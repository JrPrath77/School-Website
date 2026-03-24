document.addEventListener('DOMContentLoaded', () => {
  const chatToggle = document.querySelector('.chat-toggle');
  const chatContainer = document.getElementById('chat-container');
  const chatClose = document.querySelector('.chat-close');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input-field');
  const chatSend = document.getElementById('chat-send');

  if (!chatToggle || !chatContainer || !chatClose || !chatMessages || !chatInput || !chatSend) {
    console.error('❗ Chat elements not found — please check your HTML structure and IDs/classes.');
    return;
  }

  chatToggle.addEventListener('click', () => {
    chatContainer.classList.add('active');
  });

  chatClose.addEventListener('click', () => {
    chatContainer.classList.remove('active');
  });

  chatInput.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  });

  chatSend.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage(sanitize(message), 'user');
    chatInput.value = '';
    chatInput.style.height = 'auto';

    const typingMessage = addMessage('कृपया थांबा...', 'bot');

    try {
      const response = await fetch(`${window.SITE_CONFIG.API_BASE}/api/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message }),
      });

      const data = await response.json();
      typingMessage.remove();
      addMessage(sanitize(data.reply), 'bot');
    } catch (error) {
      console.error('Error:', error);
      typingMessage.remove();
      addMessage('माफ करा, काहीतरी चुकले. कृपया पुन्हा प्रयत्न करा.', 'bot');
    }
  }

  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', sender);

    const content = document.createElement('div');
    content.classList.add('message-content');
    content.textContent = text;

    messageDiv.appendChild(content);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return messageDiv;
  }

  function sanitize(text) {
    const temp = document.createElement('div');
    temp.textContent = text;
    return temp.innerHTML;
  }
});
