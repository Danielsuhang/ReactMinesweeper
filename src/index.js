import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import PropTypes from 'prop-types';

class Cell extends React.Component {
    getValue() {
        //Desconstructing in Javascript, pulling an element out of an obj
        const {value} = this.props;

        if (!value.isRevealed) {
            return this.props.value.isFlagged ? "F" : null;
        }
        if (value.isMine) {
            return "M";
        }
        //If number of neighbouring cell's is 0, return null
        if (value.neighbour === 0) {
            return null;
        }
        return value.neighbour;
    }
    render() {
        // const {value, onClick, cMenu} = this.props;
        return (
            <div
                onClick={this.props.onClick}
                onContextMenu = {this.props.cMenu}
                >
                {this.getValue()}
                </div>
        );
    }
}
const cellItemShape = {
    isRevealed: PropTypes.bool,
    isMine: PropTypes.bool,
    isFlagged: PropTypes.bool
 }
Cell.propTypes = {
    value: PropTypes.objectOf(PropTypes.shape(cellItemShape)),
    onClick: PropTypes.func,
    cMenu: PropTypes.func
  }



class Board extends React.Component {
    state = {
        // boardData: this.initBoardData(this.props.height,
        //     this.props.width, this.props.mine),
        gameStatus: false,
        mineCount: this.props.mines
    };
    createEmptyArray(height, width) {
        let data = [];
        for (let i = 0; i < height; i++) {
            data.push([]);
            for (let j = 0; j < width; j++) {
                data[i][j] = {
                    x: i,
                    y: j,
                    isMine: false,
                    isFlagged: false,
                    neighbour: 0,
                    isEmpty: false,
                };
            }
        }
        return data;
    }
    plantMines(data, height, width, mines) {
        let randomx, randomy, minesPlanted = 0;
        while (minesPlanted < mines) {
            randomx = getRandomInt(0, width);
            randomy = getRandomInt(0, height);

            if (!data[randomx][randomy].isMine) {
                data[randomx][randomy].isMine = true;
                minesPlanted++;
            }
        }
        return data;
    }
    /*
    * Gets all cell around width and height which is not a mine
    */
    getNeighbours(data, width, height) {
        let updatedData = data;
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                let mines = 0;
                if (!updatedData[i][j].isMine) {
                    const area = 
                        this.traverseNeighbourCells(data, i, j);
                    area.map(value => {
                        if (value.isMine) {
                            mines++;
                        }
                    });
                    if (mines === 0) {
                        updatedData[i][j].isEmpty = true;
                    }
                    updatedData[i][j].neighbour = mines;
                }
            }
        }
    }
    traverseNeighbourCells(data, width, height) {
        const adj = []
        if (width > 0) {
            adj.push(data[width - 1][height]);
        }
        if (width < data.length) {
            adj.push(data[width + 1][height]);
        }
        if (height > 0) {
            adj.push(data[width][height - 1]);
        }
        if (height < data[width].length) {
            adj.push(data[width][height + 1]);
        }
        if (width > 0 && height > 0) {
            adj.push(data[width - 1][height - 1]);
        }
        if (width > 0 && height < data[width].length) {
            adj.push(data[width - 1][height + 1]);
        }
        if (width < data.length && height > 0) {
            adj.push(data[width + 1][height - 1]);
        }
        if (width < data.length && height < data[width].length) {
            adj.push(data[width + 1][height + 1]);
        }
    }
    render() {
        return (
            <div className="board"> 
                <div className="game-info">
                   <span className="info">
                        mines: {this.state.mineCount}
                   </span> 
                   <br />
                   <span className="info"> 
                    {this.state.gameStatus}
                    </span>
                </div>
                {/* {this.renderBoard(this.state.boardData)} */}
            </div>
        );

    }
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Type checking with PropTypes
Board.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    mine: PropTypes.number,
}

// ========================================
  
ReactDOM.render(
    <Board />,
    document.getElementById('root')
  );