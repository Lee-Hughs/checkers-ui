import React from 'react'
import { useState } from 'react'

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            /*
            * 0 = empty
            * 1 = black draught
            * 2 = black king
            * 3 = red draught
            * 4 = red king
            */
            board: [
                [0, 1, 0, 1, 0, 1, 0, 1],
                [1, 0, 1, 0, 1, 0, 1, 0],
                [0, 1, 0, 1, 0, 1, 0, 1],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [3, 0, 3, 0, 3, 0, 3, 0],
                [0, 3, 0, 3, 0, 3, 0, 3],
                [3, 0, 3, 0, 3, 0, 3, 0],
            ],
            yourTurn: true,
            msg: "Let's Play A Game!",
            selectedSquare: null,
            highlights: [],
            doubleJumping: false,
            jumping: false,
        }
    }

    handleClick(x, y) {
        console.log([x, y]);
        console.log(this.state)
        // Is it your turn?
        if(!this.state.yourTurn)
            return;
        // Selected an invalid square
        if(this.state.selectedSquare == null && this.state.board[x][y] != 3 && this.state.board[x][y] != 4) {
            return;
        }
        // have you already selected a piece?
        if(this.state.selectedSquare == null) {
            const newHighlights = [];
            const newSelectedSquare = [x,y];
            newHighlights.push(...this.getValidMoves(x,y))
            this.setState({highlights: newHighlights, selectedSquare: newSelectedSquare})
            return;
        }
        // You are DoubleJumping and select invalid move
        if(this.state.doubleJumping) {
            // TODO: If x,y is highlighted, execute, otherwise display error message and return
            if(this.state.highlights.map(x => x.toString()).indexOf([x,y].toString()) == -1) {
                const msg = "You have another jump to make!";
                this.setState({msg: msg});
                return;
            }
        }
        // deselecting current piece - TODO: See if the block can go away
        if(this.state.selectedSquare.toString() == [x,y].toString()) {
            const newHighlights = [];
            const newSelectedSquare = null;
            this.setState({highlights: newHighlights, selectedSquare: newSelectedSquare});
            return;
        }
        // Execute a move
        for(let i=0; i<this.state.highlights.length; i++) {
            if(this.state.highlights[i].toString() == [x,y].toString()) {
                this.executeMove(this.state.selectedSquare, [x,y]);
                return;
            }
        }
        // Selected an invalid square
        const newHighlights = [];
        const newSelectedSquare = null;
        this.setState({highlights: newHighlights, selectedSquare: newSelectedSquare});
        return;
    }

    getValidMoves(x,y) {
        let validMoves = [];
        // Check Left
        if(x-1 >= 0 && y-1 >= 0 && this.state.board[x-1][y-1] == 0 && !this.state.jumping) {
            validMoves.push([x-1, y-1]);
        }
        // Check Right
        if(x-1 >= 0 && y+1 <= 7 && this.state.board[x-1][y+1] == 0 && !this.state.jumping) {
            validMoves.push([x-1, y+1]);
        }
        // Check Left Jump
        if(x-2 >= 0 && y-2 >= 0 && this.state.board[x-2][y-2] == 0) {
            if(this.state.board[x-1][y-1] == 1 || this.state.board[x-1][y-1] == 2) {
                validMoves.push([x-2, y-2]);
            }
        }
        // Check Right Jump
        if(x-2 >= 0 && y+2 <= 7 && this.state.board[x-2][y+2] == 0) {
            if(this.state.board[x-1][y+1] == 1 || this.state.board[x-1][y+1] == 2) {
                validMoves.push([x-2, y+2]);
            }
        }
        // Moving King Backwards
        if(this.state.board[x][y] == 4) {
            // Check Left Backwards
            if(x+1 <= 7 && y-1 >= 0 && this.state.board[x+1][y-1] == 0 && !this.state.jumping) {
                validMoves.push([x+1, y-1]);
            }
            // Check Right Backwards
            if(x+1 <= 7 && y+1 <= 7 && this.state.board[x+1][y+1] == 0 && !this.state.jumping) {
                validMoves.push([x+1, y+1]);
            }
            // Check Left Jump Backwards
            if(x+2 <= 7 && y-2 >= 0 && this.state.board[x+2][y-2] == 0) {
                if(this.state.board[x+1][y-1] == 1 || this.state.board[x+1][y-1] == 2) {
                    validMoves.push([x+2, y-2]);
                }
            }
            // Check Right Jump Backwards
            if(x+2 <= 7 && y+2 <= 7 && this.state.board[x+2][y+2] == 0) {
                if(this.state.board[x+1][y+1] == 1 || this.state.board[x+1][y+1] == 2) {
                    validMoves.push([x+2, y+2]);
                }
            }
        }
        return validMoves;
    }

    // Returns True if a Jump exists, otherwise returns False
    findJump(newBoard) {
        for(let x=0; x < 8; x++) {
            for(let y=0; y < 8; y++) {
                // Is it not your piece?
                if(newBoard[x][y] != 3 && newBoard[x][y] != 4)
                    continue;
                // Check Left
                if(x-2 >= 0 && y-2 >= 0 && newBoard[x-2][y-2] == 0) {
                    if(newBoard[x-1][y-1] == 1 || newBoard[x-1][y-1] == 2) {
                        return true
                    }
                }
                // Check Right
                if(x-2 >= 0 && y+2 <= 7 && newBoard[x-2][y+2] == 0) {
                    if(newBoard[x-1][y+1] == 1 || newBoard[x-1][y+1] == 2) {
                        return true;
                    }
                    
                }
                // Check Left Backwards
                if(x+2 <= 7 && y-2 >= 0 && newBoard[x+2][y-2] == 0 && newBoard[x][y] == 4) {
                    if(newBoard[x+1][y-1] == 1 || newBoard[x+1][y-1] == 2) {
                        return true
                    }
                }
                // Check Right Backwards
                if(x+2 <= 7 && y+2 <= 7 && newBoard[x+2][y+2] == 0 && newBoard[x][y] == 4) {
                    if(newBoard[x+1][y+1] == 1 || newBoard[x+1][y+1] == 2) {
                        return true;
                    }
                    
                }
            }
        }
        return false;
    }

    executeMove(src, dst) {
        console.log("Executing move");
		let newBoard = [];
		for(let index = 0; index < 8; index++) {
			newBoard.push(this.state.board[index].slice());
		}
        newBoard[dst[0]][dst[1]] = newBoard[src[0]][src[1]];
        newBoard[src[0]][src[1]] = 0;
        // If you are Jumping
        if(Math.abs(src[0]-dst[0]) == 2) {
            let newHighlights = []
            newBoard[(dst[0]+src[0])/2][(dst[1]+src[1])/2] = 0;
            // Check Left Double Jump
            if(dst[0]-2 >= 0 && dst[1]-2 >= 0 && newBoard[dst[0]-2][dst[1]-2] == 0) {
                if(newBoard[dst[0]-1][dst[1]-1] == 1 || newBoard[dst[0]-1][dst[1]-1] == 2) {
                    newHighlights.push([dst[0]-2, dst[1]-2]);
                }
            }
            // Check Right Double Jump
            if(dst[0]-2 >= 0 && dst[1]+2 <= 7 && newBoard[dst[0]-2][dst[1]+2] == 0) {
                if(newBoard[dst[0]-1][dst[1]+1] == 1 || newBoard[dst[0]-1][dst[1]+1] == 2) {
                    newHighlights.push([dst[0]-2, dst[1]+2]);
                }
            }
            // If King
            if(newBoard[dst[0]][dst[1]] == 4) {
                // Check Backwards Left Jump
                if(dst[0]+2 <= 7 && dst[1]-2 >= 0 && newBoard[dst[0]+2][dst[1]-2] == 0) {
                    if(newBoard[dst[0]+1][dst[1]-1] == 1 || newBoard[dst[0]+1][dst[1]-1] == 2) {
                        newHighlights.push([dst[0]+2, dst[1]-2]);
                    }
                }
                // Check Backwards Right Jump
                if(dst[0]+2 <= 7 && dst[1]+2 <= 7 && newBoard[dst[0]+2][dst[1]+2] == 0) {
                    if(newBoard[dst[0]+1][dst[1]+1] == 1 || newBoard[dst[0]+1][dst[1]+1] == 2) {
                        newHighlights.push([dst[0]+2, dst[1]+2]);
                    }
                }
            }
            // King me
            if(dst[0] == 0) {
                newBoard[dst[0]][dst[1]] = 4;
            }
            // Check if other jumps were found
            if(newHighlights.length > 0) {
                this.setState(
                    {
                        board: newBoard,
                        highlights: newHighlights,
                        selectedSquare: [dst[0], dst[1]],
                        doubleJumping: true
                    });
                return;
            }
        }
        // King me
        if(dst[0] == 0) {
            newBoard[dst[0]][dst[1]] = 4;
        }
        this.setState({board: newBoard, selectedSquare: null, highlights: [], yourTurn: false, msg: "My Turn!"});
        this.executeBotMove();
        return;
    }

    // Bot related functions


    async executeBotMove() {
        console.log("Start sleep");
        await new Promise(r => setTimeout(r, 2000));
        console.log("End sleep");
        this.setState({yourTurn: true, jumping: this.findJump(this.state.board), msg: "Your Turn!"});
    }

    renderRow(i) {
        return (
            <Row 
                key={`row-${i}`}
                rowNumber={i} 
                onClick={(x,y) => this.handleClick(x,y)}
                pieces={this.state.board[i]} 
                highlights={this.state.highlights.filter(arr => arr[0] == i).map(h => h[1])}
                selectedSquare={this.state.selectedSquare}
            />
        )
    }

    render() {
        let rows = []
        for (let i=0; i < 8; i++) {
            rows.push(this.renderRow(i));
        }
        return (
            <>
            <p>{this.state.msg}</p>
            <div className="Board">
                {rows}
            </div>
            </>
        )
    }
}

function Row(props) {
    let squares = [];
    for (let i=0; i < 8; i++) {
        let className = "square";
        if(props.highlights.indexOf(i) != -1) {
            className += " highlighted";
        }
        if(props.selectedSquare != null && props.selectedSquare.toString() == [props.rowNumber, i]) {
            className += " selected";
        }
        squares.push(
            <div key={`square-${props.rowNumber}-${i}`} onClick={() => props.onClick(props.rowNumber,i)} className={className}>{props.pieces[i]}</div>
        );
    }
    return (
        <div className="row">
            {squares}
        </div>
    )
}

export default Board
