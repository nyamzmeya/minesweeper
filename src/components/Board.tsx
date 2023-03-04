import { useEffect, useState } from "react";
import styles from "./Board.module.css";
import { BoardHeader } from "./BoardHeader";
import { Cell } from "./Cell";

type cellsType = Array<Array<{ value: number; isOpen: boolean }>>;
export enum gameStateEnum {
  restart,
  process,
  pressed,
  win,
  fail,
}
export const Board = ({
  columnsSize,
  rowsSize,
  minesCount,
}: {
  columnsSize: number;
  rowsSize: number;
  minesCount: number;
}) => {

  // initial sells with zero values and closed
  const [cells, setSells] = useState<cellsType>(
    Array(columnsSize)
      .fill(0)
      .map(() =>
        Array(rowsSize)
          .fill(0)
          .map(() => ({ value: 0, isOpen: false }))
      )
  );
  // is board filled
  const [filled, setFilled] = useState(false);
  // bombs coordinates
  const [bombsCoord, setBombsCoord] = useState<number[][]>([]);
  // game state: restart, process, pressed, win, fail
  const [gameState, setGameState] = useState<gameStateEnum>(
    gameStateEnum.process
  );
  // amount of cells must open
  const [open, setMustOpen] = useState(columnsSize * rowsSize - minesCount);
  // coordinates of flags
  const [guessBombsCoord, setGuessBombsCoord] = useState<number[]>([]);
  // timer
  const [time, setTime] = useState(0);
  // timer state
  const [running, setRunning] = useState(false);
  // start timer
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined;
    if (running) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!running) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running]);
  // win if amount of cells must open is zero
  useEffect(() => {
    if (open === 0) {
      setGameState(gameStateEnum.win);
      setRunning(false);
    }
  }, [open === 0]);
  useEffect(()=> {
    if (gameState === gameStateEnum.fail) {
      document.body.style.background = "var(--background-fail)"
    } else if (gameState === gameStateEnum.win) {
      document.body.style.background = "var(--background-win)"
    } else {
      document.body.style.background = "var(--background-main)"
    }
  }, [gameState === gameStateEnum.fail || gameState === gameStateEnum.win])
  // count cell value
  const cellFill = (cells: cellsType, row: number, col: number) => {
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (
          row + i >= 0 &&
          row + i < rowsSize &&
          col + j >= 0 &&
          col + j < columnsSize
        ) {
          if (cells[row + i][col + j].value !== -1) {
            cells[row + i][col + j].value += 1;
          }
        }
      }
    }
  };
  // fill bombs
  const bombFill = (cells: cellsType, firstRow: number, firstCol: number) => {
    let i = 0;
    while (i < minesCount) {
      let row = Math.floor(Math.random() * rowsSize);
      let col = Math.floor(Math.random() * columnsSize);
      if (
        cells[row][col].value !== -1 &&
        row !== firstRow &&
        col !== firstCol
      ) {
        cells[row][col].value = -1;
        i += 1;
        cellFill(cells, row, col);
        setBombsCoord((prev) => [...prev, [row, col]]);
      }
    }
    return cells;
  };
  // first fill: fill bombs, start timer, set filled state
  const firstFill = (row: number, col: number) => {
    setSells(bombFill(cells, row, col));
    setFilled(true);
    setRunning(true);
  };
  // open cells
  let updateSells = (row: number, col: number) => {
    let currentSells = cells;
    let flagsOpen: number[] = guessBombsCoord;
    let opened = 0;
    let openCellsLoop = (row: number, col: number) => {
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (
            row + i >= 0 &&
            row + i < rowsSize &&
            col + j >= 0 &&
            col + j < columnsSize
          ) {
            if (
              currentSells[row + i][col + j].value !== -1 &&
              !currentSells[row + i][col + j].isOpen
            )
              openCells(row + i, col + j);
          }
        }
      }
    };

    const openCells = (row: number, col: number) => {
      currentSells[row][col].isOpen = true;
      opened += 1;
      if (guessBombsCoord.includes(row * 16 + col)) {
        flagsOpen = flagsOpen.filter((num) => num !== row * 16 + col);
      }
      if (currentSells[row][col].value === 0) {
        openCellsLoop(row, col);
      }
    };
    openCells(row, col);
    setSells([...currentSells]);
    setGuessBombsCoord(flagsOpen);
    setMustOpen((open) => open - opened);
  };
  // bomb click
  let bombFail = (row: number, col: number) => {
    let currentSells = cells;
    for (let i = 0; i < bombsCoord.length; i++) {
      if (bombsCoord[i][0] !== row && bombsCoord[i][1] !== col)
        currentSells[bombsCoord[i][0]][bombsCoord[i][1]].isOpen = true;
    }
    setGameState(gameStateEnum.fail);
    setRunning(false);
    setSells([...currentSells]);
  };
  let updateGuessBombsCoord = (key: number, add: boolean) => {
    if (add) {
      setGuessBombsCoord([...guessBombsCoord, key]);
    } else {
      const filtered = guessBombsCoord.filter((num) => num !== key);
      setGuessBombsCoord(filtered);
    }
  };
  let upDateGameState = (state: gameStateEnum) => {
    setGameState(state);
  };
  let restartGame = () => {
    setSells(
      Array(columnsSize)
        .fill(0)
        .map(() =>
          Array(rowsSize)
            .fill(0)
            .map(() => ({ value: 0, isOpen: false }))
        )
    );
    setFilled(false);
    setBombsCoord([]);
    setGameState(gameStateEnum.restart);
    setMustOpen(columnsSize * rowsSize - minesCount);
    setGuessBombsCoord([]);
    setTime(0);
    setRunning(false);
  };
  return (
    <div className={styles.board_container}>
      <BoardHeader
        bombsLeft={minesCount - guessBombsCoord.length}
        gameState={gameState}
        time={time}
        restartGame={restartGame}
      />
      <div className={styles.board}>
        {cells.map((innerCells, row) =>
          innerCells.map((cell, col) => (
            <Cell
              key={row * 16 + col}
              value={cell.value}
              isOpen={cell.isOpen}
              row={row}
              col={col}
              filled={filled}
              firstFill={firstFill}
              openCells={updateSells}
              bombFail={bombFail}
              gameState={gameState}
              updateGuessBombsCoord={updateGuessBombsCoord}
              index={row * 16 + col}
              upDateGameState={upDateGameState}
            />
          ))
        )}
      </div>
    </div>
  );
};
