// src/components/Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.js'; // Importe o Firebase auth

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login realizado com sucesso!');
      
      // Armazene o e-mail do usuário no localStorage
      localStorage.setItem('userEmail', email);
      
      // Redirecione para home.html
      window.location.href = '/';
    } catch (error) {
      console.error('Erro no login:', error.message);
      setMessage(error.message);
    }
  };

  return (
    <main>
      <section>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <button type="submit" id="btn-login">Entrar</button>
        </form>
        <p id="loginMessage">{message}</p>
      </section>
    </main>
  );
};

export default Login;
