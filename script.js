let playerOnTheRow=1;
let matrix=[
    [0,0,0],
    [0,0,0],
    [0,0,0]
];
let classname=[
    "",
    "circle",
    "cross"
]

let playerToChangeName=0;
let computer = 3;
let moves=0;

let computerPlayer=[0,0,0]; // non,Player1, Player2  -> 0=Computer , 1=User

function pressed(event,row,column) {
    if (matrix[row][column] >0) {
        alert("Feld schon belegt");
        return;
    }

    matrix[row][column]=playerOnTheRow;
    
    event.target.firstElementChild.classList.add(classname[playerOnTheRow]);


    player=checkWin();
    if (player>0) {
        openWinScreen(player);
    }

    switchPlayer();
    return;
}

function setMark(row,column) {
    matrix[row][column]=playerOnTheRow;

    document.getElementsByClassName("field")[row*3+column].firstElementChild.classList.add(classname[playerOnTheRow]);

    player=checkWin();
    if (player>0) {
        openWinScreen(player);
    }

    switchPlayer();

    return true;
}

function checkWin() {
    player=0;
    for(let row=0;row<3;row++) {
        // Check rows
        player=checkCombination(matrix[row][0],matrix[row][1],matrix[row][2]);
        if (player>0) {
            return player;
        }

        // Check colums
        player=checkCombination(matrix[0][row],matrix[1][row],matrix[2][row]);
        if (player>0) {
            return player;
        }
    }

    // Check diagnal 1
    player=checkCombination(matrix[0][0],matrix[1][1],matrix[2][2]);
    if (player>0) {
        return player;
    }
    // Check diagnal 2
    player=checkCombination(matrix[0][2],matrix[1][1],matrix[2][0]);
    if (player>0) {
        return player;
    }
    return 0;
}

function checkCombination(n1,n2,n3) {
    let playerWin=0;
    if (n1 == n2 && n2 == n3) playerWin=n1;
    return playerWin;
}

function openWinScreen(player) {
    let winScreenElement=document.getElementsByClassName("winscreen")[0];
    let playerName=document.getElementById("name-player"+player).innerHTML;
    let text="Player "+player +" (" + playerName+ ")" + " wins";
    winScreenElement.innerHTML=text;
    winScreenElement.classList.remove("d-none");
}

function reset() {
    moves=0;
    for (let row=0;row<3;row++) {
        for (let column=0; column<3; column++) {
            matrix[row][column]=0;
        }
    }
    
    for(let element of document.getElementsByClassName("field")) {
        element.firstElementChild.classList.remove("circle");
        element.firstElementChild.classList.remove("cross");
    }
    
    document.getElementsByClassName("winscreen")[0].classList.add("d-none");
    playerOnTheRow=parseInt(Math.random()*2)+1;
    activatePlayer();
}

function activatePlayer() {
    resetPlayer=playerOnTheRow==1?2:1;
    document.getElementById("player"+resetPlayer).classList.remove("bold");
    document.getElementById("player"+playerOnTheRow).classList.add("bold");

    if (playerOnTheRow == computer || computer == 3) {
        computerFindBestMove();
    }
}

function switchPlayer() {
    moves++;
    console.log(moves);
    if (moves>=9) return gameOver();

    let resetPlayer=playerOnTheRow;
    playerOnTheRow++;
    if (playerOnTheRow>2) {
        playerOnTheRow=1;
    };
    document.getElementById("player"+resetPlayer).classList.remove("bold");
    document.getElementById("player"+playerOnTheRow).classList.add("bold");

    if (playerOnTheRow == computer || computer == 3) {
        computerFindBestMove();
    }
}

function getName(player)  {
    return document.getElementById("name-player"+player).innerHTML;
}

function setName(player,name)  {
    document.getElementById("name-player"+player).innerHTML=name;
}

function changePlayerNameScreen(player) {
    document.getElementById("input-name").value="";
    document.getElementById("label-change-name").innerHTML=getName(player);
    document.getElementsByClassName("player-input")[0].classList.remove("d-none");
    playerToChangeName=player;

}

function setComputerPlayer(playertype) {
    computerPlayer[playerToChangeName]=playertype;

    computer=0;
    if (computerPlayer[1] == 0 && computerPlayer[2] == 0) {
        computer=3;
    } else if (computerPlayer[1] == 0) {
        computer=1;
    } else if (computerPlayer[2] == 0) {
        computer=2;
    }
}

function replaceName(playertype) {
    setName(playerToChangeName,document.getElementById("input-name").value);
    setComputerPlayer(playertype);

    closeInputScreen();
}

