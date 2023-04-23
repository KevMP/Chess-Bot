from flask import Flask, request, render_template, jsonify
from flask_cors import CORS

from stockfish import Stockfish
import chess
import json
import random


app = Flask(__name__)

board = chess.Board()
stockfish = Stockfish(path="C:/Users/kevin/Desktop/Chess-Enhancer/stockfish_15.1_win_x64_avx2/stockfish-windows-2022-x86-64-avx2.exe", 
                      depth=10, 
                      parameters={"Threads": 6, "Minimum Thinking Time": 0.5}
                      )

stockfish.set_fen_position(board.fen())
print(stockfish.get_parameters())
nextBestMove = stockfish.get_best_move()



@app.route('/')
def index():
    return render_template('index.html')


@app.route('/moveMade', methods = ['POST'])
def moveMade():
    data = json.loads(request.data)

    moveObj = board.parse_san(data['move'])
    board.push(moveObj)
    return 'Success'


@app.route('/getMove', methods = ['GET'])
def getMove():
    global nextBestMove
    currentDepth = random.randint(1500, 2000)
    stockfish.set_fen_position(board.fen())
    stockfish.set_elo_rating(currentDepth)
    nextBestMove = stockfish.get_best_move()

    data = {
        'nextMove' : nextBestMove,
    }
    return jsonify(data)

@app.route('/reset', methods = ['POST'])
def reset():
    global board, stockfish
    board.reset()
    stockfish.set_fen_position(board.fen())
    return 'Success'

CORS(app)

if __name__ == '__main__':
    app.run(debug=False)
