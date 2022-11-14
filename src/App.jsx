import { useState } from 'react'
import reactLogo from './assets/react.svg'
import Board from './Board'
import './App.css'
import './Board.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <p>Open</p>
        <Board />
      <p>Close</p>
    </div>
  )
}

export default App
