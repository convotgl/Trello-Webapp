<template>
  <div id="app">
    <!-- Header with a clickable title to refresh the page -->
    <header class="header">
      <div class="header-content">
        <h1 class="title" @click="refreshPage">Trello WebApp</h1>
      </div>
    </header>
    <div class="container">
      <!-- Sidebar displaying a list of available commands -->
      <div class="sidebar">
        <h2>Commands</h2>
        <ul>
          <li>get boards</li>
          <li>get lists &lt;board_id&gt;</li>
          <li>get cards &lt;list_id&gt;</li>
          <li>create board &lt;board_name&gt;</li>
          <li>delete board &lt;board_id&gt;</li>
          <li>create list &lt;board_id&gt; &lt;list_name&gt;</li>
          <li>delete list &lt;list_id&gt;</li>
          <li>create card &lt;list_id&gt; &lt;card_name&gt; &lt;card_desc&gt;</li>
          <li>move card &lt;card_id&gt; &lt;list_id&gt;</li>
          <li>delete card &lt;card_id&gt;</li>
        </ul>
      </div>
      <!-- Terminal container for command input and output display -->
      <div class="terminal-container">
        <h3 class="terminal-title">Command Input</h3>
        <!-- Textarea for command input -->
        <textarea v-model="command" placeholder="Enter command"></textarea>
        <!-- Button to execute the command -->
        <button @click="executeCommand">Execute</button>
        <div class="output">
          <!-- Output display area -->
          <pre>{{ output }}</pre>
          <!-- Display boards if available -->
          <div v-if="boards" class="boards">
            <h2>Boards</h2>
            <ul>
              <li v-for="board in boards" :key="board.id">
                <strong>{{ board.name }}</strong>
                <p>ID: {{ board.id }}</p>
                <p>Description: {{ board.desc }}</p>
              </li>
            </ul>
          </div>
          <!-- Display lists if available -->
          <div v-if="lists" class="lists">
            <h2>Lists</h2>
            <ul>
              <li v-for="list in lists" :key="list.id">
                <strong>{{ list.name }}</strong>
                <p>ID: {{ list.id }}</p>
              </li>
            </ul>
          </div>
          <div v-if="cards" class="cards">
            <h2>Cards</h2>
            <ul>
              <li v-for="card in cards" :key="card.id">
                <strong>{{ card.name }}</strong>
                <p>ID: {{ card.id }}</p>
                <p>Description: {{ card.desc }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      command: '', // Command entered by the user
      output: '', // Output of the executed command
      boards: null, // List of boards fetched from the server
      lists: null, // List of lists fetched from the server
      cards: null // List of cards fetched from the server
    };
  },
  methods: {
    // Refresh the page
    refreshPage() {
      window.location.reload();
    },
    // Execute the command entered by the user
    async executeCommand() {
      try {
        // Split the command into action and arguments
        const [action, ...args] = this.command.split(' ');
        switch (action) {
          case 'get':
            if (args[0] === 'boards') {
              // Fetch boards if the command is 'get boards'
              await this.fetchBoards();
            } else if (args[0] === 'lists') {
              // Fetch lists if the command is 'get lists <board_id>'
              await this.fetchLists(args[1]);
            } else if (args[0] === 'cards') { 
              // Fetch cards if the command is 'get cards <list_id>'
              await this.fetchCards(args[1]);
            }
            break;
          case 'create':
            if (args[0] === 'board') {
              // Create a board if the command is 'create board <board_name>'
              await this.createBoard(args.slice(1).join(' '));
            } else if (args[0] === 'list') {
              // Create a list if the command is 'create list <board_id> <list_name>'
              await this.createList(args[1], args.slice(2).join(' '));
            } else if (args[0] === 'card') {
              // Create a card if the command is 'create card <list_id> <card_name> <card_desc>'
              await this.createCard(args[1], args[2], args.slice(3).join(' '));
            }
            break;
          case 'delete':
            if (args[0] === 'board') {
              // Delete a board if the command is 'delete board <board_id>'
              await this.deleteBoard(args[1]);
            } else if (args[0] === 'list') {
              // Delete a list if the command is 'delete list <list_id>'
              await this.deleteList(args[1]);
            } else if (args[0] === 'card') {
              // Delete a card if the command is 'delete card <card_id>'
              await this.deleteCard(args[1]);
            }
            break;
          case 'move':
            if (args[0] === 'card') {
              // Move a card if the command is 'move card <card_id> <list_id>'
              await this.moveCard(args[1], args[2]);
            }
            break;
          default:
            // Set output to 'Unknown command' if the command is not recognized
            this.output = 'Unknown command';
        }
      } catch (error) {
        // Set output to error message if an error occurs
        this.output = error.response ? error.response.data : error.message;
      }
    },
    // Fetch boards from the server
    async fetchBoards() {
      try {
        const response = await axios.get('/boards');
        this.boards = response.data;
      } catch (error) {
        this.output = 'Error fetching boards: ' + (error.response ? error.response.data : error.message);
      }
    },
    // Fetch lists from the server for a specific board
    async fetchLists(boardId) {
      try {
        const response = await axios.get(`/lists/${boardId}`);
        this.lists = response.data;
      } catch (error) {
        this.output = 'Error fetching lists: ' + (error.response ? error.response.data : error.message);
      }
    },
    // Fetch cards from the server for a specified list
    async fetchCards(listId) { 
      try {
        const response = await axios.get(`/cards/${listId}`);
        this.cards = response.data;
      } catch (error) {
        this.cards = 'Error fetching cards: ' + (error.response ? error.response.data : error.message);
      }
    },
    // Create a new board
    async createBoard(name) {
      try {
        const response = await axios.post('/boards', { name });
        this.output = response.data;
      } catch (error) {
        this.output = 'Error creating board: ' + (error.response ? error.response.data : error.message);
      }
    },
    // Delete a board
    async deleteBoard(boardId) {
      try {
        const response = await axios.delete(`/boards/${boardId}`);
        this.output = response.data;
      } catch (error) {
        this.output = 'Error deleting board: ' + (error.response ? error.response.data : error.message);
      }
    },
    // Create a new list in a specific board
    async createList(boardId, name) {
      try {
        const response = await axios.post('/lists', { boardId, name });
        this.output = response.data;
      } catch (error) {
        this.output = 'Error creating list: ' + (error.response ? error.response.data : error.message);
      }
    },
    // Delete a list
    async deleteList(listId) {
      try {
        const response = await axios.delete(`/lists/${listId}`);
        this.output = response.data;
      } catch (error) {
        this.output = 'Error deleting list: ' + (error.response ? error.response.data : error.message);
      }
    },
    // Create a new card in a specific list
    async createCard(listId, name, desc) {
      try {
        const response = await axios.post('/cards', { listId, name, desc });
        this.output = response.data;
      } catch (error) {
        this.output = 'Error creating card: ' + (error.response ? error.response.data : error.message);
      }
    },
    // Move a card to a different list
    async moveCard(cardId, listId) {
      try {
        const response = await axios.put(`/cards/${cardId}/idList`, { value: listId });
        this.output = response.data;
      } catch (error) {
        this.output = 'Error moving card: ' + (error.response ? error.response.data : error.message);
      }
    },
    // Delete a card
    async deleteCard(cardId) {
      try {
        const response = await axios.delete(`/cards/${cardId}`);
        this.output = response.data;
      } catch (error) {
        this.output = 'Error deleting card: ' + (error.response ? error.response.data : error.message);
      }
    }
  }
};
</script>

