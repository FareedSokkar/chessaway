const pieces = {
    "Knight": { "B": "&#9822;", "W": "&#9816;" },
    "King": { "B": "&#9818;", "W": "&#9812;" },
    "Queen": { "B": "&#9819;", "W": "&#9813;" },
    "Rook": { "B": "&#9820;", "W": "&#9814;" },
    "Bishop": { "B": "&#9821;", "W": "&#9815;" },
    "Pawn": { "B": "&#9823;", "W": "&#9817;" }
}

function pieceTypeSelect(value) {
    var color = document.querySelector("select#color").value;
    var piece = document.querySelector("span#piece_Val");
    piece.innerHTML = pieces[value][color];
}

function pieceColorSelect(value) {
    var type = document.querySelector("select#piece").value;
    var piece = document.querySelector("span#piece_Val");
    piece.innerHTML = pieces[type][value];
}

function resetAllSettings(){
    var type = document.querySelector("select#piece");
    var color = document.querySelector("select#color");
    var height = document.querySelector("input#height");
    var width = document.querySelector("input#width");
    var piece = document.querySelector("span#piece_Val");
    type.value="Knight";
    color.value="B";
    height.value=8;
    width.value=8;
    piece.innerHTML = pieces[type.value][color.value];
}