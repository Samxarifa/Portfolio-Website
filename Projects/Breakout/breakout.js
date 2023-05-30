/*
    Breakout
    Author: Sam Hay
*/

//Runs after window is fully loaded
window.onload = function () {
    //Gets canvas
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    //Class Def for Ball Object
    class Ball {
        constructor(x, y, radius) {
            this.x = x;
            this.y = y;
            this.radius = radius;

            //Sets speed of ball
            // let randomDir = (Math.floor(Math.random() * 2) * 2) - 1;
            // this.bounceDirX = 0.2 * randomDir;
            this.bounceDirX = 0;
            this.bounceDirY = -0.2;
        }
        draw() {
            ctx.beginPath(); //Start

            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI); //Pos1, Pos2, radius, 0 Degrees, 360 Degrees (2Pi)

            ctx.fillStyle = '#000000';
            ctx.fill(); //Fill Shape With colour

            ctx.closePath(); //Ends
        }
        move(blocks, paddle, time, collide) {
            let hit = false;
            
            //Checks for ball hitting paddle
            if (this.x + this.radius > paddle.x && this.x - this.radius < paddle.x + paddle.sizeX &&
                this.y + this.radius > paddle.y && this.y - this.radius < paddle.y + paddle.sizeY) {
                if (!collide) {
                    if (rightPressed && !leftPressed) {
                        this.bounceDirX += 0.2;
                    } else if (leftPressed && !rightPressed) {
                        this.bounceDirX -= 0.2;
                    }
                    this.bounceDirX = Math.round(this.bounceDirX*10)/10;
                    this.bounceDirY = -Math.abs(this.bounceDirY);
                }
                hit = true;
                collide = true;
            }

            //Checks for ball hitting edges
            if (this.y < this.radius / 2) {
                this.bounceDirY = Math.abs(this.bounceDirY);
            } else if (this.y > canvas.height - (this.radius / 2)) {
                this.bounceDirY = -Math.abs(this.bounceDirY);
                if (!collide) {
                    lives -= 1
                    ball.x = canvas.width/2
                    ball.y = 500
                    ball.bounceDirX = 0
                    ball.bounceDirY = -0.2
                }
                collide = true;
                hit = true;
            } else if (this.x < 5) {
                this.bounceDirX = Math.abs(this.bounceDirX);
            } else if (this.x > canvas.width - 5) {
                this.bounceDirX = -Math.abs(this.bounceDirX);
            }


            //Checks for ball hitting block/s and bounces accordingly
            for (let i = 0; i < blocks.length; i++) {
                for (let j = 0; j < 10; j++) {
                    let block = blocks[i][j];
                    let blockX = block.x;
                    let blockY = block.y;
                    let blockSizeX = block.sizeX;
                    let blockSizeY = block.sizeY;
                    let blockStrength = block.strength;
                    

                    if (blockStrength > 0) { //If block still alive
                        //If ball x colliding with block x
                        if (this.x + this.radius > blockX && this.x - this.radius < blockX + blockSizeX) {
                            //If ball colliding with top or bottom of block
                            if ((this.y - this.radius < blockY + blockSizeY && this.y - this.radius > blockY + blockSizeY - 5) ||
                                (this.y + this.radius > blockY && this.y + this.radius < blockY + 5)) {
                                hit = true;
                                if (!collide) {
                                    this.bounceDirY = -this.bounceDirY
                                    this.y += this.bounceDirY * time;
                                }
                            }
                        }
                        //If ball y colliding with block y
                        if (this.y + this.radius > blockY && this.y - this.radius < blockY + blockSizeY) {
                            //If ball colliding with left or right of block
                            if ((this.x - this.radius < blockX + blockSizeX && this.x - this.radius > blockX + blockSizeX - 5) ||
                                (this.x + this.radius > blockX && this.x + this.radius < blockX + 5)) {
                                hit = true;
                                if (!collide) {
                                    this.bounceDirX = -this.bounceDirX
                                    this.x += this.bounceDirX * time;
                                }
                            }
                        }
                    }

                    //Decreases Block strength by 1
                    if (hit && !collide) {
                        collide = true;
                        blocks[i][j].strength -= 1;
                        if (blocks[i][j].strength == 0) {
                            score += 1;
                        }
                    } 
                
                }
            }
            if (!hit) {
                collide = false;
            }

            //moves the ball pos
            this.y += this.bounceDirY * time;
            this.x += this.bounceDirX * time;

            return collide;

        }
    }

    //Class Def for each block object
    class Block {
        constructor(x, y, sizeX, sizeY) {
            this.x = x;
            this.y = y;
            this.sizeX = sizeX;
            this.sizeY = sizeY;
            this.strength = Math.floor(Math.random() * 5) + 1;
            // this.strength = 1;
        }
        draw() {
            if (this.strength > 0) {
                ctx.beginPath(); //Start

                ctx.rect(this.x, this.y, this.sizeX, this.sizeY); //Pos And Size

                ctx.fillStyle = colours[this.strength - 1]; //Gives Block colour to match strength
                ctx.fill(); //Fill Shape With colour

                ctx.strokeStyle = '#000000';
                ctx.stroke(); //Give Shape Border

                //Draws Stength Text
                ctx.fillStyle = '#000000';
                ctx.textAlign = "center";
                ctx.font = "20px Arial";
                ctx.fillText(`${this.strength}`, this.x + (0.5 * this.sizeX), this.y + (0.66 * this.sizeY));

                ctx.closePath(); //Ends
            }
        }
    }

    //Class Def for paddle object
    class Paddle {
        constructor(x, y, sizeX, sizeY) {
            this.x = x;
            this.y = y;
            this.sizeX = sizeX;
            this.sizeY = sizeY;
        }

        draw() {
            ctx.beginPath(); //Start

            ctx.rect(this.x, this.y, this.sizeX, this.sizeY); //Pos And Size

            ctx.fillStyle = '#000000';
            ctx.fill(); //Fill Shape With colour

            ctx.strokeStyle = '#000000';
            ctx.stroke(); //Give Shape Border

            ctx.closePath(); //Ends
        }

        move(left, right, time) {
            //Updates paddle based on arrow keys. If both pressed then paddle stays
            if (left && right) {
                null;
            } else if (left && this.x > 0) {
                this.x = this.x - 0.5 * time; //Moves right at Speed relative to delta time
            } else if (right && this.x < (canvas.width - this.sizeX)) {
                this.x = this.x + 0.5 * time; //Move left at Speed relative to delta time
            }
        }
    }

    //Check for key press
    function keyDownHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = true;
            started = true;
        } else if (e.keyCode == 37) {
            leftPressed = true;
            started = true;
        }
    }

    //Check for key release
    function keyUpHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = false;
        } else if (e.keyCode == 37) {
            leftPressed = false;
        }
    }

    //Creates all blocks and gives them position and size
    function generateBlocks() {
        const blocks = [];
        for (y = 0; y < 3; y++) {
            blocks[y] = [];
            for (x = 0; x < 10; x++) {
                blocks[y][x] = new Block((100 * x) + 4, (y * 50) + 4, 92, 42);
            }
        }
        return blocks;
    }

    //Array of Stength Colours (DarkBlue,Blue,Green,Yellow,Red)
    const colours = ['#477CB3', '#429FFF', '#33FF66', '#EFFF75', '#FF665C'];

    score = 0;
    lives = 3;
    started = false;
    gameOver = false;

    //Checks for key presses
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    leftPressed = false;
    rightPressed = false;

    //Creates 2D array of blocks
    blocks = generateBlocks();

    //Creates ball, paddle and sets their dimensions and locations
    ball = new Ball(canvas.width / 2, 500, 10);
    paddle = new Paddle(450, 600, 100, 10, '#2468AC');

    prevTime = Date.now();

    collide = false;

    //Runs function every frame
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); //Clears Screen

        //If game running
        if (!gameOver) {
            //Draws score and lives
            ctx.font = "30px Arial";
            ctx.fillStyle = "#000000";
            ctx.textAlign = "left";
            ctx.fillText(`Lives: ${lives}`, canvas.width - 125, canvas.height - 15);
            ctx.fillText(`Score: ${score}`, 10, canvas.height - 15);
            ctx.fillText(`Speed: ${(Math.abs(ball.bounceDirX*10)/2)+1}`, 10, canvas.height - 60);

            //Checks if blocks left on screen
            blocksLeft = false;
            for (y = 0; y < blocks.length; y++) {
                for (x = 0; x < 10; x++) {
                    blocks[y][x].draw();
                    if (blocks[y][x].strength > 0) {
                        blocksLeft = true;
                    }
                }
            }

            //Regenerates blocks if all gone
            if (!blocksLeft) {
                ball.x = canvas.width / 2;
                ball.y = 600;
                ball.bounceDirY = -Math.abs(ball.bounceDirY);
                blocks = generateBlocks();
            }

            //Works out time between previous frame and current frame (makes moving objects stay at correct speed at all times)
            currentTime = Date.now();
            deltaTime = currentTime - prevTime;
            prevTime = currentTime;
            // ctx.fillText(`FPS: ${Math.round(1000/deltaTime)}`, 50, canvas.height - 60);

            //Updates paddle
            paddle.move(leftPressed, rightPressed, deltaTime);
            paddle.draw();

            //Checks if lives left
            if (lives <= 0) {
                gameOver = true;
            }

            if (started) {
                //Updates ball
                collide = ball.move(blocks, paddle, deltaTime,collide);
                ball.draw();
            } else { //Displays Start Screen
                ctx.textAlign = "center";
                ctx.font = "60px Arial";
                ctx.fillText(`Breakout`, canvas.width / 2, canvas.height * 0.33);
                ctx.font = "30px Arial";
                ctx.fillText(`Press Arrow Keys To Start...`, canvas.width / 2, canvas.height * 0.66);
                ctx.fillText(`<<              >>`, canvas.width / 2, 615);
            }
        } else { //Displays End Screen
            ctx.textAlign = "center";
            ctx.font = "60px Arial";
            ctx.fillText(`Game Over`, canvas.width / 2, canvas.height * 0.33);
            ctx.font = "30px Arial";
            ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height * 0.66);
        }
    }
    //Runs game
    setInterval(animate);
}