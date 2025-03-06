/*
Authors: Adrian Cieplicki, Abishan Bhavananthan
Date: 2025/03/02
Structure for the Canvas Drawing App
*/

window.addEventListener("load", function (event) {
    let c = document.getElementById("canvas");
    let ctx = c.getContext("2d");

    class Circle {
        constructor(x = 100, y = 100, radius = 1, color = "blue") {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
        }

        draw = function (ctx) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    class Rectangle {
        constructor(x = 100, y = 100, width = 10, height = 10, color = "blue") {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
        }

        draw = function (ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    class Triangle {
        constructor(x = 100, y = 100, height = 10, color = "blue") {
            this.x = x;
            this.y = y;
            this.height = height;
            this.color = color;
        }

        draw = function (ctx) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - 50, this.y + this.height);
            ctx.lineTo(this.x + 50, this.y + this.height);
            ctx.closePath();
            ctx.fill();
        }
    }

    let shapeSelect = document.getElementById("dropdown");
    let radiusSelect = document.getElementById("radius");
    let widthSelect = document.getElementById("width");
    let heightSelect = document.getElementById("height");
    let colorSelect = document.getElementById("color");
    let undoButton = document.getElementById("undo");
    let clearButton = document.getElementById("clear");
    let shapeBlock = document.getElementById("shapeBlock");
    let radiusBlock = document.getElementById("radiusBlock");
    let widthBlock = document.getElementById("widthBlock");
    let heightBlock = document.getElementById("heightBlock");
    let colorBlock = document.getElementById("colorBlock");
    let undoBlock = document.getElementById("undoBlock");
    let clearBlock = document.getElementById("clearBlock");

    let drawnShapes = [];
    let storedShapes = [];
    let shape = shapeSelect.value;
    shapeChange(shape);

    // Construct drawnShapes off of reload
    if (localStorage.drawnShapes) {
        storedShapes = JSON.parse(localStorage.drawnShapes);
        for (let e of storedShapes) {
            let storedShape = e;
            let currShape = "";
            if (storedShape.radius !== undefined) {
                currShape = new Circle(storedShape.x, storedShape.y, storedShape.radius, storedShape.color);
            } else if (storedShape.width !== undefined) {
                currShape = new Rectangle(storedShape.x, storedShape.y, storedShape.width, storedShape.height, storedShape.color);
            } else {
                currShape = new Triangle(storedShape.x, storedShape.y, storedShape.height, storedShape.color);
            }
            drawnShapes.push(currShape);
        }
    } else {
        localStorage.drawnShapes = "";
    }

    // Redraw Shapes from Reload
    redraw(drawnShapes, ctx);

    shapeSelect.addEventListener("change", function (event) {
        shape = shapeSelect.value; // Get selected value directly from dropdown
        shapeChange(shape);
    });

    /**
     * Updates the visibility of input blocks based on the selected shape.
     * @param {string} shape - The selected shape ("circle", "rectangle", or "triangle").
     */
    function shapeChange(shape) {
        if (shape === "circle") {
            radiusBlock.style.display = "block";
            widthBlock.style.display = "none";
            heightBlock.style.display = "none";
        } else if (shape === "rectangle") {
            radiusBlock.style.display = "none";
            widthBlock.style.display = "block";
            heightBlock.style.display = "block";
        } else {
            radiusBlock.style.display = "none";
            widthBlock.style.display = "none";
            heightBlock.style.display = "block";
        }
    }

    /**
     * Clears the canvas and redraws all shapes from the provided list.
     * @param {Array} shapes - An array of shape objects to be redrawn.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     */
    function redraw(shapes, ctx) {
        ctx.clearRect(0, 0, c.width, c.height);
        for (let e of shapes) {
            e.draw(ctx);
        }
    }

    // Input Constraints
    radiusSelect.addEventListener("input", function (event) {
        if (parseInt(radiusSelect.value) < 0) {
            radiusSelect.value = 0;
        } else if (parseInt(radiusSelect.value) > 200) {
            radiusSelect.value = 200;
        }
    });

    widthSelect.addEventListener("input", function (event) {
        if (parseInt(width.value) < 0) {
            widthSelect.value = 0;
        } else if (parseInt(widthSelect.value) > 200) {
            widthSelect.value = 200;
        }
    });

    heightSelect.addEventListener("input", function (event) {
        if (parseInt(heightSelect.value) < 0) {
            heightSelect.value = 0;
        } else if (parseInt(heightSelect.value) > 200) {
            heightSelect.value = 200;
        }
    });

    c.addEventListener("click", function (event) {
        let x = event.pageX - this.offsetLeft;
        let y = event.pageY - this.offsetTop;

        // Shape drawing and array updating logic
        if (shape === "circle") {
            let newShape = new Circle(x, y, parseInt(radiusSelect.value), colorSelect.value);
            newShape.draw(ctx);
            drawnShapes.push(newShape);
            localStorage.drawnShapes = JSON.stringify(drawnShapes);
        } else if (shape === "rectangle") {
            let newShape = new Rectangle(x, y, parseInt(widthSelect.value), parseInt(heightSelect.value), colorSelect.value);
            newShape.draw(ctx);
            drawnShapes.push(newShape);
            localStorage.drawnShapes = JSON.stringify(drawnShapes);
        } else {
            let newShape = new Triangle(x, y, parseInt(heightSelect.value), colorSelect.value);
            newShape.draw(ctx)
            drawnShapes.push(newShape);
            localStorage.drawnShapes = JSON.stringify(drawnShapes);
        }
    });

    clearButton.addEventListener("click", function (event) {
        ctx.clearRect(0, 0, c.width, c.height);
        drawnShapes = [];
        localStorage.drawnShapes = JSON.stringify(drawnShapes);
    });

    undoButton.addEventListener("click", function (event) {
        drawnShapes.pop();
        redraw(drawnShapes, ctx);
        localStorage.drawnShapes = JSON.stringify(drawnShapes);
    });



});