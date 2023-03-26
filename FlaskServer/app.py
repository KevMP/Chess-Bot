from flask import Flask, request, render_template, jsonify
from flask_cors import CORS

from stockfish import Stockfish
import chess
import json


app = Flask(__name__)

board = chess.Board()
stockfish = Stockfish(path="C:/Users/kevin/Desktop/FlaskServer/stockfish_15.1_win_x64_avx2/stockfish-windows-2022-x86-64-avx2.exe", depth=10, parameters={"Threads": 4, "Minimum Thinking Time": 0.5})

stockfish.set_fen_position(board.fen())
nextBestMove = stockfish.get_best_move()
evaluation = stockfish.get_evaluation()

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/moveMade', methods = ['POST'])
def moveMade():
    global nextBestMove, evaluation


    data = json.loads(request.data)

    if data['reset'] == True:
        board.reset()
        return 'Success'

    
    moveObj = board.parse_san(data['move'])
    board.push(moveObj)
    stockfish.set_fen_position(board.fen())
    nextBestMove = stockfish.get_best_move()
    evaluation = stockfish.get_evaluation()
    print(nextBestMove)

    return nextBestMove


@app.route('/getMove', methods = ['GET'])
def getMove():
    print(nextBestMove)
    data = {
        'nextMove' : nextBestMove,
        'evalData' : evaluation    
    }
    return jsonify(data)

@app.route('/reset', methods = ['POST'])
def reset():
    board.reset()
    stockfish.set_fen_position(board.fen())
    return 'Success'

CORS(app)

if __name__ == '__main__':
    app.run(debug=False)
