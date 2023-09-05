import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/



const Board = ({ nrows=5, ncols=5 }) => {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide with each cell randomly lit or unlit */
  function createBoard() {

    const initialBoard = [];
    
    // The outer 'for' loop creates the row arrays of the board by iterating as many times as 'nrows'. Each iteration pushes the currRow array (which includes 'ncol' number of randomly selected 'true' or 'false' booleans creating the columns of the board i.e. [true, true, true, false, false]) to initialBoard. Then currRow is reset to empty when the next outer loop starts and a new row array is created.
    // Each iteration of the inner 'for' loop pushes a randomly generated true or false boolen to the currRow array as many times as 'ncols' creating the columns of board.

     // Result is a board 'initialBoard' with 5 rows and 5 columns

    // for example intialBoard =   [true, true, true, false, false]
                                // [true, false, false, false, true]
                                // [false, true, true, false, true]
                                // [false, false, false, false, false]
                                // [true, false, false, true, true]

    for (let y=0; y<nrows; y++){
      const currRow = [];
      for (let x=0; x<ncols; x++) { 
        currRow.push(Math.random() > 0.5 ? true : false)
      }
      initialBoard.push(currRow);
    }
    return initialBoard;
  }

   /* Check the board in state to determine whether the player has won */
  function hasWon() {
    // for every row in board, iterate over every cell in row and change the cell from true to false or false to true
   
    return board.every(row => row.every(cell => !cell));
  }

   // Flip cells around a given cell 
  function flipCellsAround(coord) {
    // sets the state of oldBoard (same as initialBoard)
    setBoard(oldBoard => {
      // convert the string coords of the cell clicked on to an array (i.e. 0-4 to [0,4]) 
      const [y, x] = coord.split("-").map(Number);
      // flipcell() checks to make sure the coordinate of the cell clicked on ([y, x]) is on the board and if so, flips the boolean value of the cell from true to false or false to true
      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it (change true to false and false to true)
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          // flip the boolean value of the cell clicked on that has coordinates [y][x] from true to false or false to true
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // TODO: Make a (deep) copy of the oldBoard

      // iterate over each row of OldBoard (the same as initialBoard - before any flipping happens), and create a new 'row' array called 'boardCopy'. This copy will keep the new boolean values after flipping a cell
      const boardCopy = oldBoard.map(row => [...row])
  
      // TODO: in the copy, flip this cell and the cells around it

      // when click on a cell, the boolean value of the cell changes causing the className to change so it's either lit or unlit

      // flips the boolean value of the cell clicked on
      flipCell(y, x, boardCopy);
      // flips the boolean value of the cell to the left of the cell clicked on 
      flipCell(y, x - 1, boardCopy);
      // flips the boolean value of the cell to the right of the cell clicked on
      flipCell(y, x + 1, boardCopy);
      // flips the boolean value of the cell below the cell clicked on
      flipCell(y - 1, x, boardCopy);
      // flips the boolean value of the cell above the cell clicked on
      flipCell(y + 1, x, boardCopy);

      // TODO: return the copy
      return boardCopy;

    });
  }

  // if the game is won, just show a winning msg & render nothing else
  
  if (hasWon()) {
   
    return <div>You Win!</div>;
  }


  // make table board: rows of Cell components

   // The outer 'for' loop sets the value of the board 'y' coordinate. It iterates 'nrows' times. 

  //  The inner 'for' loop sets the value of the board 'x' coordinate and sets 'coord' equal to '(y-x)'. Each inner loop then pushes the Cell component (with coord, isLit and function flipCellsAroundMe as props) to row. 

  // Once the inner loop runs 'ncols' times, the outer loop finishes executing by pushing to the array tblBoard, a table row element <tr> with key={coord} and containing the row created in the inner loop as an object with key/value pairs of key as 'key' and value as 'coord'.

  // The Cell component renders a table cell with a className determined by whether the 'isLit' property is true or false. When clicked, that table cell calls the flipCellsAround function with 'coord' as a prop.


  let tblBoard = [];
  
  for (let y = 0; y < nrows; y++) {
    let row = [];
    for (let x = 0; x < ncols; x++) {
      let coord = `${y}-${x}`;
      
      // each iteration of x pushes to the row array a Cell component containing a table cell object which consists of key as key and its value as {coord} and props isLit and flipCellsAroundMe 
      // i.e. row = [{key:0-0}, {key:0-1}, {key:0-2}, {key:0-3}, {key:0-4}]
      row.push(
        <Cell
          // creates table cell object with key as key and value as {coord}
          key={coord}
          // isLit will equal true or false depending on if the element in the row with coordinate 'board[y][x]' is true or false
          isLit={board[y][x]}
          flipCellsAroundMe={() => flipCellsAround(coord)}
          />
      );
      
    }

    tblBoard.push(<tr key={y}>{row}</tr>);

  // ex. tblBoard =  [
  //                  {type=tr, key=0, [{key:0-0}, {key:0-1}, {key:0-2}, {key:0-3}, {key:0-4}]} 
  //                  {type=tr, key=1, [{key:1-0}, {key:1-1}, {key:1-2}, {key:1-3}, {key:1-4}]}
  //                  {type=tr, key=2, [{key:2-0}, {key:2-1}, {key:2-2}, {key:2-3}, {key:2-4}]}
  //                  {type=tr, key=3, [{key:3-0}, {key:3-1}, {key:3-2}, {key:3-3}, {key:3-4}]}
  //                  {type=tr, key=4, [{key:4-0}, {key:4-1}, {key:4-2}, {key:4-3}, {key:4-4}]}
  //                ]
    
  }

  return (
    <table className="Board">
      <tbody>{tblBoard}</tbody>
    </table>
  );

}

export default Board;
