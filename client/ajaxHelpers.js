import { renderAllPlayers } from "./renderHelpers";

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2209-FTB-ET-WEB-PT';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;


export const fetchAllPlayers = async () => {
    try {
        const response = await fetch(`${APIURL}players`);
        const result = await response.json();
        if (result.error) {
            throw result.error;
        }
        console.log(result.data.players)
        return result.data.players;
      } catch (error) {
        console.error('Uh oh, trouble fetching players!', error);
      }
}

export const fetchSinglePlayer = async (playerId) => {
    try {
        const singleObj = await fetch(`${APIURL}players/${playerId}`);
        const singlePlayer = await singleObj.json();
        if (singleObj.error) {
            throw singlePlayer.error;
        }
        return singlePlayer.data.player;
      } catch (error) {
        console.error('Uh oh, trouble fetching players!', error);
      }
};

export const addNewPlayer = async (playerObj) => {
  try {
    const addplayerObj = await fetch(
      `${APIURL}players`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playerObj.name,
          breed: playerObj.breed,
        }),
      }
    );
    const resultObj = await addplayerObj.json();
    console.log(resultObj);
  } catch (err) {
    console.error(err);
  }
};

export const removePlayer = async (playerId) => {
  try {
   const response = await fetch(`${APIURL}players/${playerId}`, {
     method: 'DELETE',
   });
   const result = await response.json();
   if (result.error) throw result.error;
   console.log(result)
   return;
  } catch (err) {
   console.error(
     `Whoops, trouble removing player #${playerId} from the roster!`,
     err
   );
  }
  };
