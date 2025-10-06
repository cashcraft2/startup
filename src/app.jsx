import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  return (
    <div>
        <header>
            <nav>
                <menu className="navbar-nav">
                    <a className="nav-sign-in" href="index.html">Sign In</a>
                </menu>
            </nav>
        </header>

        <main> App components go here</main>

        <footer>
            <div>
                <span className="author"> Author: </span>
                <a href="https://github.com/cashcraft2/startup">Cotter Ashcraft</a>
            </div>
        </footer>
    </div>
  );
}