function closeInputScreen() {
    document.getElementsByClassName("player-input")[0].classList.add("d-none");
}

function computerMustCheckWin(count) {
    let computer=playerOnTheRow;
    let player=computer==1?2:1;

    if (count[computer] == 2 && count[player] == 0) { // First CHeck to Win 
        return true;
    }
    return false;
}

function computerMustCheckDefense(count) {
    let computer=playerOnTheRow;
    let player=computer==1?2:1;

    if (count[player] == 2 && count[computer] == 0) {   // Defend agains a 2 Player Marks 
        return true;
    }
    return false;
}


function computerGetfreePlace(count) {
    for(i=0;i<3;i++) {
        if (count[i] == 0) {
            return i;
        }
    }
    return -1;
}


// async function computerFindBestMove() {
//     await new Promise(e => setTimeout(e,1000));

//     computerCheckWin();
//     computerCheckDefense();
//     computerCheckRandom();

// }

function computerCanCheckDefense() {
    for (let row=0;row<3;row++) {
        // count Markws  none, plyer, computer
    
        // 3 in a Row
        let count=[0,0,0];
        for(let column=0; column<3;column++) {
            count[matrix[row][column]]++;
            if (matrix[row][column] == 0) {
                markRow = row;
                markColumn = column;
            }
        }

        if (computerMustCheckDefense(count)) return setMark(markRow,markColumn);


        // 3 in a column
        count=[0,0,0];
        for(let column=0; column<3;column++) {
            count[matrix[column][row]]++;
            if (matrix[column][row] == 0) {
                markRow = column;
                markColumn = row;
            }
        }
        if (computerMustCheckDefense(count)) return setMark(markRow,markColumn);

   }

   // Diagonals
    count=[0,0,0];
    for(let column=0; column<3;column++) {
        count[matrix[column][column]]++;
        if (matrix[column][column] == 0) {
            markRow = column;
            markColumn = column;
        }
    }
    if (computerMustCheckDefense(count)) return setMark(markRow,markColumn);

   // Diagonals
   count=[0,0,0];
   for(let column=0; column<3;column++) {
        let row=2-column;
        count[matrix[row][column]]++;

        if (matrix[row][column] == 0) {
            markRow = row;
            markColumn = column;
        }
   }
   if (computerMustCheckDefense(count)) return setMark(markRow,markColumn);
}





function computerCanCheckWin() {
    for (let row=0;row<3;row++) {
        // count Markws  none, plyer, computer
    
        // 3 in a Row
        let count=[0,0,0];
        for(let column=0; column<3;column++) {
            count[matrix[row][column]]++;
            if (matrix[row][column] == 0) {
                markRow = row;
                markColumn = column;
            }
        }

        if (computerMustCheckWin(count)) return setMark(markRow,markColumn);


        // 3 in a column
        count=[0,0,0];
        for(let column=0; column<3;column++) {
            count[matrix[column][row]]++;
            if (matrix[column][row] == 0) {
                markRow = column;
                markColumn = row;
            }
        }
        if (computerMustCheckWin(count)) return setMark(markRow,markColumn);

   }

   // Diagonals
    count=[0,0,0];
    for(let column=0; column<3;column++) {
        count[matrix[column][column]]++;
        if (matrix[column][column] == 0) {
            markRow = column;
            markColumn = column;
        }
    }
    if (computerMustCheckWin(count)) return setMark(markRow,markColumn);

   // Diagonals
   count=[0,0,0];
   for(let column=0; column<3;column++) {
        let row=2-column;
        count[matrix[row][column]]++;

        if (matrix[row][column] == 0) {
            markRow = row;
            markColumn = column;
        }
   }
   if (computerMustCheckWin(count)) return setMark(markRow,markColumn);
}

function computerCheckRandom() {

    /*
        Find Position with one Checked
    */

    /*
        Find Random Position
    */

    let choice=[];

    for(let row=0;row<3;row++) {
        for (let col=0;col<3;col++) {
            if (matrix[row][col] == 0) {
                choice.push({
                    col: col,
                    row: row
                })
            }
        }
    }
    let pos=choice[Math.floor(Math.random()*choice.length)];
    setMark(pos.row,pos.col);
}


async function computerFindBestMove() {
    await new Promise(e => setTimeout(e,1000));

    if (computerCanCheckWin()) return;
    if (computerCanCheckDefense()) return;
    computerCheckRandom();
}


function gameOver() {
    let winScreenElement=document.getElementsByClassName("winscreen")[0];
    let text="No Winner!";
    winScreenElement.innerHTML=text;
    winScreenElement.classList.remove("d-none");
}
