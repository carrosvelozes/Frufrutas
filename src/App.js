// src/App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Cadastro from './components/Cadastro';
import Login from './components/Login';
import Sobre from './components/Sobre';
import './styles/styles.css';

const App = () => (
  <Router>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sobre" element={<Sobre />} />
    </Routes>
    <Footer />
  </Router>
);

export default App;
