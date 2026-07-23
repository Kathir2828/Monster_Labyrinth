import './Cell.css';
import { useState } from 'react';
import React from 'react';

function Cell({ cell, option, setGrid }) {

  let extraClass = '';
  if (cell.option[0] == 1) extraClass = 'cell-goblin';
  else if (cell.option[1] == 1) extraClass = 'cell-orc';
  else if (cell.option[2] == 1) extraClass = 'cell-wall';
  else if (cell.option[3] == 1) extraClass = 'cell-start';
  else if (cell.option[4] == 1) extraClass = 'cell-exit';

  const cellClick = () => {


    setGrid((prevGrid) => {
      const copy = prevGrid.map(row => row.map(cell => ({ ...cell, option: [...cell.option] })));
      const newCell = copy[cell.i][cell.j];

      let prevOption = -1, currOption = -1;

      for (let i = 0; i < 5; i++) {
        if (newCell.option[i] == 1) prevOption = i;
        if (option[i] == 1) currOption = i;
      }

      if (prevOption == currOption) newCell.option[prevOption] = 0;
      else {
        newCell.option[prevOption] = 0;
        newCell.option[currOption] = 1;
      }
      return copy;
    });

  }


  return (
    <div onClick={cellClick} className={`cell ${extraClass}`}>
    </div>
  )
};
// React.memo tells React: "Only re-render this specific cell if its props change!"
export default React.memo(Cell);