<style>
body {
  background-color: #2e2e2e; /* Background color for the entire page */
  color: #dcdcdc; /* Default text color */
  font-family: 'Courier New', Courier, monospace; /* Font style */
  margin: 0; /* Remove default margin */
  padding: 0; /* Remove default padding */
}

#app {
  padding: 0; /* Remove default padding */
}

.header {
  background-color: #1c1c1c; /* Background color for the header */
  padding: 10px 20px; /* Padding inside the header */
}

.header .header-content {
  display: inline-block; /* Inline block for header content */
}

.header h1 {
  color: #ffffff; /* Text color for the header title */
  margin: 0; /* Remove default margin */
  cursor: pointer; /* Pointer cursor for clickable title */
}

.container {
  display: flex; /* Flexbox layout for the container */
  justify-content: center; /* Center the content horizontally */
}

.sidebar {
  width: 20%; /* Width of the sidebar */
  background-color: #1c1c1c; /* Background color for the sidebar */
  padding: 20px; /* Padding inside the sidebar */
  color: #dcdcdc; /* Text color for the sidebar */
  text-align: left; /* Left-aligned text */
  position: absolute; /* Positioned absolutely */
  left: 0; /* Aligned to the left */
  top: 70px; /* Adjusted to leave space for header */
}

.sidebar h2 {
  border-bottom: 1px solid #444444; /* Bottom border for the sidebar heading */
  padding-bottom: 10px; /* Padding below the heading */
}

