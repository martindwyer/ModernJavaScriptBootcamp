const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const width = window.innerWidth;
const height = window.innerHeight;

const cellsVert = 8;
const cellsHorz = 10;

const cellHeight = height / cellsVert;
const cellWidth = width / cellsHorz;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: width,
    height: height,
    wireframes: false,
    background: "white",
  },
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Exterior Walls

const exteriorWalls = [
  Bodies.rectangle(width / 2, 0, width, 2, {
    isStatic: true,
  }),
  Bodies.rectangle(width / 2, height, width, 2, {
    isStatic: true,
  }),
  Bodies.rectangle(0, height / 2, 2, height, {
    isStatic: true,
  }),
  Bodies.rectangle(width, height / 2, 2, height, {
    isStatic: true,
  }),
];

World.add(world, exteriorWalls);

// Maze Generation

const shuffle = (arr) => {
  let counter = arr.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);

    counter--;

    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }

  return arr;
};

// grid structure

let grid = Array(cellsVert)
  .fill(null)
  .map(() => Array(cellsHorz).fill(false));

console.log(grid);

// inner wall structure

let verticals = Array(cellsVert)
  .fill(null)
  .map(() => Array(cellsHorz - 1).fill(false));

let horizontals = Array(cellsVert - 1)
  .fill(null)
  .map(() => Array(cellsHorz).fill(false));

console.log(verticals, horizontals);

let startRow = Math.floor(Math.random() * cellsVert);
let startCol = Math.floor(Math.random() * cellsHorz);

console.log(startRow, startCol);

const stepThroughGrid = (row, column) => {
  // If I have visited cell at [row,column] then return
  if (grid[row][column]) {
    return;
  } else {
    // Mark the cell as visited
    grid[row][column] = true;

    // Assemble randomly-ordered list of neighbors
    const neighbors = shuffle([
      [row - 1, column, "up"],
      [row, column + 1, "right"],
      [row + 1, column, "down"],
      [row, column - 1, "left"],
    ]);

    // For each neighbor
    for (let neighbor of neighbors) {
      const [nextRow, nextColumn, direction] = neighbor;

      // See if that neighbor is out of balance
      if (
        nextRow < 0 ||
        nextRow >= cellsVert ||
        nextColumn < 0 ||
        nextColumn >= cellsHorz
      ) {
        continue;
      }

      // If we have visited that neighbor, continue to next neighbor
      if (grid[nextRow][nextColumn]) {
        continue;
      }

      // Remove a wall from either verticals or horizontals array
      if (direction === "left") {
        verticals[row][column - 1] = true;
      } else if (direction === "right") {
        verticals[row][column] = true;
      } else if (direction === "up") {
        horizontals[row - 1][column] = true;
      } else if (direction === "down") {
        horizontals[row][column] = true;
      }

      // Visit that next cell
      stepThroughGrid(nextRow, nextColumn);
    }
  }
};

stepThroughGrid(startRow, startCol);

horizontals.forEach((row, rowIndex) => {
  row.forEach((open, colIndex) => {
    if (open) {
      return;
    } else {
      const wall = Bodies.rectangle(
        colIndex * cellWidth + cellWidth / 2,
        rowIndex * cellHeight + cellHeight,
        cellWidth,
        5,
        {
          label: "wall",
          isStatic: true,
          render: {
            fillStyle: "red",
          },
        }
      );
      World.add(world, wall);
    }
  });
});

verticals.forEach((row, rowIndex) => {
  row.forEach((open, colIndex) => {
    if (open) {
      return;
    } else {
      const wall = Bodies.rectangle(
        colIndex * cellWidth + cellWidth,
        rowIndex * cellHeight + cellHeight / 2,
        5,
        cellHeight,
        {
          label: "wall",
          isStatic: true,
          render: {
            fillStyle: "red",
          },
        }
      );

      World.add(world, wall);
    }
  });
});

const goal = Bodies.rectangle(
  width - cellWidth / 2,
  height - cellHeight / 2,
  cellWidth * 0.7,
  cellHeight * 0.7,
  {
    label: "goal",
    isStatic: true,
    render: {
      fillStyle: "green",
    },
  }
);

World.add(world, goal);

const ball = Bodies.circle(
  cellWidth / 2,
  cellHeight / 2,
  Math.min(cellWidth / 3, cellHeight / 3),
  {
    label: "ball",
    render: {
      fillStyle: "blue",
    },
  }
);

World.add(world, ball);

document.addEventListener("keydown", (evt) => {
  const { x, y } = ball.velocity;

  let newVelocity;

  if (evt.key === "ArrowUp") {
    newVelocity = Math.min(Math.abs(y - 5), 10);
    Body.setVelocity(ball, { x, y: -newVelocity });
  }
  if (evt.key === "ArrowRight") {
    newVelocity = Math.min(Math.abs(x + 5), 10);
    Body.setVelocity(ball, { x: newVelocity, y });
  }
  if (evt.key === "ArrowDown") {
    newVelocity = Math.min(Math.abs(y + 5), 10);
    Body.setVelocity(ball, { x, y: newVelocity });
  }
  if (evt.key === "ArrowLeft") {
    newVelocity = Math.min(Math.abs(x - 5), 10);
    Body.setVelocity(ball, { x: -newVelocity, y });
  }
});

// Win Condition

Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    const labels = ["ball", "goal"];
    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      world.gravity.y = 1;
      world.bodies.forEach((body) => {
        if (body.label === "wall") {
          Body.setStatic(body, false);
        }
      });
      document.querySelector(".winner").classList.remove("hidden");
    }
  });
});
