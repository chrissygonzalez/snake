import { useState } from 'react'
import Board from './components/Board'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div><Board /></div>
  )
}

export default App
