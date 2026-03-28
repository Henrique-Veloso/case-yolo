import { useState } from 'react';
import { Plus } from 'lucide-react';
import CardPessoa from './components/CardPessoa';
import ModalForm from './components/ModalForm';
import { mockPessoas } from './data/mockData';
import './App.css';

function App() {
  const [pessoas, setPessoas] = useState(mockPessoas);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  //Guardar qual pessoa editando
  const [pessoaEditando, setPessoaEditando] = useState(null);
  
  const [filtro, setFiltro] = useState('');
  
  const tiposUnicos = [...new Set(pessoas.map(p => p.Tipo))];

  const pessoasFiltradas = filtro 
    ? pessoas.filter(p => p.Tipo === filtro) 
    : pessoas;

  const handleSalvarPessoa = (dadosFormulario) => {
    if (pessoaEditando) {
      //Atualiza a pessoa na lista com o mesmo ID
      const listaAtualizada = pessoas.map(p => 
        p.id === pessoaEditando.id ? { ...dadosFormulario, id: p.id, 'Data de Cadastro': p['Data de Cadastro'] } : p
      );
      setPessoas(listaAtualizada);
    } else {
      //Adiciona uma nova pessoa
      const novaPessoa = {
        ...dadosFormulario,
        id: Date.now().toString(),
        'Data de Cadastro': new Date().toISOString().split('T')[0]
      };
      setPessoas([...pessoas, novaPessoa]);
    }
    
    fecharModal();
  };

  //Deletar filtrando o ID fora da lista
  const handleDeletar = (idParaDeletar) => {
    const confirmacao = window.confirm("Tem certeza que deseja excluir este cadastro?");
    if (confirmacao) {
      const listaFiltrada = pessoas.filter(p => p.id !== idParaDeletar);
      setPessoas(listaFiltrada);
    }
  };

  //Preparar o modal para edição
  const handleEditar = (pessoa) => {
    setPessoaEditando(pessoa);
    setIsModalOpen(true);
  };

  //Limpar ao fechar o modal
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
            {tiposUnicos.map(tipo => (
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