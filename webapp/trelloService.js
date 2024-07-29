// Importing the axios library to make HTTP requests
const axios = require('axios');

// Trello API credentials
const TRELLO_API_KEY = 'ENTER YOUR TRELLO API KEY HERE';
const TRELLO_TOKEN = 'ENTER YOUR TRELLO API TOKEN HERE';

// Creating an instance of axios with default settings for the Trello API
const trelloApi = axios.create({
    baseURL: 'https://api.trello.com/1/', // Base URL for Trello API
    params: {
        key: TRELLO_API_KEY, // API key as a query parameter
        token: TRELLO_TOKEN  // Token as a query parameter
    }
});

// Function to get all boards of the authenticated user
const getBoards = async () => {
    try {
        // Making a GET request to the Trello API to fetch boards
        const response = await trelloApi.get('/members/me/boards');
        return response.data; // Returning the data from the response
    } catch (error) {
        console.error('Error fetching boards:', error.response ? error.response.data : error.message);
        throw error; // Throwing the error to be handled by the caller
    }
};

// Exporting various functions as a module
module.exports = {
    getBoards,
    
    // Function to get all lists in a specific board
    getLists: async (boardId) => {
        try {
            // Making a GET request to the Trello API to fetch lists in a specific board
            const response = await trelloApi.get(`/boards/${boardId}/lists`);
            return response.data; // Returning the data from the response
        } catch (error) {
            console.error('Error fetching lists:', error.response ? error.response.data : error.message);
            throw error; // Throwing the error to be handled by the caller
        }
    },

    // Function to get all cards in a specific list
    getCards: async (listId) => {
        try {
            // Making a GET request to the Trello API to fetch cards in a specific list
            const response = await trelloApi.get(`/lists/${listId}/cards`);
            return response.data; // Returning the data from the response
        } catch (error) {
            console.error('Error fetching cards:', error.response ? error.response.data : error.message);
            throw error; // Throwing the error to be handled by the caller
        }
    },

    // Function to create a new board
    createBoard: async (name) => {
        try {
            // Making a POST request to the Trello API to create a new board
            const response = await trelloApi.post('/boards/', {
                name // Board name
            });
            return response.data; // Returning the data from the response
        } catch (error) {
            console.error('Error creating board:', error.response ? error.response.data : error.message);
            throw error; // Throwing the error to be handled by the caller
        }
    },

    // Function to delete a board
    deleteBoard: async (boardId) => {
        try {
            // Making a DELETE request to the Trello API to delete a board
            const response = await trelloApi.delete(`/boards/${boardId}`);
            return response.data; // Returning the data from the response
        } catch (error) {
            console.error('Error deleting board:', error.response ? error.response.data : error.message);
            throw error; // Throwing the error to be handled by the caller
        }
    },

    // Function to create a new list in a specific board
    createList: async (boardId, name) => {
        try {
            // Making a POST request to the Trello API to create a new list
            const response = await trelloApi.post('/lists', {
                name,       // List name
                idBoard: boardId // Board ID where the list will be created
            });
            return response.data; // Returning the data from the response
        } catch (error) {
            console.error('Error creating list:', error.response ? error.response.data : error.message);
            throw error; // Throwing the error to be handled by the caller
        }
    },

    // Function to delete a list
    deleteList: async (listId) => {
        try {
            // Making a PUT request to the Trello API to close a list (deletes it)
            const response = await trelloApi.put(`/lists/${listId}/closed`, {
                value: true // Setting the closed property to true
            });
            return response.data; // Returning the data from the response
        } catch (error) {
            console.error('Error deleting list:', error.response ? error.response.data : error.message);
            throw error; // Throwing the error to be handled by the caller
        }
    },

    // Function to create a new card in a specific list
    createCard: async (listId, name, desc) => {
        try {
            // Making a POST request to the Trello API to create a new card
            const response = await trelloApi.post('/cards', {
                idList: listId, // List ID where the card will be created
                name,           // Card name
                desc            // Card description
            });
            return response.data; // Returning the data from the response
        } catch (error) {
            console.error('Error creating card:', error);
            throw error; // Throwing the error to be handled by the caller
        }
    },

    // Function to move a card to a different list
    moveCard: async (cardId, listId) => {
        try {
            // Making a PUT request to the Trello API to move a card
            const response = await trelloApi.put(`/cards/${cardId}`, {
                idList: listId // New list ID where the card will be moved
            });
            return response.data; // Returning the data from the response
        } catch (error) {
            console.error('Error moving card:', error);
            throw error; // Throwing the error to be handled by the caller
        }
    },

    // Function to delete a card
    deleteCard: async (cardId) => {
        try {
            // Making a DELETE request to the Trello API to delete a card
            const response = await trelloApi.delete(`/cards/${cardId}`);
            return response.data; // Returning the data from the response
        } catch (error) {
            console.error('Error deleting card:', error);
            throw error; // Throwing the error to be handled by the caller
        }
    }
};
