const gamesGui = new dat.GUI({width: 300, resizable: false});
let games = gamesGui.addFolder('Games');

export let currentGame;

let home = { Home:function() {
        currentGame = undefined;
        window.location.href = "index.html";
    }
};
gamesGui.add(home, 'Home');

let snake = { Snake:function() {
        currentGame = "snake.js";
        window.location.href = "snake.html";
    }
};
games.add(snake, 'Snake');

let tetris = { Tetris:function() {
        currentGame = "tetris.js";
        window.location.href = "tetris.html";
    }
};
games.add(tetris, 'Tetris');

games.open();