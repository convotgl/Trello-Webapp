// Importing required modules
const express = require('express'); // Express framework for building web applications
const bodyParser = require('body-parser'); // Middleware for parsing JSON request bodies
const trelloService = require('./trelloService'); // Custom module for Trello API interactions
const app = express(); // Creating an Express application
const port = 3000; // Defining the port number

// Middleware to parse JSON bodies in requests
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Endpoint to execute shell commands
app.post('/execute', async (req, res) => {
    const command = req.body.command; // Extracting the command from the request body
    const exec = require('child_process').exec; // Node.js module to execute shell commands

    // Executing the shell command
    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(stderr); // Sending error response if command execution fails
        }
        res.send(stdout); // Sending the output of the command execution
    });
});

// Endpoint to fetch Trello boards
app.get('/boards', async (req, res) => {
    console.log('Received request for /boards');
    try {
        const boards = await trelloService.getBoards(); // Fetching boards using Trello service
        res.json(boards); // Sending the boards as JSON response
    } catch (error) {
        console.error('Error retrieving boards:', error);
        res.status(500).send(`Error retrieving boards: ${error.response ? error.response.data : error.message}`); // Sending error response
    }
});

// Endpoint to fetch lists for a specific board
app.get('/lists/:boardId', async (req, res) => {
    const boardId = req.params.boardId; // Extracting board ID from URL parameters
    try {
        const lists = await trelloService.getLists(boardId); // Fetching lists using Trello service
        res.json(lists); // Sending the lists as JSON response
    } catch (error) {
        console.error('Error retrieving lists:', error);
        res.status(500).send(`Error retrieving lists: ${error.response ? error.response.data : error.message}`); // Sending error response
    }
});

// Endpoint to get cards for a specific list
app.get('/cards/:listId', async (req, res) => {
    const listId = req.params.listId;
    try {
      const cards = await trelloService.getCards(listId);
      res.json(cards);
    } catch (error) {
      console.error('Error retrieving cards:', error);
      res.status(500).send(`Error fetching cards: ${error.response ? error.response.data : error.message}`);
    }
  });

// Endpoint to create a new Trello board
app.post('/boards', async (req, res) => {
    try {
        const board = await trelloService.createBoard(req.body.name); // Creating a board using Trello service
        res.json(board); // Sending the created board as JSON response
    } catch (error) {
        console.error('Error creating board:', error);
        res.status(500).send(`Error creating board: ${error.response ? error.response.data : error.message}`); // Sending error response
    }
});

// Endpoint to delete a Trello board
app.delete('/boards/:boardId', async (req, res) => {
    try {
        const response = await trelloService.deleteBoard(req.params.boardId); // Deleting a board using Trello service
        res.json(response); // Sending the response as JSON
    } catch (error) {
        console.error('Error deleting board:', error);
        res.status(500).send(`Error deleting board: ${error.response ? error.response.data : error.message}`); // Sending error response
    }
});

// Endpoint to create a new Trello list
app.post('/lists', async (req, res) => {
    try {
        const list = await trelloService.createList(req.body.boardId, req.body.name); // Creating a list using Trello service
        res.json(list); // Sending the created list as JSON response
    } catch (error) {
        console.error('Error creating list:', error);
        res.status(500).send(`Error creating list: ${error.response ? error.response.data : error.message}`); // Sending error response
    }
});

// Endpoint to delete a Trello list
app.delete('/lists/:listId', async (req, res) => {
    try {
        const response = await trelloService.deleteList(req.params.listId); // Deleting a list using Trello service
        res.json(response); // Sending the response as JSON
    } catch (error) {
        console.error('Error deleting list:', error);
        res.status(500).send(`Error deleting list: ${error.response ? error.response.data : error.message}`); // Sending error response
    }
});

// Endpoint to create a new Trello card
app.post('/cards', async (req, res) => {
    const { listId, name, desc } = req.body; // Extracting card details from request body
    try {
        const card = await trelloService.createCard(listId, name, desc); // Creating a card using Trello service
        res.json(card); // Sending the created card as JSON response
    } catch (error) {
        console.error('Error creating card:', error);
        res.status(500).send('Error creating card'); // Sending error response
    }
});

// Endpoint to move a Trello card to a different list
app.put('/cards/:cardId/move', async (req, res) => {
    const { listId } = req.body; // Extracting new list ID from request body
    try {
        const card = await trelloService.moveCard(req.params.cardId, listId); // Moving the card using Trello service
        res.json(card); // Sending the moved card as JSON response
    } catch (error) {
        console.error('Error moving card:', error);
        res.status(500).send('Error moving card'); // Sending error response
    }
});

// Endpoint to delete a Trello card
app.delete('/cards/:cardId', async (req, res) => {
    try {
        const response = await trelloService.deleteCard(req.params.cardId); // Deleting a card using Trello service
        res.json(response); // Sending the response as JSON
    } catch (error) {
        console.error('Error deleting card:', error);
        res.status(500).send('Error deleting card'); // Sending error response
    }
});

// Start the server and listen on the defined port
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`); // Logging the server start
});