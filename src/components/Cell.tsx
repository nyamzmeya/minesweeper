import { MouseEventHandler, useEffect, useState } from "react";
import { gameStateEnum } from "./Board";
import styles from "./Board.module.css";

export const Cell = ({
  value,
  row,
  col,
  firstFill,
  filled,
  openCells,
  isOpen,
  bombFail,
  gameState,
  updateGuessBombsCoord,
  upDateGameState,
  index,
}: {
  value: number;
  row: number;
  col: number;
  filled: boolean;
  gameState: gameStateEnum;
  isOpen: boolean;
  firstFill: (row: number, col: number) => void;
  openCells: (row: number, col: number) => void;
  bombFail: (row: number, col: number) => void;
  updateGuessBombsCoord: (key: number, add: boolean) => void;
  upDateGameState: (state: gameStateEnum) => void;
  index: number;
}) => {
  let modes = {
    initial: "0px -51px",
    mouseDown: "-17px -51px",
    flag: "-34px -51px",
    question: "-51px -51px",
    questionPressed: "-68px -51px",
    bomdRed: "-102px -51px",
    bombWrong: "-119px -51px",
  };
  let values = [
    "-85px -51px",
    "-17px -51px",
    "0px -68px",
    "-17px -68px",
    "-34px -68px",
    "-51px -68px",
    "-68px -68px",
    "-85px -68px",
    "-102px -68px",
    "-119px -68px",
  ];
  let [state, setState] = useState(modes.initial);
  useEffect(() => {
    if (value !== -1 && state === modes.flag) {
      setState(modes.bombWrong);
    }
  }, [gameState === gameStateEnum.fail]);
  useEffect(() => {
    setState(modes.initial);
    upDateGameState(gameStateEnum.process)
  }, [gameState === gameStateEnum.restart]);
  let onMouseDown: MouseEventHandler = (event) => {
    // only if closed
    if (!isOpen && gameState !== gameStateEnum.fail && gameState !== gameStateEnum.win) {
      // first right click
      if (event.button === 2 && state === modes.initial) {
        setState(modes.flag);
        updateGuessBombsCoord(index, true);
      }
      // second right click
      if (event.button === 2 && state === modes.flag) {
        setState(modes.question);
        updateGuessBombsCoord(index, false);
      }
      // third right click
      if (event.button === 2 && state === modes.question) {
        setState(modes.questionPressed);
      }
      // open
      if (event.button !== 2 && state === modes.initial) {
        if (!filled) {
          firstFill(row, col); // fill bombs
        }
        setState(modes.mouseDown); // set pressed
        upDateGameState(gameStateEnum.pressed);
      }
    }
  };
  let onMouseUp: MouseEventHandler = () => {
    if (state === modes.questionPressed) {
      setState(modes.initial);
    }
  };
  let onClick = () => {
    // remove question
    if (gameState !== gameStateEnum.fail && gameState !== gameStateEnum.win) {
      if (state === modes.mouseDown) {
        if (value === -1) {
          setState(modes.bomdRed); // bomb
          bombFail(row, col);
        } else {
          openCells(row, col);
          upDateGameState(gameStateEnum.process);
        }
      }
    }
  };
  return (
    <span
      className={styles.cell}
      onMouseDown={onMouseDown}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        backgroundPosition: isOpen ? values[value + 1] : state,
      }}
      onClick={onClick}
      onMouseUp={onMouseUp}
    ></span>
  );
};
