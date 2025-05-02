const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Data directory setup
const dataDir = path.join(__dirname, 'data');
const chatbotDataDir = path.join(__dirname, 'chatbot-data');

[dataDir, chatbotDataDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

// Initialize JSON files
const initJSONFile = (filePath, initialData = []) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
  }
};

const victimsPath = path.join(dataDir, 'victims.json');
const lawyersPath = path.join(dataDir, 'lawyers.json');
const ipcKnowledgePath = path.join(chatbotDataDir, 'ipc-knowledge-base.json');

initJSONFile(victimsPath);
initJSONFile(lawyersPath);
initJSONFile(ipcKnowledgePath, [
  {
    "section": "302",
    "description": "IPC Section 302: Punishment for murder - Death or life imprisonment and fine."
  },
  {
    "section": "376",
    "description": "IPC Section 376: Punishment for rape - Minimum 10 years rigorous imprisonment."
  },
  // Add more IPC sections as needed
]);

// Data handling functions
const readData = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
};

const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error(`Error writing to ${filePath}:`, err);
    return false;
  }
};

const checkDuplicates = (filePath, fields, newData) => {
  const data = readData(filePath);
  return data.some(item => 
    fields.some(field => 
      item[field] && newData[field] && 
      item[field].toString().toLowerCase() === newData[field].toString().toLowerCase()
    )
  );
};

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/victim', (req, res) => res.sendFile(path.join(__dirname, 'views', 'victim.html')));
app.get('/lawyer', (req, res) => res.sendFile(path.join(__dirname, 'views', 'lawyer.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'views', 'about.html')));
app.get('/lawyer-listing', (req, res) => res.sendFile(path.join(__dirname, 'views', 'lawyer-listing.html')));
app.get('/case-display', (req, res) => res.sendFile(path.join(__dirname, 'views', 'case-display.html')));

// Form submissions
app.post('/submit-victim', (req, res) => {
  const newData = { ...req.body, timestamp: new Date().toISOString() };
  
  if (checkDuplicates(victimsPath, ['Phone', 'Aadhaar'], newData)) {
    return res.send(`
      <script>
        alert('A victim with the same Phone or Aadhaar already exists!');
        window.history.back();
      </script>
    `);
  }
  
  const data = readData(victimsPath);
  data.push(newData);
  
  if (writeData(victimsPath, data)) {
    res.redirect('/lawyer-listing');
  } else {
    res.status(500).send('Error saving victim data');
  }
});

app.post('/submit-lawyer', (req, res) => {
  const newData = { ...req.body, timestamp: new Date().toISOString() };
  
  if (checkDuplicates(lawyersPath, ['Phone', 'LawyerID'], newData)) {
    return res.send(`
      <script>
        alert('A lawyer with the same Phone or Lawyer ID already exists!');
        window.history.back();
      </script>
    `);
  }
  
  const data = readData(lawyersPath);
  data.push(newData);
  
  if (writeData(lawyersPath, data)) {
    res.redirect('/case-display');
  } else {
    res.status(500).send('Error saving lawyer data');
  }
});

// Chatbot endpoint
app.post('/chatbot', (req, res) => {
  const { message } = req.body;
  const ipcData = readData(ipcKnowledgePath);
  
  // Simple matching - replace with NLP in production
  const lowerMsg = message.toLowerCase();
  
  // Check for IPC sections
  const sectionMatch = lowerMsg.match(/ipc section (\d+[a-z]?)/i);
  if (sectionMatch) {
    const section = sectionMatch[1];
    const ipcInfo = ipcData.find(item => item.section === section);
    if (ipcInfo) return res.json({ response: ipcInfo.description });
  }
  
  // General legal questions
  const responses = {
    'bail': 'Bail provisions are under CrPC. Depends on offense severity and flight risk.',
    'fir': 'FIR (First Information Report) is filed under Section 154 CrPC at the nearest police station.',
    'dowry': 'Dowry is prohibited under Dowry Prohibition Act, 1961. IPC Section 304B deals with dowry death.',
    'default': "I'm a legal assistant trained on IPC. Ask me about specific sections (e.g., 'IPC Section 302') or general legal concepts."
  };
  
  const response = Object.entries(responses).find(([term]) => lowerMsg.includes(term))?.[1] || responses.default;
  res.json({ response });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Data directory: ${dataDir}`);
});