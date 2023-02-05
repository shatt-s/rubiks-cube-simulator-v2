class Face {
    constructor(x, y, z, rot) {
        this.position = createVector(x, y, z);
        this.axis = rot;
        this.colour = -1;
    }

    colours = [color(255, 60, 60),     // Red
               color(60, 255, 60),     // Green
               color(255, 255, 255),   // White
               color(255, 255, 0),     // Yellow
               color(60, 60, 255),     // Blue
               color(255, 145, 0)      // Orange
    ];

    setColour(col) {
        this.colour = col;
    }

    draw() {
        push();
        translate(this.position);
        rotate(HALF_PI, this.axis)
        fill(this.colours[this.colour-1]);
        beginShape();
        vertex(-0.5, -0.5, 0);
        vertex(-0.5, 0.5, 0);
        vertex(0.5, 0.5, 0);
        vertex(0.5, -0.5, 0);
        vertex(-0.5, -0.5, 0);
        endShape(CLOSE);
        pop();
    }
}

new p5();

const X = createVector(1, 0, 0);
const Y = createVector(0, 1, 0);
const Z = createVector(0, 0, 1);

let fields = [
    3, 3, 3, 3,     // Down
    2, 2, 2, 2,     // Left
    1, 1, 1, 1,     // Back
    4, 4, 4, 4,     // Up
    5, 5, 5, 5,     // Right
    6, 6, 6, 6      // Front
];

let faces = [
    new Face(-0.5, 1, -0.5, X), new Face(0.5, 1, -0.5, X), new Face(-0.5, 1, 0.5, X), new Face(0.5, 1, 0.5, X),
    new Face(-1, -0.5, 0.5, Y), new Face(-1, -0.5, -0.5, Y), new Face(-1, 0.5, 0.5, Y), new Face(-1, 0.5, -0.5, Y),
    new Face(-0.5, -0.5, -1, Z), new Face(0.5, -0.5, -1, Z), new Face(-0.5, 0.5, -1, Z), new Face(0.5, 0.5, -1, Z),
    new Face(-0.5, -1, -0.5, X), new Face(0.5, -1, -0.5, X), new Face(-0.5, -1, 0.5, X), new Face(0.5, -1, 0.5, X),
    new Face(1, -0.5, 0.5, Y), new Face(1, -0.5, -0.5, Y), new Face(1, 0.5, 0.5, Y), new Face(1, 0.5, -0.5, Y),
    new Face(-0.5, -0.5, 1, Z), new Face(0.5, -0.5, 1, Z), new Face(-0.5, 0.5, 1, Z), new Face(0.5, 0.5, 1, Z)
];

let lastMove = ""

let possibleMoves = [
    "U", "R", "F",
    "U'", "R'", "F'",
    "U2", "R2", "F2"
]

let moves = {}

//     3 3
//     3 3
// 1 1 5 5 4 4 0 0
// 1 1 5 5 4 4 0 0
//     2 2
//     2 2

//       12 13
//       14 15
// 5  4  20 21 16 17 9  8
// 7  6  22 23 18 19 11 10
//       2  3
//       0  1

// Corners
// 4 14 20 *
// 2 6 22 *
// 3 18 23 *
// 15 16 21 *
// 0 7 10 *
// 1 11 19 *
// 9 13 17 *
// 5 8 12 *

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    let easyCam = createEasyCam();
    easyCam.setZoomScale(0);
    easyCam.setPanScale(0);
    easyCam.setWheelScale(0);
    document.oncontextmenu = ()=>false;
}
  
