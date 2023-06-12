// Import necessary functions from './script.js'
import { fetchAllPlayers, renderAllPlayers, renderNewPlayerForm } from './script.js';

// Define an async function called init
const init = async () => {
  //  fetch all players using fetchAllPlayers function
  const players = await fetchAllPlayers();
  
  // Render all players by calling renderAllPlayers and passing the fetched players as an argument
  renderAllPlayers(players);

  // Render the new player form by calling renderNewPlayerForm
  renderNewPlayerForm();
};

// Call the init function to start the initialization process
init();
