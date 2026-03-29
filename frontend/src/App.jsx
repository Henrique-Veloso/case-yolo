import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import CardPessoa from './components/CardPessoa';
import ModalForm from './components/ModalForm';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL

function App() {
  const [pessoas, setPessoas] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pessoaEditando, setPessoaEditando] = useState(null);
  const [filtro, setFiltro] = useState('');

  //READ
  const fetchPessoas = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setPessoas(data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => {
    fetchPessoas();
  }, []);

  const tiposUnicos = [...new Set(pessoas.map(p => p.tipo))];
  const pessoasFiltradas = filtro ? pessoas.filter(p => p.tipo === filtro) : pessoas;

  //CREATE e UPDATE
  const handleSalvarPessoa = async (dadosFormulario) => {
    try {
      if (pessoaEditando) {
        const payload = { ...dadosFormulario, id: pessoaEditando.id };
        await fetch(API_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dadosFormulario)
        });
      }
      
      await fetchPessoas(); 
      fecharModal();
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  //DELETE
  const handleDeletar = async (idParaDeletar) => {
    if (window.confirm("Tem certeza que deseja excluir este cadastro?")) {
      try {
        await fetch(API_URL, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: idParaDeletar })
        });
        
        await fetchPessoas(); 
      } catch (error) {
        console.error("Erro ao deletar:", error);
      }
    }
  };

  const handleEditar = (pessoa) => {
    setPessoaEditando(pessoa);
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setPessoaEditando(null);
  };

  return (
    <div className="app-container">

      <header className="top-bar">

        <h1 className="logo-text">yolo<span className="logo-sub">coliving</span></h1>
        
        <div className="actions">
          <select 
            className="filter-select"
            value={filtro} 
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option value="">Selecione um filtro</option>
            {tiposUnicos.filter(Boolean).map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
          
          <button className="btn-add" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Adicionar
          </button>
        </div>
      </header>

      <main className="list-container">
        {pessoasFiltradas.map(pessoa => (
          <CardPessoa 
            key={pessoa.id} 
            pessoa={pessoa} 
            onEdit={handleEditar}
            onDelete={handleDeletar}
          />
        ))}
      </main>

      {isModalOpen && (
        <ModalForm 
          onClose={fecharModal} 
          onSave={handleSalvarPessoa} 
          pessoaEditando={pessoaEditando}
        />
      )}
    </div>
  );
}

export default App;