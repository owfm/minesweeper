import * as React from "react";
import styled, { createGlobalStyle } from "styled-components";

const GRID_SIZE_X = 20;
const GRID_SIZE_Y = 20;
const SQUARE_SIZE = 20;
const DIFFICULTY = 0.1;

interface Square {
	x: number;
	y: number;
	mine: boolean;
	guessedMine: boolean;
	revealed: boolean;
	adjacentMineCount: number;
}

const createInitialGrid = () => {
	const squares: Square[][] = [...Array(GRID_SIZE_X)].map((_) =>
		Array(GRID_SIZE_Y)
	);
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

	return squares;
};

const fanOut = (grid: Square[][], x: number, y: number) => {
	if (grid[x][y].mine || grid[x][y].adjacentMineCount > 0) return;
	const xCheck = [x - 1, x, x + 1].filter(
		(i) => i !== -1 && i !== GRID_SIZE_X
	);

	const yCheck = [y - 1, y, y + 1].filter(
		(j) => j !== -1 && j !== GRID_SIZE_Y
	);

	const revealed = [];

	for (let i of xCheck) {
		for (let j of yCheck) {
			if (!grid[i][j].revealed) {
				grid[i][j].revealed = true;
				revealed.push([i, j]);
			};
		}
	}

	// if (revealed.length === 0) return;

	// var nextCoords = revealed[Math.floor(Math.random() * revealed.length)]; // get random new square to fan out from
	for (let [x, y] of revealed) {
		if (grid[x][y].adjacentMineCount > 0) continue;
		fanOut(grid, x, y);
	}


}

const App: React.FC = () => {
	const [grid, setGrid] = React.useState<Square[][]>(createInitialGrid());

	const handleCellClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		const x = Number(e.currentTarget.getAttribute("data-x")) as unknown as number;
		const y = Number(e.currentTarget.getAttribute("data-y")) as unknown as number;
		setGrid((prevGrid) => {
			const gridCpy = [...prevGrid];

			if (x === null || y === null) return prevGrid;

			if (e.type === "click" && !e.ctrlKey) {
				if (gridCpy[x][y].mine) alert("dead");
				fanOut(gridCpy, x, y);
				gridCpy[x][y].revealed = true;
			} else if (e.type === "click" && e.ctrlKey) {
				console.log("ctrl", gridCpy[x][y].guessedMine);
				gridCpy[x][y].guessedMine = true;
			}
			return gridCpy;
		});
	};
	const getGrid = () => {
		const squares: any[] = [];
		for (let i = 0; i < GRID_SIZE_X; i++) {
			for (let j = 0; j < GRID_SIZE_Y; j++) {
				squares.push(grid[i][j]);
			}
		}
		return squares;
	};

	return (
		<AppWrapper>
			<button onClick={() => setGrid(createInitialGrid())}>reset</button>
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




interface SquareProps {
	square: Square;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const Square: React.FC<SquareProps> = ({ square, onClick }) => {


	switch (true) {
		case square.guessedMine: return <BaseSquare data-x={square.x} data-y={square.y} onClick={onClick} x={square.x} y={square.y}>M</BaseSquare>
		case !square.revealed: return <BaseSquare data-x={square.x} data-y={square.y} onClick={onClick} x={square.x} y={square.y}></BaseSquare>
		case square.adjacentMineCount > 0: return <ClickedSquare data-x={square.x} data-y={square.y} onClick={onClick} x={square.x} y={square.y}>{square.adjacentMineCount}</ClickedSquare>
		case square.adjacentMineCount === 0: return <ClickedSquare data-x={square.x} data-y={square.y} onClick={onClick} x={square.x} y={square.y}></ClickedSquare>
	}
	return null;

};


const BaseSquare = styled.button.attrs<{ x: number, y: number }>(props => ({
	style: {
		left: props.x * SQUARE_SIZE + "px",
		top: props.y * SQUARE_SIZE + "px",
	}
}))`
	position: absolute;
	background: #777;
	font-size: 10px;
	height: ${SQUARE_SIZE}px;
	width: ${SQUARE_SIZE}px;
	border: 1px solid outlay;
`

const ClickedSquare = styled(BaseSquare)`
	background: #bbb;
	border: 1px solid inlay;
`



const GridWrapper = styled.div`
	position: relative;
	height: ${GRID_SIZE_Y * SQUARE_SIZE}px;
	width: ${GRID_SIZE_X * SQUARE_SIZE}px;
	border: 3px solid black;
	/* box-sizing: border-box; */
`;