.sidebar ul {
  list-style: none; /* Remove default list style */
  padding: 0; /* Remove default padding */
}

.sidebar li {
  margin: 10px 0; /* Margin between list items */
}

.terminal-container {
  width: 60%; /* Width of the terminal container */
  display: flex; /* Flexbox layout for the terminal container */
  flex-direction: column; /* Column layout */
  align-items: center; /* Center align items */
  padding: 20px; /* Padding inside the container */
  margin-left: 20%; /* Adjusted to account for sidebar width */
}

.terminal-title {
  color: #ffffff; /* Text color for the terminal title */
  text-align: left; /* Left-aligned text */
  margin-bottom: 10px; /* Space below the title */
}

textarea {
  width: 60%; /* Adjusted width to be slightly shorter */
  height: 40px; /* Fixed height */
  background-color: #000000; /* Background color for textarea */
  color: #dcdcdc; /* Text color for textarea */
  border: 1px solid #444444; /* Border for textarea */
  margin-bottom: 10px; /* Margin below textarea */
  padding: 10px; /* Padding inside textarea */
  box-sizing: border-box; /* Include padding and border in width and height */
  resize: none; /* Disable resizing */
}

button {
  background-color: #444444; /* Background color for button */
  color: #dcdcdc; /* Text color for button */
  border: none; /* Remove border */
  padding: 10px 20px; /* Padding inside button */
  cursor: pointer; /* Pointer cursor for button */
  margin-bottom: 10px; /* Margin below button */
}

.output {
  text-align: left; /* Left-aligned text */
  width: 100%; /* Full width */
  margin-top: 20px; /* Margin above output */
}

.output pre {
  background-color: #333333; /* Background color for preformatted text */
  padding: 10px; /* Padding inside preformatted text */
  border-radius: 5px; /* Rounded corners */
  white-space: pre-wrap; /* Wrap text in preformatted text */
}

.output h2 {
  color: #ffffff; /* Text color for headings in output */
  margin-top: 20px; /* Margin above headings in output */
}

.output ul {
  list-style-type: none; /* Remove default list style */
  padding: 0; /* Remove default padding */
}

.output li {
  margin-bottom: 10px; /* Margin between list items */
}

@media (max-width: 768px) {
  .container {
    flex-direction: column; /* Column layout on small screens */
    align-items: center; /* Center align items */
  }

  .sidebar {
    width: 100%; /* Full width for sidebar on small screens */
    position: static; /* Revert position for mobile */
    margin-bottom: 20px; /* Space between sidebar and terminal for mobile */
  }

  .terminal-container {
    width: 100%; /* Full width for terminal container on small screens */
    margin-left: 0; /* Remove margin for mobile */
  }
}
</style>
