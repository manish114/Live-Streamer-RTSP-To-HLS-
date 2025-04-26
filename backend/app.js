const express = require('express');
const app = express();
const streamRoutes = require('./routes/streamRoutes');
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(bodyParser.json());
app.use('/api', streamRoutes);
app.use('/streams', express.static(__dirname + '/streams'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});