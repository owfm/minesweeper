import * as React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Square } from "./components/Square";
import { GRID_SIZE_X, GRID_SIZE_Y, DIFFICULTY, SQUARE_SIZE } from "./constants";
import confetti from 'canvas-confetti';
import { createInitialGrid, fanOut } from "./utils";


export interface Square {
	x: number;
	y: number;
	mine: boolean;
	guessedMine: boolean;
	revealed: boolean;
	adjacentMineCount: number;
}

const App: React.FC = () => {
	const [grid, setGrid] = React.useState<Square[][]>();
	const [remainingMines, setRemainingMines] = React.useState<number>(Infinity);
	const [gameState, setGameState] = React.useState<"playing" | "lost" | "won">("playing");

	const resetGrid = () => {
		const [minesCreated, newGrid] = createInitialGrid();
		setGrid(newGrid);
		setRemainingMines(minesCreated);
	}

	React.useEffect(() => {
		if (gameState === 'won') {
			confetti()
		}
	}, [gameState])

	React.useEffect(() => {
		document.addEventListener("contextmenu", (e) => e.preventDefault());
		resetGrid();
	}, []);

	const handleCellClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		const x = Number(e.currentTarget.getAttribute("data-x")) as unknown as number;
		const y = Number(e.currentTarget.getAttribute("data-y")) as unknown as number;
		if (x === null || y === null) return;

		setGrid((prevGrid) => {
			if (!prevGrid) return;
			const gridCpy = [...prevGrid];

			switch (e.type) {
				case "contextmenu": {
					gridCpy[x][y].guessedMine = true;
					if (gridCpy[x][y].mine) {
						if (remainingMines === 1) {
							setGameState("won");
							return;
						}
						setRemainingMines((prev) => prev - 1);
					}
					return gridCpy;
				}
				case "click": {
					if (gridCpy[x][y].mine) solve();
					fanOut(gridCpy, x, y);
					gridCpy[x][y].revealed = true;
					return gridCpy;

				}
				default:
					return prevGrid;
			}
		});
	};

	const solve = () => {
		if (!grid) return;
		const gridCpy = [...grid];
		for (let i = 0; i < GRID_SIZE_X; i++) {
			for (let j = 0; j < GRID_SIZE_Y; j++) {
				gridCpy[i][j].revealed = true;
			}
		}
		setGrid(gridCpy);
	}

	const getGrid = () => {
		if (!grid) return;

		const squares: any[] = [];
		for (let i = 0; i < GRID_SIZE_X; i++) {
			for (let j = 0; j < GRID_SIZE_Y; j++) {
				squares.push(grid[i][j]);
			}
		}
		return squares;
	};

	if (!grid) return <div>Loading...</div>;

	return (
		<AppWrapper>
			<button onClick={() => resetGrid()}>reset</button>
			<button onClick={() => solve()}>solve</button>
			Mines remaining: {remainingMines}
			<GridWrapper>
				{getGrid().map((x) => (
					<Square square={x} onClick={handleCellClick} />
				))}
			</GridWrapper>

		</AppWrapper>
	);
};

export default App;

const AppWrapper = styled.main`
	display: flex;
	height: 100%;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`

const GridWrapper = styled.div`
	position: relative;
	height: ${GRID_SIZE_Y * (SQUARE_SIZE + 4) + 8}px;
	width: ${GRID_SIZE_X * (SQUARE_SIZE + 4) + 8}px;
	border: 4px solid black;
`;





