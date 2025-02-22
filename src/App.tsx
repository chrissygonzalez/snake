import './App.css';
import Board from './components/Board';

function App() {
  return (
    <div className="game">
      <img className="title" alt="SNAKE" src="snake.svg"></img>
      <Board />
    </div>
  )
}

export default App
