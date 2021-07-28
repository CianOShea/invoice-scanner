import React from 'react';
import Invoice from './pages/Invoice';
import Bank from './pages/Bank';
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
      </Switch>
    </div>
  );
};