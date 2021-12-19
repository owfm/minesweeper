import * as React from "react";
import styled from "styled-components";

const GRID_SIZE_X = 20;
const GRID_SIZE_Y = 20;
const SQUARE_SIZE = 20;

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
				mine: Math.random() < 0.08,
				guessedMine: false,
				revealed: true,
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

const App: React.FC = () => {
	const [grid, setGrid] = React.useState<Square[][]>(createInitialGrid());

	const handleCellClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		const x = e.currentTarget.getAttribute("data-x") as unknown as number;
		const y = e.currentTarget.getAttribute("data-y") as unknown as number;
		setGrid((prevGrid) => {
			const gridCpy = [...prevGrid];
			if (x === null || y === null) return prevGrid;
			if (e.type === "click") {
				if (gridCpy[x][y].mine) alert("dead");
				gridCpy[x][y].revealed = true;
			} else {
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
		<>
			<button onClick={() => setGrid(createInitialGrid())}>reset</button>
			<GridWrapper>
				{getGrid().map((x) => (
					<Square square={x} onClick={handleCellClick} />
				))}
			</GridWrapper>
		</>
	);
};

export default App;

interface SquareProps {
	square: Square;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const Square: React.FC<SquareProps> = ({ square, onClick }) => {
	return (
		<SquareStyle
			data-x={square.x}
			data-y={square.y}
			onClick={onClick}
			square={square}
		>
			{square.revealed
				? square.mine
					? "M"
					: square.adjacentMineCount > 0
					? square.adjacentMineCount
					: ""
				: ""}
		</SquareStyle>
	);
};

const SquareStyle = styled.button<{
	square: Square;
}>`
	position: absolute;
	background: ${({ square }) => (square.revealed ? "#bbb" : "#777")};
	content: 4;
	color: black;
	font-size: 10px;
	height: ${SQUARE_SIZE}px;
	width: ${SQUARE_SIZE}px;
	left: ${({ square }) => square.x * SQUARE_SIZE}px;
	top: ${({ square }) => square.y * SQUARE_SIZE}px;
	border: 1px ${({ square }) => (square.revealed ? "inlay" : "outlay")} black;
`;

const GridWrapper = styled.div`
	/* box-sizing: border-box; */
	position: relative;
	border: 2px solid black;
`;
