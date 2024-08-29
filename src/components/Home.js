import React, { useState, useEffect } from 'react';
import '../styles/styles.css';
import { auth, db, collection, getDocs, doc, getDoc, setDoc } from '../firebase';
import apresentacaoIMG1 from '../img/apresentacao.jpg'; // Altere conforme necessário
import apresentacaoIMG2 from '../img/login.jpg'; // Altere conforme necessário
import loginIMG from '../img/login.jpg';

const Home = () => {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [totalCarrinho, setTotalCarrinho] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const apresentacaoIMGS = [
    apresentacaoIMG1,
    apresentacaoIMG2
  ];

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'produtos'));
        const produtosData = querySnapshot.docs.map(doc => doc.data());
        setProdutos(produtosData);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    };

    const carregarCarrinho = async () => {
      if (user) {
        try {
          const docSnap = await getDoc(doc(db, 'carrinhos', user.uid));
          if (docSnap.exists()) {
            setCarrinho(docSnap.data().itens || []);
          }
        } catch (error) {
          console.error("Erro ao carregar carrinho:", error);
        }
      }
    };

    const atualizarLogin = (user) => {
      setUser(user);
      setLoading(false);
    };

    const unsubscribe = auth.onAuthStateChanged(user => {
      atualizarLogin(user);
      if (user) {
        carregarCarrinho();
      }
    });

    carregarProdutos();
    return () => unsubscribe(); // Limpeza do listener
  }, [user]);

  useEffect(() => {
    const calcularTotal = () => {
      const taxaEntrega = 13.00; // Taxa de entrega fixa
      const total = carrinho.reduce((acc, item) => acc + item.preco, 0) + taxaEntrega;
      setTotalCarrinho(total);
    };

    calcularTotal();
  }, [carrinho]);

  const adicionarAoCarrinho = async (nome, preco) => {
    if (!user) {
      alert('Faça login para adicionar produtos ao carrinho.');
      return;
    }

    const novoItem = { nome, preco };
    const novoCarrinho = [...carrinho, novoItem];
    setCarrinho(novoCarrinho);

    try {
      await setDoc(doc(db, 'carrinhos', user.uid), { itens: novoCarrinho });
      console.log(`${nome} foi adicionado ao carrinho.`);
    } catch (error) {
      console.error('Erro ao adicionar item ao carrinho:', error.message);
    }
  };

  const finalizarCompra = async () => {
    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }

    try {
      // Aqui você pode salvar a compra no banco de dados, se necessário
      alert(`Compra finalizada! Total a pagar: R$ ${totalCarrinho.toFixed(2)}`);

      // Limpar o carrinho no banco de dados
      if (user) {
        await setDoc(doc(db, 'carrinhos', user.uid), { itens: [] });
      }

      // Limpar o estado local
      setCarrinho([]);
      setTotalCarrinho(0);
    } catch (error) {
      console.error('Erro ao finalizar a compra:', error.message);
    }
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % apresentacaoIMGS.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + apresentacaoIMGS.length) % apresentacaoIMGS.length);
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <main>
      
      <section id="apresentacao" className="apresentacao-container">
        <button className="carousel-button prev" onClick={handlePrevSlide}>‹</button>
        <div className="card-apresentacao">
          <img src={apresentacaoIMGS[currentSlide]} className="image-section" alt="Apresentacao" />
          <div className="card-content">
            <h2>Bem-vindo ao Frufrutas</h2>
            <p>Entregamos frutas frescas direto na sua casa.</p>
          </div>
        </div>
        <button className="carousel-button next" onClick={handleNextSlide}>›</button>
      </section>
      <section id="produtos" className="produtos-disponiveis">
        <h2>Produtos Disponíveis</h2>
        <div className="produtos-container">
          {produtos.map(produto => (
            <div key={produto.nome} className="produto">
              {produto.imagem && <img src={produto.imagem} alt={produto.nome} />}
              <h3>{produto.nome}</h3>
              <p>{produto.descricao}</p>
              <p>R$ {produto.preco.toFixed(2)}</p>
              <button onClick={() => adicionarAoCarrinho(produto.nome, produto.preco)}>
                Adicionar ao Carrinho
              </button>
            </div>
          ))}
        </div>
      </section>
      <section id="carrinho" className={`carrinho-oculto ${carrinho.length > 0 ? 'show' : ''}`}>
        <h2>Carrinho de Compras</h2>
        <ul>
          {carrinho.map((item, index) => (
            <li key={index}>{item.nome} - R$ {item.preco.toFixed(2)}</li>
          ))}
        </ul>
        <p className="taxa-entrega">Taxa de Entrega: R$ 13,00</p>
        <p>Total: R$ {totalCarrinho.toFixed(2)}</p>
        <button onClick={finalizarCompra}>Finalizar Compra</button>
      </section>
    </main>
  );
};

export default Home;
