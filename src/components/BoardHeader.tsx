import { useState } from "react";
import { gameStateEnum } from "./Board";
import styles from "./Board.module.css";

export const BoardHeader = ({
  bombsLeft,
  gameState,
  time,
  restartGame,
}: {
  bombsLeft: number;
  gameState: gameStateEnum;
  time: number;
  restartGame: () => void;
}) => {
  time = time > 999 ? 999 : time;
  let nums = [
    "-126px 0",
    "0 0",
    "-14px 0",
    "-28px 0",
    "-42px 0",
    "-56px 0",
    "-70px 0",
    "-84px 0",
    "-98px 0",
    "-112px 0",
  ];
  let smile: { [key in gameStateEnum]: string } = {
    [gameStateEnum.process]: "0 -24px",
    [gameStateEnum.restart]: "0 -24px",
    [gameStateEnum.pressed]: "-54px -24px",
    [gameStateEnum.win]: "-81px -24px",
    [gameStateEnum.fail]: "-108px -24px",
  };
  let [pressedSmile, setPressedSmile] = useState(false);
  let onMouseDown = () => {
    setPressedSmile(true);
  };
  let onClick = () => {
    setPressedSmile(false);
    restartGame();
  };
  return (
    <div className={styles.board_header}>
      <div className={styles.header_nums}>
        {Array.from(
          "0".repeat(3 - bombsLeft.toString().length) + bombsLeft.toString(),
          Number
        ).map((num, ind) => (
          <span key={ind} style={{ backgroundPosition: nums[num] }}></span>
        ))}
      </div>
     <div className={styles.board_smile_container}>
     <div
        className={styles.board_smile}
        style={{
          backgroundPosition: !pressedSmile ? smile[gameState] : "-27px -24px",
        }}
        onMouseDown={onMouseDown}
        onClick={onClick}
      ></div>
     </div>
      <div className={styles.header_nums}>
        {Array.from(
          "0".repeat(3 - time.toString().length) + time.toString(),
          Number
        ).map((num, ind) => (
          <span key={ind} style={{ backgroundPosition: nums[num] }}></span>
        ))}
      </div>
    </div>
  );
};