function draw() {
    background(220);
    scale(70)
    // if (faces[0].colour == -1) {
    //     setupColours();
    // }
    setColours()
    for (let i = 0; i < faces.length; i++) {
        faces[i].draw();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function U() {
    for (var d = [], f = 0; 24 > f; f++) d[f] = fields[f];
    fields[12] = d[14], fields[13] = d[12], fields[14] = d[15], fields[15] = d[13], fields[20] = d[16], fields[21] = d[17], fields[16] = d[9], fields[17] = d[8], fields[9] = d[5], fields[8] = d[4], fields[5] = d[20], fields[4] = d[21];
}

function UPrime() {
    for (var d = [], f = 0; 24 > f; f++) d[f] = fields[f];
    fields[14] = d[12], fields[12] = d[13], fields[15] = d[14], fields[13] = d[15], fields[16] = d[20], fields[17] = d[21], fields[9] = d[16], fields[8] = d[17], fields[5] = d[9], fields[4] = d[8], fields[20] = d[5], fields[21] = d[4];
}

function U2() {
    U();
    U();
}

function R() {
    for (var d = [], f = 0; 24 > f; f++) d[f] = fields[f];
    fields[16] = d[18], fields[17] = d[16], fields[18] = d[19], fields[19] = d[17], fields[13] = d[21], fields[15] = d[23], fields[11] = d[13], fields[9] = d[15], fields[3] = d[11], fields[1] = d[9], fields[21] = d[3], fields[23] = d[1];
}

function RPrime() {
    for (var d = [], f = 0; 24 > f; f++) d[f] = fields[f];
    fields[18] = d[16], fields[16] = d[17], fields[19] = d[18], fields[17] = d[19], fields[21] = d[13], fields[23] = d[15], fields[13] = d[11], fields[15] = d[9], fields[11] = d[3], fields[9] = d[1], fields[3] = d[21], fields[1] = d[23];
}

function R2() {
    R();
    R();
}

function F() {
    for (var d = [], f = 0; 24 > f; f++) d[f] = fields[f];
    fields[20] = d[22], fields[21] = d[20], fields[22] = d[23], fields[23] = d[21], fields[14] = d[6], fields[15] = d[4], fields[16] = d[14], fields[18] = d[15], fields[2] = d[18], fields[3] = d[16], fields[4] = d[2], fields[6] = d[3];
}

function FPrime() {
    for (var d = [], f = 0; 24 > f; f++) d[f] = fields[f];
    fields[22] = d[20], fields[20] = d[21], fields[23] = d[22], fields[21] = d[23], fields[6] = d[14], fields[4] = d[15], fields[14] = d[16], fields[15] = d[18], fields[18] = d[2], fields[16] = d[3], fields[2] = d[4], fields[3] = d[6];
}

function F2() {
    F();
    F();
}

function setColours() {
    for (let i = 0; i < 24; i++) {
        faces[i].setColour(fields[i]);
    }
}

function getOppositeMove(move) {
    if (move.includes("2"))
        return move
    if (move.includes("'"))
        return move[0]
    else
        return move[0] + "'"
}

function transformFields() {
    let polynomialFields = [...fields];
    polynomialFields.push(fields[4] * fields[14] * fields[20]);
    polynomialFields.push(fields[2] * fields[6] * fields[22]);
    polynomialFields.push(fields[3] * fields[18] * fields[23]);
    polynomialFields.push(fields[15] * fields[16] * fields[21]);
    polynomialFields.push(fields[0] * fields[7] * fields[10]);
    polynomialFields.push(fields[1] * fields[11] * fields[19]);
    polynomialFields.push(fields[9] * fields[13] * fields[17]);
    polynomialFields.push(fields[5] * fields[8] * fields[12]);
    return polynomialFields;
}

function nextMove() {
    let move;
    let key = fields.toString();
    if (moves[key] === undefined || moves[key].length == 0) {
        moves[key] = [...possibleMoves];
        let polynomialFields = transformFields();
        let predict = pyscript.runtime.globals.get('predict');
        move = predict(polynomialFields);
    } else {
        move = moves[key][Math.floor(Math.random() * moves[key].length)];
    }
    moves[key].splice(moves[key].indexOf(move[0]), 1);
    moves[key].splice(moves[key].indexOf(move[0]+"'"), 1);
    moves[key].splice(moves[key].indexOf(move[0]+"2"), 1);
    return move;
    // if (move == getOppositeMove(lastMove) || move == lastMove) {
    //     let index = array.indexOf(move);
    //     if (index > -1) {
    //         array.splice(index, 1);
    //     }
    //     index = array.indexOf(lastMove);
    //     if (index > -1) {
    //         array.splice(index, 1);
    //     }
    //     index = array.indexOf(move[0] + "2");
    //     if (index > -1) {
    //         array.splice(index, 1);
    //     }
    //     print (array)
    //     move = array[Math.floor(Math.random() * array.length)];
    // }
    // lastMove = move;
    // return move
}

let solveMoves = ""

function solve() {
    counter = 0;
    solveMoves = "";
    while (!solved() || counter < 200) {
        let move = nextMove();
        switch (move) {
            case "U":
                U();
                break;
            case "R":
                R();
                break;
            case "F":
                F();
                break;
            case "U'":
                UPrime();
                break;
            case "R'":
                RPrime();
                break;
            case "F'":
                FPrime();
                break;
            case "U2":
                U2();
                break;
            case "R2":
                R2();
                break;
            case "F2":
                F2();
                break;
        }
        solveMoves += move + " "
        counter += 1;
    }
    if (solved()) moves = {};
    return solveMoves;
}

// fields = [3, 1, 3, 1, 4, 4, 5, 2, 5, 5, 1, 4, 6, 6, 6, 6, 3, 3, 2, 5, 2, 2, 1, 4]

function solved() {
    for (var side = 0; 24 > side; side += 4) {
        c = fields[side];
        for (var tile = 1; 4 > tile; tile++)
            if (fields[side + tile] != c) return false;
    }
    return true
}
