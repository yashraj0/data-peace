import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import Users from './components/Users';
import UserDetail from './components/UserDetail';

function App() {
  return (
    <div id = "app-main">
        <Router>
            <Route exact path="/"
              render={ props => <Users {...props}/>}
            />
            <Route path="/user/:id" render={ props => <UserDetail {...props}/>} />
        </Router>
    </div>
  );
}

export default App;
