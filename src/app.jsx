import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Signin } from './signin/signin';
import { Home } from './home/home';
import { Log } from './log/log';
import { Plan } from './plan/plan';

export default function App() {
    return (
      <BrowserRouter>
        <div>
            <header>
                <nav>
                    <menu className="navbar-nav">
                        <NavLink className="nav-sign-in" to="signin">Sign In</NavLink>
                    </menu>
                </nav>
            </header>

            <Routes>
                <Route path='/' element={<Signin />} exact />
                <Route path='/home' element={<Home />} />
                <Route path='/log' element={<Log />} />
                <Route path='/plan' element={<Plan />} />
                <Route path='*' element={<NotFound />} />
            </Routes>

            <footer>
                <div>
                    <span className="author"> Author: </span>
                    <NavLink to="https://github.com/cashcraft2/startup">Cotter Ashcraft</NavLink>
                </div>
            </footer>
        </div>
      </BrowserRouter>
    );
  }

  function NotFound() {
    return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
  }