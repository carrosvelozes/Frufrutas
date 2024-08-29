// src/components/Sobre.js
import React from 'react';
import '../styles/sobre.css';
import apresentacaoIMG from '../img/apresentacao.jpg';

const Sobre = () => (
  <main>
    <div className="container">
    <img src={apresentacaoIMG} className="image-section" alt="Apresentacao" />
      <div className="info-section">
        <h2>Sobre o Frufrutas</h2>
        <p>Bem-vindo ao Frufrutas. Projeto desenvolvido pelos alunos Lucas da Silva Carvalho e Leonardo Souza Faria de Moraes como parte da disciplina Web do curso superior de TADS do Instituto Federal de Ciência e Educação</p>
        <div className="contact">
          <h3>Contato</h3>
          <p>lucas.carvalho@aluno.ifsp.edu.br</p>
          <p>moraes.souza@aluno.ifsp.edu.br</p>
        </div>
      </div>
    </div>
  </main>
);

export default Sobre;
