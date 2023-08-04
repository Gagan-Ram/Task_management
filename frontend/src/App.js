import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';

export const config = {
  endpoint: process.env.REACT_APP_WEBSITE_ENDPOINT,
};
console.log(config.endpoint)

function App() {
  return (
    <>
      <Router  >
        <Routes>

          <Route exact path="/" element={ <Home /> } />

        </Routes>
      </Router>
    </>
  );
}

export default App;