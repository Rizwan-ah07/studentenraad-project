import dotenv from "dotenv";
import express from "express";


dotenv.config();
const app = express();
// Set the view engine for the app
app.set('view engine', 'ejs');
// Set the port for the app
app.set('port', process.env.PORT || 3000);
// Parse JSON bodies for this app
app.use(express.json({ limit: '1mb' }));
// Parse URL-encoded bodies for this app
app.use(express.urlencoded({ extended: true }));
// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define the routes for the app
app.get('/', (req, res) => {
  res.render('index');
});

// Start the server
app.listen(app.get('port'), () => {
  console.log(`Server started on http://localhost:${app.get('port')}`);
});