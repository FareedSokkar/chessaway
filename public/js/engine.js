//Constants
const AllPieces = {
    "Knight": { "B": "&#9822;", "W": "&#9816;" },
    "King": { "B": "&#9818;", "W": "&#9812;" },
    "Queen": { "B": "&#9819;", "W": "&#9813;" },
    "Rook": { "B": "&#9820;", "W": "&#9814;" },
    "Bishop": { "B": "&#9821;", "W": "&#9815;" },
    "Pawn": { "B": "&#9823;", "W": "&#9817;" }
};
var urlParams = new URLSearchParams(window.location.search);
const height = urlParams.get('height');
const width = urlParams.get('width');
const color = urlParams.get('color');
const pieceName = urlParams.get('piece');
const piece = AllPieces[pieceName][color];
const host = "http://127.0.0.1:3000";
//Variables
let board = document.querySelector("table#board");
let arr_moves;

//functions
function pickRandom(max, min = 1) {
    return Math.floor(Math.random() * max) + min;
}
function setPieceToBoard(start_height, start_width, board, piece) {
    let cell = board.querySelector(`tr:nth-of-type(${start_height + 1}) td:nth-of-type(${start_width + 1})`);
    let span = document.createElement("span");
    span.setAttribute("draggable", "true");
    span.setAttribute("id", "span_piece");
    span.innerHTML = piece;
    cell.appendChild(span);
}
function setTheBoard(height, width, board, color) {
    let flag = true;
    let tr = document.createElement("tr");
    tr.appendChild(document.createElement("td"));
    for (let i = 0; i < width; i++) {
        let td_letter = document.createElement("td");
        td_letter.innerHTML = String.fromCharCode('A'.charCodeAt(0) + i);
        tr.appendChild(td_letter);
    }
    board.appendChild(tr);
    for (let i = 0; i < height; i++) {
        let tr_number = document.createElement("td");
        tr_number.innerHTML = i + 1;
        let tr = document.createElement("tr");
        tr.appendChild(tr_number);
        for (let j = 0; j < width; j++) {
            let td = document.createElement("td");
            if (color === "W")
                td.classList.add("whitePiece");
            td.classList.add("square");
            flag ? td.classList.add("whiteSquare") : td.classList.add("blackSquare");
            flag = !flag;
            tr.appendChild(td);
        }
        board.appendChild(tr);
        if (width % 2 === 0)
            flag = !flag;
    }
}
function myNextMove(row, cell, height, width, piece = "Knight") {
    fetch(`${host}/evaluatemove`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "row": row, "cell": cell, "height": height, "width": width, "piece": piece })
    })
    .then(res => {
        console.log("Response, waiting to parse...");
        return res.json();
    }).then(data => {
        return Object.values(data);
    })
    .catch(e => {
        console.log(e);
    })
}
function colorMoves(board, arr_moves, remove = false) {
    for(let i=0;i<arr_moves.length;i++){
        if (remove) {
            board.rows[arr_moves[i].row].cells[arr_moves[i].cell].classList.remove("allowedSquare");
        } else {
            board.rows[arr_moves[i].row].cells[arr_moves[i].cell].classList.add("allowedSquare");
        }
    }
}
function checkIfContainsMove(cell, row, arr_moves) {
    for (let i = 0; i < arr_moves.length; i++) {
        if (cell === arr_moves[i].cell && row === arr_moves[i].row)
            return true;
    }
    return false;
}

//Variables
let start_height = pickRandom(height);
let start_width = pickRandom(width);

//Initiliazing the Game Engine
setTheBoard(height, width, board, color);
setPieceToBoard(start_height, start_width, board, piece);

let span_piece = document.querySelector("#span_piece");
span_piece.addEventListener("dragstart", function (e) {
    e.dataTransfer.setData("srcId", e.target.id);
    let cell = e.target.parentNode.cellIndex;
    let row = e.target.parentNode.parentNode.rowIndex;
    fetch(`${host}/evaluatemove`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "row": row, "cell": cell, "height": height, "width": width, "piece": pieceName ,"color":color})
    })
    .then(res => {
        console.log("Response, waiting to parse...");
        return res.json();
    }).then(data => {//success
        arr_moves = Object.values(data);
        colorMoves(board,arr_moves);
    })
    .catch(e => {
        console.log(e);
    })
});
board.addEventListener("dragover", function (e) {
    e.preventDefault();
});
board.addEventListener("drop", function (e) {
    e.preventDefault();
    let target = e.target;
    let srcId = e.dataTransfer.getData("srcId");
    if (target.classList.contains("square")) {
        let cell = target.cellIndex;
        let row = target.parentNode.rowIndex;
        if (checkIfContainsMove(cell, row, arr_moves))
            e.target.appendChild(document.querySelector("#" + srcId));
    }
    colorMoves(board, arr_moves, true);
});