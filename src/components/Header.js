// src/components/Header.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import logoImg from '../img/logo.png';
import userImg from '../img/userimg.png';
import '../styles/styles.css';

const Header = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Logout realizado com sucesso!');
      navigate('/login'); // Redireciona para a página de login após o logout
    } catch (error) {
      console.error('Erro no logout:', error.message);
    }
  };

  return (
    <header>
      <nav>
        <div className="header-content">
          <div className="logo">
            <img src={logoImg} alt="Imagem da Logo" />
          </div>
          <ul className="menu">
            <li><Link to="/">Início</Link></li>
            <li><Link to="/sobre">Sobre</Link></li>
            {user && user.email === 'admin@email.com' && (
              <li><Link to="/cadastro">Cadastro</Link></li>
            )}
          </ul>
          <div className="login-area">
            {user ? (
              <div className="user-info">
                <img src={userImg} alt="Imagem do Usuário" className="user-img" />
                <span>{user.email}</span>
                <button onClick={handleLogout} className="logout-button">Sair</button>
              </div>
            ) : (
              <Link to="/login" id="loginLink" className="menu-item">Login</Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
