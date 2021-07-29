import React from 'react';
import Invoice from './pages/Invoice';
import Bank from './pages/Bank';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import { Route, Switch, Redirect } from 'react-router-dom';

export const Routes = () => {
  return (
    <div>
      <Navbar />
      <Switch>
        <Route exact path="/Invoice" component={Invoice} />
        <Route exact path="/">
          <Redirect to="/Invoice" />
        </Route>
        <Route exact path="/Bank" component={Bank} />
        <Route exact path="/Login" component={Login} />
      </Switch>
    </div>
  );
};