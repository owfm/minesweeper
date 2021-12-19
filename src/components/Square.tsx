import styled from "styled-components";
import { SQUARE_SIZE, GRID_SIZE_Y, GRID_SIZE_X } from "../constants";

interface SquareProps {
    square: Square;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}


export const Square: React.FC<SquareProps> = ({ square, onClick }) => {


    switch (true) {
        case square.guessedMine: return <BaseSquare emoji data-x={square.x} data-y={square.y} onContextMenu={onClick} onClick={onClick} x={square.x} y={square.y}>🚩</BaseSquare>
        case square.mine && square.revealed: return <BaseSquare emoji data-x={square.x} data-y={square.y} onContextMenu={onClick} onClick={onClick} x={square.x} y={square.y}>💥</BaseSquare>
        case !square.revealed: return <BaseSquare data-x={square.x} data-y={square.y} onContextMenu={onClick} onClick={onClick} x={square.x} y={square.y}></BaseSquare>
        case square.adjacentMineCount > 0: return <ClickedSquare data-x={square.x} onContextMenu={onClick} data-y={square.y} onClick={onClick} x={square.x} y={square.y}>{square.adjacentMineCount}</ClickedSquare>
        case square.adjacentMineCount === 0: return <ClickedSquare data-x={square.x} onContextMenu={onClick} data-y={square.y} onClick={onClick} x={square.x} y={square.y}></ClickedSquare>
    }
    return null;

};


const BaseSquare = styled.button.attrs<{ x: number, y: number, emoji: boolean }>(props => ({
    style: {
        left: props.x * (SQUARE_SIZE + 4) + "px",
        top: props.y * (SQUARE_SIZE + 4) + "px",
        fontSize: props.emoji ? "7px" : "16px"
    }
}))`
	box-sizing: content-box;
	position: absolute;
	background-color: hsl(0, 0%, 73%);
	height: ${SQUARE_SIZE}px;
	width: ${SQUARE_SIZE}px;
	border: 2px solid white;
	border-bottom: 2px solid rgb(123,123,123);
	border-right: 2px solid rgb(123,123,123);
	text-align: center;
	&:active {
		height: ${SQUARE_SIZE + 4}px;
		width: ${SQUARE_SIZE + 4}px;
		border: 1px solid rgb(123,123,123);
	}
	`

const ClickedSquare = styled(BaseSquare)`
	height: ${SQUARE_SIZE + 4}px;
	width: ${SQUARE_SIZE + 4}px;
	border: 1px solid rgb(123,123,123);
`



