// Get the player container and new player form container elements from the DOM
const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Define the cohort name and API URL
const cohortName = '2302-acc-pt-web-pt-d';
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

// Function to fetch all players
export const fetchAllPlayers = async () => {
  try {
    const response = await fetch(APIURL + 'players');
    const data = await response.json();
    const players = data.data.players; // Access the players array correctly
    console.log(players);
    return players;
  } catch (err) {
    console.error('Uh oh, trouble fetching players!', err);
    return [];
  }
};

// Function to fetch a single player by ID
const fetchSinglePlayer = async (playerId) => {
  if (!playerId || playerId.length === 0) {
    playerContainer.innerHTML = "<h3>No player found</h3>";
    return;
  }

  try {
    const response = await fetch(APIURL + 'players/' + playerId);
    const data = await response.json();
    const player = data.data.player; // Access the player object correctly
    console.log(player);

    // Generate the HTML for the single player view
    const playerIdHTML = `
      <div class="single-player-view">
        <div class="player">
          <h4>Name: ${player.name}</h4>
          <h4>Breed: ${player.breed}</h4>
          <h4>Status: ${player.status}</h4>
          <img src="${player.imageUrl}" alt="${player.name}"></img>
        </div>
        <button class="back-button">BACK</button>
      </div>`;

    // Update the player container with the single player view HTML
    playerContainer.innerHTML = playerIdHTML;

    // Add an event listener to the back button to re-fetch and re-render all players
    const backButton = playerContainer.querySelector(".back-button");
    backButton.addEventListener("click", async () => {
      const players = await fetchAllPlayers();
      renderAllPlayers(players);
    });
  } catch (err) {
    console.error('Uh oh, trouble fetching the player!', err);
  }
};

// Function to add a new player
const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(APIURL + 'players', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerObj),
    });
    const newPlayer = await response.json();
    return newPlayer;
  } catch (err) {
    console.error('Oops, something went wrong with adding that player!', err);
    return null;
  }
};

// Function to remove a player
const removePlayer = async (playerId) => {
  try {
    const response = await fetch(APIURL + 'players/' + playerId, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
    return false;
  }
};

// Function to render all players
export const renderAllPlayers = (playerList) => {
  try {
    if (!Array.isArray(playerList)) {
      console.error('Invalid player list:', playerList);
      return;
    }

    // Clear the player container
    playerContainer.innerHTML = "";

      // Iterate over the player list and create player cards for each player
    playerList.forEach((player) => {
      const playerElement = document.createElement("div");
      playerElement.classList.add("player-card");
      playerElement.innerHTML = `
        <h3>${player.name}</h3>
        <p>${player.breed}</p>
        <img src="${player.imageUrl}" alt="${player.name}">
        <button class="details-button" data-player-id="${player.id}">See Details</button>
        <button class="remove-button" data-player-id="${player.id}">Remove from Roster</button>
      `;
      playerContainer.appendChild(playerElement);
    });

    // Add event listeners to the details buttons to fetch and display a single player
    const detailsButtons = document.querySelectorAll('.details-button');
    detailsButtons.forEach((button) => {
      button.addEventListener('click', async (event) => {
        const playerId = event.target.dataset.playerId;
        const player = await fetchSinglePlayer(playerId);
        console.log(player); // Do something with the player details
      });
    });

    // Add event listeners to the remove buttons to remove a player from the roster
    const removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach((button) => {
      button.addEventListener('click', async (event) => {
        const playerId = event.target.dataset.playerId;
        const success = await removePlayer(playerId);
        if (success) {
          console.log(`Player #${playerId} removed from the roster.`);
          // Re-fetch and re-render all players
          const players = await fetchAllPlayers();
          renderAllPlayers(players);
        }
      });
    });
  } catch (err) {
    console.error('Uh oh, trouble rendering players!', err);
  }
};

// Function to render the new player form
export const renderNewPlayerForm = () => {
  try {
    // Generate the HTML for the new player form
    const formHTML = `
      <form id="new-player-form">
        <h2>Join us in our game!</h2>
        <h3>Add New Player </h3>
        <label for="name">Name:</label>
        <input type="text" id="name" required>
        <label for="breed">Breed:</label>
        <input type="text" id="breed" required>
        <button type="submit">Add Player</button>
      </form>
    `;

    // Update the new player form container with the form HTML
    newPlayerFormContainer.innerHTML = formHTML;

    // Add event listener to the form submit button to add a new player
    const form = document.getElementById('new-player-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const nameInput = document.getElementById('name');
      const breedInput = document.getElementById('breed');

      const playerObj = {
        name: nameInput.value,
        breed : breedInput.value,
      };

      const newPlayer = await addNewPlayer(playerObj);
      if (newPlayer) {
        console.log('New player added:', newPlayer);
        nameInput.value = '';
        breedInput.value = '';

        // Re-fetch and re-render all players
        const players = await fetchAllPlayers();
        renderAllPlayers(players);
      }
    });
  } catch (err) {
    console.error('Uh oh, trouble rendering the new player form!', err);
  }
};




