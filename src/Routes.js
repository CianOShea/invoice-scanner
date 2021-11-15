import React from 'react';
import Home from './pages/Home';
import Invoice from './pages/Invoice';
import Statement from './pages/Statement';
import id from './pages/[id]';
import CreateTemplate from './pages/CreateTemplate';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import { Route, Switch, Redirect, HashRouter, useLocation } from 'react-router-dom';

import Sidebar from './components/Sidebar';

export const Routes = () => {

  return (
    <HashRouter>
    <div>
      {/* <Navbar /> */}
      <Sidebar/>
      <Switch>
        {/* <Route exact path="/Home" component={Home} /> */}        
        <Route exact path="/Invoice" component={Invoice} />       
        <Route exact path="/">
          <Redirect to="/Invoice" />
        </Route> 
        <Route exact path="/Statement" component={Statement} />
        <Route exact path="/CreateTemplate" component={CreateTemplate} />
        <Route exact path="/Login" component={Login} />
        <Route exact path="/:id" component={id} />        
      </Switch>
    </div>
    </HashRouter>
  );
};