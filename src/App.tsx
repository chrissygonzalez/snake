import './App.css';
import Board from './components/Board';

function App() {
  return (
    <div className="game--container">
      <img alt="SNAKE" src="snake.svg"></img>
      <Board />
    </div>
  )
}

export default App
