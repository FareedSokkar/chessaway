//Imports
const express = require("express");
const app = express();
const port = process.env.port || 3000;
const pieceStep = {
    "Knight": { U: { X: [2], Y: [-1, 1] }, D: { X: [-2], Y: [-1, 1] }, L: { X: [-1, 1], Y: [-2] }, R: { X: [-1, 1], Y: [2] } },
    "King": { U: { X: [1], Y: [0,1] }, D: { X: [-1], Y: [0,-1] }, L: { X: [1,0], Y: [-1] }, R: { X: [-1,0], Y: [1] } },
    "Queen": { 
        U: { X: 1, Y: 0 },UR:{ X: 1, Y: 1 },
        R: { X: 0, Y: 1 },RD:{ X: -1, Y: 1 }, 
        D: { X: -1, Y: 0 },DL: { X: -1, Y: -1 }, 
        L: { X: 0, Y: -1 },LU: { X: 1, Y: -1 }
    },
    "Rook": { 
        U: { X: 1, Y: 0 },
        R: { X: 0, Y: 1 }, 
        D: { X: -1, Y: 0 }, 
        L: { X: 0, Y: -1 }
    },
    "Bishop": { 
        UR:{ X: 1, Y: 1 },
        RD:{ X: -1, Y: 1 }, 
        DL: { X: -1, Y: -1 }, 
        LU: { X: 1, Y: -1 } 
    },
    "Pawn": { B:{X:1},W:{X:-1}}
};
function evalKnightNKing(row,cell,height,width,piece){
    let p = pieceStep[piece];
    let posiableMoves = [];
    for (let x in p) {
        for (let i = 0; i < p[x]["X"].length; i++) {
            let stepRow = row + p[x]["X"][i];
            if (stepRow > 0 && stepRow <= height)
                for (let j = 0; j < p[x]["Y"].length; j++) {
                    let stepCell = cell + p[x]["Y"][j];
                    if (stepCell > 0 && stepCell <= width)
                        posiableMoves.push({ cell: stepCell, row: stepRow });
                }
        }
    }
    return posiableMoves;
}
function evalPawn(row,cell,height,piece,color){
    let p = pieceStep[piece][color];
    let posiableMoves = [];
    let stepRow = row + p["X"];
    if (stepRow > 0 && stepRow <= height)
    posiableMoves.push({ cell: cell, row: stepRow })
    return posiableMoves;
}
function evalQueenRookBishop(row,cell,height,width,piece){
    let p = pieceStep[piece];
    let posiableMoves = [];
    for (let direction in p) {
        let x=p[direction].X;
        let y=p[direction].Y;
        if(x!==0 || y!==0){
            let stepCell=cell+y;
            let stepRow=row+x;
            while((stepRow > 0 && stepRow <= height)&&(stepCell > 0 && stepCell <= width)){
                //console.log("Hi");
                posiableMoves.push({ cell: stepCell, row: stepRow });
                stepCell=stepCell+y;
                stepRow=stepRow+x;
            }
        }
    }
    return posiableMoves;
}
//Static Files
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//Set Views
//app.set('views','./views');
//app.set('view engine','ejs');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
})

app.get('/startgame', (req, res) => {
    res.sendFile(__dirname + '/views/game.html');
})

app.post('/evaluatemove', function (req, res) {
    if (!!req.body) {
        let row = req.body.row;
        let cell = req.body.cell;
        let height = req.body.height;
        let width = req.body.width;
        let piece = req.body.piece;
        let color = req.body.color;
        if (!!row && !!cell && !!height && !! width && !!piece) {
            let posiableMoves=[];
            switch(piece){
                case "Knight":
                case "King":
                posiableMoves = evalKnightNKing(row,cell,height,width,piece);
                break;
                case "Pawn":
                posiableMoves = evalPawn(row,cell,height,piece,color);
                break;
                case "Queen":
                case "Rook":
                case "Bishop":
                posiableMoves = evalQueenRookBishop(row,cell,height,width,piece);
                break;
            }
            return res.send(posiableMoves);
        }
    }
    return res.send("Error: Wow!");
});


//Listen on port
app.listen(port, () => {
    console.log("Listening on port ", port);
});