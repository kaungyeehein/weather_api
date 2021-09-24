const mongoose = require('mongoose');
const morgan = require('morgan');
const app = require('./src/app');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Mongodb: connected');
}).catch(err => {
    console.log('Mongodb: ' + err.message);
});

// HTTP request logger
app.use(morgan('common'));

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is listening at port ' + PORT);
});