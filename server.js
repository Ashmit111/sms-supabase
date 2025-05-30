const express = require('express');
const app = express();
const cors = require('cors');
const schoolRoutes = require('./routes/school.js'); 

app.use(cors());
app.use(express.json());
app.use('/api', schoolRoutes);

module.exports = app;

app.get('/', (req, res) => {
  res.send('Server is running!');
});


if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
