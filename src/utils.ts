import { Square } from "./App";
import { GRID_SIZE_X, GRID_SIZE_Y, DIFFICULTY } from "./constants";

export const createInitialGrid = (): [number, Square[][]] => {
  const squares: Square[][] = [...Array(GRID_SIZE_X)].map((_) =>
    Array(GRID_SIZE_Y)
  );
  let minesCreated = 0;
  for (let i = 0; i < GRID_SIZE_X; i++) {
    for (let j = 0; j < GRID_SIZE_Y; j++) {
      squares[i][j] = {
        x: i,
        y: j,
        mine: Math.random() < DIFFICULTY,
        guessedMine: false,
        revealed: false,
        adjacentMineCount: 0,
      };
      if (squares[i][j].mine) minesCreated++;
    }
  }

  // count up adjacent mines

  for (let i = 0; i < GRID_SIZE_X; i++) {
    for (let j = 0; j < GRID_SIZE_Y; j++) {
      if (squares[i][j].mine) continue;

      const xCheck = [i - 1, i, i + 1].filter(
        (x) => x !== -1 && x !== GRID_SIZE_X
      );

      const yCheck = [j - 1, j, j + 1].filter(
        (y) => y !== -1 && y !== GRID_SIZE_Y
      );

      let mineCount = 0;

      for (let x of xCheck) {
        for (let y of yCheck) {
          if (squares[x][y].mine) mineCount++;
        }
      }

      squares[i][j].adjacentMineCount = mineCount;
    }
  }

  return [minesCreated, squares];
};

export const fanOut = (grid: Square[][], x: number, y: number) => {
  if (grid[x][y].mine || grid[x][y].adjacentMineCount > 0) return;
  const xCheck = [x - 1, x, x + 1].filter((i) => i !== -1 && i !== GRID_SIZE_X);

  const yCheck = [y - 1, y, y + 1].filter((j) => j !== -1 && j !== GRID_SIZE_Y);

  const revealed = [];

  for (let i of xCheck) {
    for (let j of yCheck) {
      if (!grid[i][j].revealed) {
        grid[i][j].revealed = true;
        revealed.push([i, j]);
      }
    }
  }

  for (let [x, y] of revealed) {
    if (grid[x][y].adjacentMineCount > 0) continue;
    fanOut(grid, x, y);
  }
};
