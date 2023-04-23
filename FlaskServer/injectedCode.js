const singlePlayerMoveBoardSTR = '#board-layout-sidebar > div > div.play-controller-moves-container > div.play-controller-scrollable > vertical-move-list';
const multiplayerMoveBoardSTR = '#move-list > vertical-move-list';
const singlePlayerBoardSTR = "#board-vs-personalities";
const multiPlayerBoardSTR = "#board-single"; 

//Input settings
const getMoveKey = 'n';
let moveHighlightTime = 500;

//Functions
function algebraicTo88(algebraicNotation) {
  let pos1 = algebraicNotation.substring(0,2);
  let pos2 = algebraicNotation.substring(2);
  const firstLetterCode = pos1.charCodeAt(0) - 96;
  const secondLetterCode = pos2.charCodeAt(0) - 96;

  return [firstLetterCode+pos1[1], secondLetterCode+pos2[1]];
}


function highlightMove(position){
  const opacity = 0.8;
  const dataTestElement = 'highlight';
  const backgroundColor = 'rgb(235, 97, 80)';
  
  const className1 = 'highlight square-' + position[0];
  const className2 = 'highlight square-' + position[1];
  const div1 = document.createElement('div');
  const div2 = document.createElement('div');

  // Set the attributes
  div1.setAttribute('class', className1);
  div2.setAttribute('class', className2);
  div1.setAttribute('style', `background-color: ${backgroundColor}; opacity: ${opacity};`);
  div1.setAttribute('data-test-element', dataTestElement);
  div2.setAttribute('style', `background-color: ${backgroundColor}; opacity: ${opacity};`);
  div2.setAttribute('data-test-element', dataTestElement);


  function placeAndDeleteDivs(parent){
    parent.appendChild(div1);
    parent.appendChild(div2);

    setTimeout(()=>{
      div1.remove();
      div2.remove();
    }, moveHighlightTime)

  }

  if(document.querySelector(singlePlayerBoardSTR)){
    placeAndDeleteDivs(document.querySelector(singlePlayerBoardSTR))
  }else if(document.querySelector(multiPlayerBoardSTR)){
    placeAndDeleteDivs(document.querySelector(multiPlayerBoardSTR))
  }
}

async function displayBestMove() {
  let moveHolder = null;

  ///
  if (document.querySelector(singlePlayerMoveBoardSTR)) {
    moveHolder = document.querySelector(singlePlayerMoveBoardSTR);
  } else if (document.querySelector(multiplayerMoveBoardSTR)) {
    moveHolder = document.querySelector(multiplayerMoveBoardSTR);
  }
  if (moveHolder == null) {
    return;
  }
  ///

  //Reset server position
  await fetch('http://127.0.0.1:5000/reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  //Update moveBoard
  for (let i = 0; i < moveHolder.children.length; i++) {
    const currChild = moveHolder.children[i];

    for (let j = 0; j < currChild.children.length; j++) {
      //await new Promise(resolve => setTimeout(resolve, i * 5)); // Wait for the specified delay
      await fetch('http://127.0.0.1:5000/moveMade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'move': currChild.children[j].textContent }),
      });
    }
  }

  const response = await fetch('http://127.0.0.1:5000/getMove', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  highlightMove(algebraicTo88(data['nextMove']))
}


//Logic
document.addEventListener('keydown', (event)=>{
  if(event.key == getMoveKey){
    displayBestMove();
  }
})