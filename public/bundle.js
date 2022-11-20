/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./client/ajaxHelpers.js":
/*!*******************************!*\
  !*** ./client/ajaxHelpers.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchAllPlayers": () => (/* binding */ fetchAllPlayers),
/* harmony export */   "fetchSinglePlayer": () => (/* binding */ fetchSinglePlayer),
/* harmony export */   "addNewPlayer": () => (/* binding */ addNewPlayer),
/* harmony export */   "removePlayer": () => (/* binding */ removePlayer)
/* harmony export */ });
/* harmony import */ var _renderHelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./renderHelpers */ "./client/renderHelpers.js");


// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2209-FTB-ET-WEB-PT';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;


const fetchAllPlayers = async () => {
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

const fetchSinglePlayer = async (playerId) => {
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

const addNewPlayer = async (playerObj) => {
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

const removePlayer = async (playerId) => {
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


/***/ }),

/***/ "./client/renderHelpers.js":
/*!*********************************!*\
  !*** ./client/renderHelpers.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "renderAllPlayers": () => (/* binding */ renderAllPlayers),
/* harmony export */   "renderSinglePlayer": () => (/* binding */ renderSinglePlayer),
/* harmony export */   "renderNewPlayerForm": () => (/* binding */ renderNewPlayerForm)
/* harmony export */ });
/* harmony import */ var _ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ajaxHelpers */ "./client/ajaxHelpers.js");


const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

const renderAllPlayers = (playerList) => {
  // First check if we have any data before trying to render it!
  if (!playerList || !playerList.length) {
    playerContainer.innerHTML = '<h3>No players to display!</h3>';
    return;
  }

  // Loop through the list of players, and construct some HTML to display each one
  let playerContainerHTML = '';
  for (let i = 0; i < playerList.length; i++) {
    const pup = playerList[i];
    let pupHTML = `
      <div class="single-player-card">
        <div class="header-info">
          <p class="pup-title">${pup.name}</p>
          <p class="pup-number">#${pup.id}</p>
        </div>
        <img src="${pup.imageUrl}" alt="photo of ${pup.name} the puppy">
        <button class="detail-button" data-id=${pup.id}>See details</button>
        <button class="delete-button" data-id=${pup.id}>Remove from Roster</button>
      </div>
    `;
    playerContainerHTML += pupHTML;
  }

  // After looping, fill the `playerContainer` div with the HTML we constructed above
  playerContainer.innerHTML = playerContainerHTML;

  // Now that the HTML for all players has been added to the DOM,
  // we want to grab those "See details" buttons on each player
  // and attach a click handler to each one
  let detailButtons = [...document.getElementsByClassName('detail-button')];
  for (let i = 0; i < detailButtons.length; i++) {
    const button = detailButtons[i];
    button.addEventListener('click', async () => {
      let player = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchSinglePlayer)(button.dataset.id)
      await renderSinglePlayer(player)
    });
  }
 
  let deleteButtons = [...document.getElementsByClassName('delete-button')];
  for (let i = 0; i < deleteButtons.length; i++) {
    const button = deleteButtons[i];
    button.addEventListener('click', async () => {
      await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.removePlayer)(button.dataset.id);
      const players = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchAllPlayers)();
      renderAllPlayers(players);
    });
  }
};

const renderSinglePlayer = (playerObj) => {
  if (!playerObj || !playerObj.id) {
    playerContainer.innerHTML = "<h3>Couldn't find data for this player!</h3>";
    return;
  }

  let pupHTML = `
    <div class="single-player-view">
      <div class="header-info">
        <p class="pup-title">${playerObj.name}</p>
        <p class="pup-number">#${playerObj.id}</p>
      </div>
      <p>Team: ${playerObj.team ? playerObj.team.name : 'Unassigned'}</p>
      <p>Breed: ${playerObj.breed}</p>
      <img src="${playerObj.imageUrl}" alt="photo of ${
    playerObj.name
  } the puppy">
      <button id="see-all">Back to all players</button>
    </div>
  `;

  playerContainer.innerHTML = pupHTML;

  let backButton = document.getElementById("see-all")

  backButton.addEventListener("click",
    async () => {renderAllPlayers(await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchAllPlayers)())
    })
};

