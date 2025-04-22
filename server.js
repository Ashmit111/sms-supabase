const express = require('express');
require('dotenv').config();
const schoolsRouter = require('./routes/school.js');

const app = express();
app.use(express.json());

app.use('/api', schoolsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
