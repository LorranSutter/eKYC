import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './pages/Login';
import Client from './pages/Client';
import Fi from './pages/Fi';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Login} />
        <Route path='/index' exact component={Login} />
        <Route path='/login' exact component={Login} />
        <Route path='/client' exact component={Client} />
        <Route path='/fi' exact component={Fi} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