const renderNewPlayerForm = () => {
  let formHTML = `
    <form>
      <label for="name">Name:</label>
      <input type="text" name="name" />
      <label for="breed">Breed:</label>
      <input type="text" name="breed" />
      <button type="submit">Submit</button>
    </form>
  `;
  newPlayerFormContainer.innerHTML = formHTML;

  let form = document.querySelector('#new-player-form > form');
  
  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    let playerData = {
      name: form.elements.name.value,
      breed: form.elements.breed.value
    }

    await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.addNewPlayer)(playerData)
    const allPlayers = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchAllPlayers)()
    renderAllPlayers(allPlayers)
    renderNewPlayerForm()
  });
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./client/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ajaxHelpers */ "./client/ajaxHelpers.js");
/* harmony import */ var _renderHelpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderHelpers */ "./client/renderHelpers.js");



const init = async () => {
  const players = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchAllPlayers)()
  ;(0,_renderHelpers__WEBPACK_IMPORTED_MODULE_1__.renderAllPlayers)(players)

  ;(0,_renderHelpers__WEBPACK_IMPORTED_MODULE_1__.renderNewPlayerForm)()
}

init()

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wdXBweWJvd2wtd29ya3Nob3AvLi9jbGllbnQvYWpheEhlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wLy4vY2xpZW50L3JlbmRlckhlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3B1cHB5Ym93bC13b3Jrc2hvcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wLy4vY2xpZW50L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFtRDs7QUFFbkQ7QUFDQTtBQUNBO0FBQ0EsMkRBQTJELFdBQVc7OztBQUcvRDtBQUNQO0FBQ0Esd0NBQXdDLE9BQU87QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0EseUNBQXlDLE9BQU8sVUFBVSxTQUFTO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBLFNBQVMsT0FBTztBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQSxtQ0FBbUMsT0FBTyxVQUFVLFNBQVM7QUFDN0Q7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSx5Q0FBeUMsU0FBUztBQUNsRDtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeEU4Rjs7QUFFOUY7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQix1QkFBdUI7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsU0FBUztBQUMxQyxtQ0FBbUMsT0FBTztBQUMxQztBQUNBLG9CQUFvQixhQUFhLGtCQUFrQixTQUFTO0FBQzVELGdEQUFnRCxPQUFPO0FBQ3ZELGdEQUFnRCxPQUFPO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsMEJBQTBCO0FBQzNDO0FBQ0E7QUFDQSx5QkFBeUIsK0RBQWlCO0FBQzFDO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0EsaUJBQWlCLDBCQUEwQjtBQUMzQztBQUNBO0FBQ0EsWUFBWSwwREFBWTtBQUN4Qiw0QkFBNEIsNkRBQWU7QUFDM0M7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixlQUFlO0FBQzlDLGlDQUFpQyxhQUFhO0FBQzlDO0FBQ0EsaUJBQWlCLG9EQUFvRDtBQUNyRSxrQkFBa0IsZ0JBQWdCO0FBQ2xDLGtCQUFrQixtQkFBbUI7QUFDckM7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsaUJBQWlCLHVCQUF1Qiw2REFBZTtBQUN2RCxLQUFLO0FBQ0w7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFVBQVUsMERBQVk7QUFDdEIsNkJBQTZCLDZEQUFlO0FBQzVDO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7Ozs7Ozs7VUNqSEE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7Ozs7O0FDTitDO0FBQ3dCOztBQUV2RTtBQUNBLHdCQUF3Qiw2REFBZTtBQUN2QyxFQUFFLGlFQUFnQjs7QUFFbEIsRUFBRSxvRUFBbUI7QUFDckI7O0FBRUEiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmVuZGVyQWxsUGxheWVycyB9IGZyb20gXCIuL3JlbmRlckhlbHBlcnNcIjtcclxuXHJcbi8vIEFkZCB5b3VyIGNvaG9ydCBuYW1lIHRvIHRoZSBjb2hvcnROYW1lIHZhcmlhYmxlIGJlbG93LCByZXBsYWNpbmcgdGhlICdDT0hPUlQtTkFNRScgcGxhY2Vob2xkZXJcclxuY29uc3QgY29ob3J0TmFtZSA9ICcyMjA5LUZUQi1FVC1XRUItUFQnO1xyXG4vLyBVc2UgdGhlIEFQSVVSTCB2YXJpYWJsZSBmb3IgZmV0Y2ggcmVxdWVzdHNcclxuY29uc3QgQVBJVVJMID0gYGh0dHBzOi8vZnNhLXB1cHB5LWJvd2wuaGVyb2t1YXBwLmNvbS9hcGkvJHtjb2hvcnROYW1lfS9gO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBmZXRjaEFsbFBsYXllcnMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7QVBJVVJMfXBsYXllcnNgKTtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgaWYgKHJlc3VsdC5lcnJvcikge1xyXG4gICAgICAgICAgICB0aHJvdyByZXN1bHQuZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdC5kYXRhLnBsYXllcnMpXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5kYXRhLnBsYXllcnM7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignVWggb2gsIHRyb3VibGUgZmV0Y2hpbmcgcGxheWVycyEnLCBlcnJvcik7XHJcbiAgICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGZldGNoU2luZ2xlUGxheWVyID0gYXN5bmMgKHBsYXllcklkKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHNpbmdsZU9iaiA9IGF3YWl0IGZldGNoKGAke0FQSVVSTH1wbGF5ZXJzLyR7cGxheWVySWR9YCk7XHJcbiAgICAgICAgY29uc3Qgc2luZ2xlUGxheWVyID0gYXdhaXQgc2luZ2xlT2JqLmpzb24oKTtcclxuICAgICAgICBpZiAoc2luZ2xlT2JqLmVycm9yKSB7XHJcbiAgICAgICAgICAgIHRocm93IHNpbmdsZVBsYXllci5lcnJvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNpbmdsZVBsYXllci5kYXRhLnBsYXllcjtcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdVaCBvaCwgdHJvdWJsZSBmZXRjaGluZyBwbGF5ZXJzIScsIGVycm9yKTtcclxuICAgICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGFkZE5ld1BsYXllciA9IGFzeW5jIChwbGF5ZXJPYmopID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgYWRkcGxheWVyT2JqID0gYXdhaXQgZmV0Y2goXHJcbiAgICAgIGAke0FQSVVSTH1wbGF5ZXJzYCxcclxuICAgICAge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICBuYW1lOiBwbGF5ZXJPYmoubmFtZSxcclxuICAgICAgICAgIGJyZWVkOiBwbGF5ZXJPYmouYnJlZWQsXHJcbiAgICAgICAgfSksXHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgICBjb25zdCByZXN1bHRPYmogPSBhd2FpdCBhZGRwbGF5ZXJPYmouanNvbigpO1xyXG4gICAgY29uc29sZS5sb2cocmVzdWx0T2JqKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgcmVtb3ZlUGxheWVyID0gYXN5bmMgKHBsYXllcklkKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElVUkx9cGxheWVycy8ke3BsYXllcklkfWAsIHtcclxuICAgICBtZXRob2Q6ICdERUxFVEUnLFxyXG4gICB9KTtcclxuICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICBpZiAocmVzdWx0LmVycm9yKSB0aHJvdyByZXN1bHQuZXJyb3I7XHJcbiAgIGNvbnNvbGUubG9nKHJlc3VsdClcclxuICAgcmV0dXJuO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICBjb25zb2xlLmVycm9yKFxyXG4gICAgIGBXaG9vcHMsIHRyb3VibGUgcmVtb3ZpbmcgcGxheWVyICMke3BsYXllcklkfSBmcm9tIHRoZSByb3N0ZXIhYCxcclxuICAgICBlcnJcclxuICAgKTtcclxuICB9XHJcbiAgfTtcclxuIiwiaW1wb3J0IHsgYWRkTmV3UGxheWVyLCBmZXRjaEFsbFBsYXllcnMsIGZldGNoU2luZ2xlUGxheWVyLCByZW1vdmVQbGF5ZXIgfSBmcm9tICcuL2FqYXhIZWxwZXJzJ1xyXG5cclxuY29uc3QgcGxheWVyQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FsbC1wbGF5ZXJzLWNvbnRhaW5lcicpO1xyXG5jb25zdCBuZXdQbGF5ZXJGb3JtQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy1wbGF5ZXItZm9ybScpO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJlbmRlckFsbFBsYXllcnMgPSAocGxheWVyTGlzdCkgPT4ge1xyXG4gIC8vIEZpcnN0IGNoZWNrIGlmIHdlIGhhdmUgYW55IGRhdGEgYmVmb3JlIHRyeWluZyB0byByZW5kZXIgaXQhXHJcbiAgaWYgKCFwbGF5ZXJMaXN0IHx8ICFwbGF5ZXJMaXN0Lmxlbmd0aCkge1xyXG4gICAgcGxheWVyQ29udGFpbmVyLmlubmVySFRNTCA9ICc8aDM+Tm8gcGxheWVycyB0byBkaXNwbGF5ITwvaDM+JztcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8vIExvb3AgdGhyb3VnaCB0aGUgbGlzdCBvZiBwbGF5ZXJzLCBhbmQgY29uc3RydWN0IHNvbWUgSFRNTCB0byBkaXNwbGF5IGVhY2ggb25lXHJcbiAgbGV0IHBsYXllckNvbnRhaW5lckhUTUwgPSAnJztcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllckxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgIGNvbnN0IHB1cCA9IHBsYXllckxpc3RbaV07XHJcbiAgICBsZXQgcHVwSFRNTCA9IGBcclxuICAgICAgPGRpdiBjbGFzcz1cInNpbmdsZS1wbGF5ZXItY2FyZFwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJoZWFkZXItaW5mb1wiPlxyXG4gICAgICAgICAgPHAgY2xhc3M9XCJwdXAtdGl0bGVcIj4ke3B1cC5uYW1lfTwvcD5cclxuICAgICAgICAgIDxwIGNsYXNzPVwicHVwLW51bWJlclwiPiMke3B1cC5pZH08L3A+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGltZyBzcmM9XCIke3B1cC5pbWFnZVVybH1cIiBhbHQ9XCJwaG90byBvZiAke3B1cC5uYW1lfSB0aGUgcHVwcHlcIj5cclxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiZGV0YWlsLWJ1dHRvblwiIGRhdGEtaWQ9JHtwdXAuaWR9PlNlZSBkZXRhaWxzPC9idXR0b24+XHJcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImRlbGV0ZS1idXR0b25cIiBkYXRhLWlkPSR7cHVwLmlkfT5SZW1vdmUgZnJvbSBSb3N0ZXI8L2J1dHRvbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICBgO1xyXG4gICAgcGxheWVyQ29udGFpbmVySFRNTCArPSBwdXBIVE1MO1xyXG4gIH1cclxuXHJcbiAgLy8gQWZ0ZXIgbG9vcGluZywgZmlsbCB0aGUgYHBsYXllckNvbnRhaW5lcmAgZGl2IHdpdGggdGhlIEhUTUwgd2UgY29uc3RydWN0ZWQgYWJvdmVcclxuICBwbGF5ZXJDb250YWluZXIuaW5uZXJIVE1MID0gcGxheWVyQ29udGFpbmVySFRNTDtcclxuXHJcbiAgLy8gTm93IHRoYXQgdGhlIEhUTUwgZm9yIGFsbCBwbGF5ZXJzIGhhcyBiZWVuIGFkZGVkIHRvIHRoZSBET00sXHJcbiAgLy8gd2Ugd2FudCB0byBncmFiIHRob3NlIFwiU2VlIGRldGFpbHNcIiBidXR0b25zIG9uIGVhY2ggcGxheWVyXHJcbiAgLy8gYW5kIGF0dGFjaCBhIGNsaWNrIGhhbmRsZXIgdG8gZWFjaCBvbmVcclxuICBsZXQgZGV0YWlsQnV0dG9ucyA9IFsuLi5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdkZXRhaWwtYnV0dG9uJyldO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZGV0YWlsQnV0dG9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgY29uc3QgYnV0dG9uID0gZGV0YWlsQnV0dG9uc1tpXTtcclxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcclxuICAgICAgbGV0IHBsYXllciA9IGF3YWl0IGZldGNoU2luZ2xlUGxheWVyKGJ1dHRvbi5kYXRhc2V0LmlkKVxyXG4gICAgICBhd2FpdCByZW5kZXJTaW5nbGVQbGF5ZXIocGxheWVyKVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gXHJcbiAgbGV0IGRlbGV0ZUJ1dHRvbnMgPSBbLi4uZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZGVsZXRlLWJ1dHRvbicpXTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGRlbGV0ZUJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgIGNvbnN0IGJ1dHRvbiA9IGRlbGV0ZUJ1dHRvbnNbaV07XHJcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgIGF3YWl0IHJlbW92ZVBsYXllcihidXR0b24uZGF0YXNldC5pZCk7XHJcbiAgICAgIGNvbnN0IHBsYXllcnMgPSBhd2FpdCBmZXRjaEFsbFBsYXllcnMoKTtcclxuICAgICAgcmVuZGVyQWxsUGxheWVycyhwbGF5ZXJzKTtcclxuICAgIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCByZW5kZXJTaW5nbGVQbGF5ZXIgPSAocGxheWVyT2JqKSA9PiB7XHJcbiAgaWYgKCFwbGF5ZXJPYmogfHwgIXBsYXllck9iai5pZCkge1xyXG4gICAgcGxheWVyQ29udGFpbmVyLmlubmVySFRNTCA9IFwiPGgzPkNvdWxkbid0IGZpbmQgZGF0YSBmb3IgdGhpcyBwbGF5ZXIhPC9oMz5cIjtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIGxldCBwdXBIVE1MID0gYFxyXG4gICAgPGRpdiBjbGFzcz1cInNpbmdsZS1wbGF5ZXItdmlld1wiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiaGVhZGVyLWluZm9cIj5cclxuICAgICAgICA8cCBjbGFzcz1cInB1cC10aXRsZVwiPiR7cGxheWVyT2JqLm5hbWV9PC9wPlxyXG4gICAgICAgIDxwIGNsYXNzPVwicHVwLW51bWJlclwiPiMke3BsYXllck9iai5pZH08L3A+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8cD5UZWFtOiAke3BsYXllck9iai50ZWFtID8gcGxheWVyT2JqLnRlYW0ubmFtZSA6ICdVbmFzc2lnbmVkJ308L3A+XHJcbiAgICAgIDxwPkJyZWVkOiAke3BsYXllck9iai5icmVlZH08L3A+XHJcbiAgICAgIDxpbWcgc3JjPVwiJHtwbGF5ZXJPYmouaW1hZ2VVcmx9XCIgYWx0PVwicGhvdG8gb2YgJHtcclxuICAgIHBsYXllck9iai5uYW1lXHJcbiAgfSB0aGUgcHVwcHlcIj5cclxuICAgICAgPGJ1dHRvbiBpZD1cInNlZS1hbGxcIj5CYWNrIHRvIGFsbCBwbGF5ZXJzPC9idXR0b24+XHJcbiAgICA8L2Rpdj5cclxuICBgO1xyXG5cclxuICBwbGF5ZXJDb250YWluZXIuaW5uZXJIVE1MID0gcHVwSFRNTDtcclxuXHJcbiAgbGV0IGJhY2tCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlZS1hbGxcIilcclxuXHJcbiAgYmFja0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixcclxuICAgIGFzeW5jICgpID0+IHtyZW5kZXJBbGxQbGF5ZXJzKGF3YWl0IGZldGNoQWxsUGxheWVycygpKVxyXG4gICAgfSlcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCByZW5kZXJOZXdQbGF5ZXJGb3JtID0gKCkgPT4ge1xyXG4gIGxldCBmb3JtSFRNTCA9IGBcclxuICAgIDxmb3JtPlxyXG4gICAgICA8bGFiZWwgZm9yPVwibmFtZVwiPk5hbWU6PC9sYWJlbD5cclxuICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm5hbWVcIiAvPlxyXG4gICAgICA8bGFiZWwgZm9yPVwiYnJlZWRcIj5CcmVlZDo8L2xhYmVsPlxyXG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiYnJlZWRcIiAvPlxyXG4gICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5TdWJtaXQ8L2J1dHRvbj5cclxuICAgIDwvZm9ybT5cclxuICBgO1xyXG4gIG5ld1BsYXllckZvcm1Db250YWluZXIuaW5uZXJIVE1MID0gZm9ybUhUTUw7XHJcblxyXG4gIGxldCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25ldy1wbGF5ZXItZm9ybSA+IGZvcm0nKTtcclxuICBcclxuICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGFzeW5jIChldmVudCkgPT4ge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cclxuICAgIGxldCBwbGF5ZXJEYXRhID0ge1xyXG4gICAgICBuYW1lOiBmb3JtLmVsZW1lbnRzLm5hbWUudmFsdWUsXHJcbiAgICAgIGJyZWVkOiBmb3JtLmVsZW1lbnRzLmJyZWVkLnZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgYXdhaXQgYWRkTmV3UGxheWVyKHBsYXllckRhdGEpXHJcbiAgICBjb25zdCBhbGxQbGF5ZXJzID0gYXdhaXQgZmV0Y2hBbGxQbGF5ZXJzKClcclxuICAgIHJlbmRlckFsbFBsYXllcnMoYWxsUGxheWVycylcclxuICAgIHJlbmRlck5ld1BsYXllckZvcm0oKVxyXG4gIH0pO1xyXG59O1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGZldGNoQWxsUGxheWVycyB9IGZyb20gJy4vYWpheEhlbHBlcnMnXHJcbmltcG9ydCB7IHJlbmRlckFsbFBsYXllcnMsIHJlbmRlck5ld1BsYXllckZvcm0gfSBmcm9tICcuL3JlbmRlckhlbHBlcnMnXHJcblxyXG5jb25zdCBpbml0ID0gYXN5bmMgKCkgPT4ge1xyXG4gIGNvbnN0IHBsYXllcnMgPSBhd2FpdCBmZXRjaEFsbFBsYXllcnMoKVxyXG4gIHJlbmRlckFsbFBsYXllcnMocGxheWVycylcclxuXHJcbiAgcmVuZGVyTmV3UGxheWVyRm9ybSgpXHJcbn1cclxuXHJcbmluaXQoKVxyXG4iXSwic291cmNlUm9vdCI6IiJ9