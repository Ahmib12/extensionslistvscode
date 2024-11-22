const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.get('/api/extensions', (req, res) => {
  exec('code --list-extensions', (error, stdout, stderr) => {
      if (error) {
          console.error(`exec error: ${error}`);
          return res.status(500).send('Failed to fetch extensions');
      }
      if (stderr) {
          console.error(`stderr: ${stderr}`);
          return res.status(500).send('Error fetching extensions');
      }

      // Split by newline and sort alphabetically
      const extensions = stdout.split('\n')
                               .filter((ext) => ext.trim() !== '')  // Clean up empty values
                               .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())); // Sort A-Z

      res.json(extensions);
  });
});

// Serve the React build folder (in production)
app.use(express.static(path.join(__dirname, '../client/build')));

// Handle all other routes by serving the React app (for production)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
