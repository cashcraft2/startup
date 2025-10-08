import React from 'react';

export function Signin() {
  return (
    <main>
        <div className="outfishn-main-logo">
            <img src="/pics/logo/outfishn_cropped_logo.png" alt="OutFishn Logo"/>
        </div>
        <div className="register-sign-in">
            <div className="register-section">
                <h1>Register</h1>
                <form method="get" action="home.html">
                    <div>
                        <span>Email: </span>
                        <input type="text" placeholder="your@email.com" />
                    </div>
                    <div>
                        <span>Password: </span>
                        <input type="password" placeholder="password" />
                    </div>
                    <div>
                        <span>Confirm Password: </span>
                        <input type="password" placeholder="password" />
                    </div>
                    <button type="submit">Register</button>
                </form>
            </div>
            <div className="sign-in-section">
                <h1>Sign In</h1>
                <form method="get" action="home.html">
                    <div>
                        <span>Email: </span>
                        <input type="text" placeholder="your@email.com" />
                    </div>
                    <div>
                        <span>Password: </span>
                        <input type="password" placeholder="password" />
                    </div>
                    <button type="submit">Sign In</button>
                </form>
            </div>
        </div>
    </main>
  );
}