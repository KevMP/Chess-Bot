const computer = document.querySelector('#board-layout-sidebar > div > div.play-controller-moves-container > div.play-controller-scrollable > vertical-move-list');
const multiplayer = document.querySelector('#move-list > vertical-move-list');


const highlightDiv = document.createElement("div");
highlightDiv.style.opacity = "0.5";
highlightDiv.id = "SHHHH"


function algebraicTo88(algebraicNotation) {
  let pos = algebraicNotation.substring(0,2);
  const firstLetterCode = pos.charCodeAt(0) - 96;

  return firstLetterCode+pos[1];
}


function hightlightSquare(position){
  const className = "square-"  + algebraicTo88(position)
  const targetDiv =  document.querySelector(`.${className}`);
  const targetRect = targetDiv.getBoundingClientRect()
  

  if(targetRect){
    // Set the position and dimensions of the highlighting div
    highlightDiv.style.position = "absolute";
    highlightDiv.style.top = "0";
    highlightDiv.style.left = "0";
    highlightDiv.style.width = "100%";
    highlightDiv.style.height = "100%";
    highlightDiv.style.backgroundColor = "yellow";
    highlightDiv.style.border = "2% solid black";
    highlightDiv.style.padding = "1%";

    // Set the position of the highlighting div based on the position of the target div
    highlightDiv.style.top = "0%";
    highlightDiv.style.left = "0%";

    // Set the size of the highlighting div based on the size of the target div
    highlightDiv.style.width = (targetRect.width / targetDiv.offsetWidth) * 100 + "%";
    highlightDiv.style.height = (targetRect.height / targetDiv.offsetHeight) * 100 + "%";

    // Append the new div to the target div
    targetDiv.appendChild(highlightDiv);
     
  }
}


function listener(event) {
  const nodeChild = event.target;
  const classList = event.target.classList;
  let isWhite = true;
  let gameOver = false;

  if (classList[0] !== 'white' && classList[0] !== 'black') return;
  if (classList[0] === 'black') isWhite = false;


  if(nodeChild.textContent == '0-1' || nodeChild.textContent == '1-0'){
    gameOver = true
  }


  const requestData = {
    white: isWhite,
    move: nodeChild.textContent,
    reset : gameOver
  };

  fetch('http://127.0.0.1:5000/moveMade', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    //mode: 'no-cors',
    body: JSON.stringify(requestData),
  })
  .then(response => response.text())
  .then(data => hightlightSquare(data))
  .catch(error => console.error(error));
}


//reset
fetch('http://127.0.0.1:5000/reset', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
});



if (computer) {
  computer.addEventListener('DOMNodeInserted', listener);
}

if (multiplayer) {
  multiplayer.addEventListener('DOMNodeInserted', listener);
}