const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes.js');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

// Connect to MongoDB
mongoose.connect("mongodb+srv://vemishetti1:iv43n1BGHbbFEOhL@blog.slantt3.mongodb.net/?retryWrites=true&w=majority&appName=Blog")
.then(() => {
    console.log("Connected to database");
    app.listen(8000, () => {
        console.log('Server is running on port 8000');
    });
})
.catch((error) => {
    console.log("Connection failed:", error);
});
