import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/home";
import Game from "./pages/game";
import Heroes from "./pages/heroes";

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="heroes" element={<Heroes />} />
            <Route path="game" element={<Game />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
