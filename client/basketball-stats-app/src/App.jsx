import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import DataEntry from './components/DataEntry';
import Visualization from './components/Visualization';
import ShotStats from './components/ShotStats';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/about" component={About} />
        <Route path="/data-entry" component={DataEntry} />
        <Route path="/visualization" component={Visualization} />
        <Route path="/shot-stats" component={ShotStats} />
      </Switch>
    </Router>
  );
}