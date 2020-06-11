import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./views/home/index";
import Login from "./views/login/index";
import './App.scss';



function App() {
  return (
    <div className="app" >
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/" component={Home}></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
