import React, { useState, useEffect } from 'react';
import '../styles/cadastro.css';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAXZ9cv0SxLiahjdOjArRtlAO_O1tEa5Bk",
  authDomain: "aulaweb-f4d36.firebaseapp.com",
  projectId: "aulaweb-f4d36",
  storageBucket: "aulaweb-f4d36.appspot.com",
  messagingSenderId: "792554501068",
  appId: "1:792554501068:web:90f6950d8c4fc0ab962369"
};

// Inicialize o Firebase
initializeApp(firebaseConfig);

const Cadastro = () => {
  const [mensagem, setMensagem] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    imagem: ''
  });
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    // Função para carregar a lista de produtos
    const carregarProdutos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'produtos'));
        const listaProdutos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProdutos(listaProdutos);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      }
    };

    carregarProdutos();
  }, []);

  const handleCadastroPessoa = async (event) => {
    event.preventDefault();

    const email = event.target.emailPessoa.value;
    const senha = event.target.senhaPessoa.value;

    try {
      if (!email || !senha) {
        throw new Error('E-mail e senha são obrigatórios.');
      }

      await createUserWithEmailAndPassword(auth, email, senha);
      setMensagem('Cadastro realizado com sucesso!');
      setTimeout(() => setMensagem(''), 5000);
    } catch (error) {
      setMensagem(`Erro no cadastro: ${error.message}`);
    }
  };

  const handleCadastroProduto = async (event) => {
    event.preventDefault();

    const nome = event.target.nome.value;
    const descricao = event.target.descricao.value;
    const preco = parseFloat(event.target.preco.value);
    const imagem = event.target.imagem.value;

    try {
      await setDoc(doc(db, 'produtos', nome), {
        nome,
        descricao,
        preco,
        imagem: imagem || ''
      });

      setMensagem('Produto cadastrado com sucesso!');
      setTimeout(() => setMensagem(''), 5000);

      // Atualiza a lista de produtos
      const querySnapshot = await getDocs(collection(db, 'produtos'));
      const listaProdutos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProdutos(listaProdutos);
    } catch (error) {
      setMensagem(`Erro ao cadastrar produto: ${error.message}`);
    }
  };

  const handleAtualizarProduto = async (event) => {
    event.preventDefault();

    const { nome, descricao, preco, imagem } = formData;

    try {
      await setDoc(doc(db, 'produtos', nome), {
        nome,
        descricao,
        preco: parseFloat(preco),
        imagem: imagem || ''
      });

      setMensagem('Produto atualizado com sucesso!');
      setTimeout(() => setMensagem(''), 5000);

      // Atualiza a lista de produtos
      const querySnapshot = await getDocs(collection(db, 'produtos'));
      const listaProdutos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProdutos(listaProdutos);

      // Limpa o produto editando
      setProdutoEditando(null);
      setFormData({
        nome: '',
        descricao: '',
        preco: '',
        imagem: ''
      });
    } catch (error) {
      setMensagem(`Erro ao atualizar produto: ${error.message}`);
    }
  };

  const handleDeletarProduto = async (id) => {
    try {
      await deleteDoc(doc(db, 'produtos', id));
      setMensagem('Produto deletado com sucesso!');
      setTimeout(() => setMensagem(''), 5000);

      // Atualiza a lista de produtos
      const querySnapshot = await getDocs(collection(db, 'produtos'));
      const listaProdutos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProdutos(listaProdutos);
    } catch (error) {
      setMensagem(`Erro ao deletar produto: ${error.message}`);
    }
  };

  const handleEditClick = (produto) => {
    setProdutoEditando(produto);
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      imagem: produto.imagem
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <main>
      <section id="cadastro-consumidor">
        <h2>Cadastro de Consumidor</h2>
        <form id="cadastroPessoaForm" onSubmit={handleCadastroPessoa}>
          <label htmlFor="emailPessoa">E-mail:</label>
          <input type="email" id="emailPessoa" name="emailPessoa" required /><br />

          <label htmlFor="senhaPessoa">Senha:</label>
          <input type="password" id="senhaPessoa" name="senhaPessoa" required /><br />

          <button type="submit" id="btn-cadastro">Cadastrar</button>
        </form>
      </section>

      <section id="cadastro-produto">
        <h2>Cadastro de Produto</h2>
        <form id="cadastroProduto" onSubmit={handleCadastroProduto}>
          <label htmlFor="nome">Nome:</label>
          <input type="text" id="nome" name="nome" required />

          <label htmlFor="descricao">Descrição:</label>
          <input type="text" id="descricao" name="descricao" required />

          <label htmlFor="preco">Preço:</label>
          <input type="text" id="preco" name="preco" step="0.01" required />

          <label htmlFor="imagem">URL da Imagem:</label>
          <input type="text" id="imagem" name="imagem" />

          <button type="submit" id="btn-cadastro">Cadastrar Produto</button>
        </form>
      </section>

      <section id="lista-produtos">
        <h2>Lista de Produtos</h2>
        {produtos.length > 0 ? (
          <ul>
            {produtos.map(produto => (
              <li key={produto.id}>
                <strong>{produto.nome}</strong><br />
                Descrição: {produto.descricao}<br />
                Preço: {produto.preco}<br />
                <img src={produto.imagem} alt={produto.nome} width="100" /><br />
                <button onClick={() => handleEditClick(produto)}>Editar</button>
                <button onClick={() => handleDeletarProduto(produto.id)}>Deletar</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum produto cadastrado.</p>
        )}
      </section>

      {produtoEditando && (
        <section id="editar-produto">
          <h2>Editar Produto</h2>
          <form onSubmit={handleAtualizarProduto}>
            <label htmlFor="nome">Nome:</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              required
            /><br />

            <label htmlFor="descricao">Descrição:</label>
            <input
              type="text"
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              required
            /><br />

            <label htmlFor="preco">Preço:</label>
            <input
              type="text"
              id="preco"
              name="preco"
              step="0.01"
              value={formData.preco}
              onChange={handleInputChange}
              required
            /><br />

            <label htmlFor="imagem">URL da Imagem:</label>
            <input
              type="text"
              id="imagem"
              name="imagem"
              value={formData.imagem}
              onChange={handleInputChange}
            /><br />

            <button type="submit" id="btn-atualizar">Atualizar Produto</button>
          </form>
        </section>
      )}

      {mensagem && <div className="mensagem-sucesso">{mensagem}</div>}
    </main>
  );
};

export default Cadastro;
