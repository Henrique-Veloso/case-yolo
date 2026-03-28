import { useState } from 'react';
import { Plus, Edit, Trash2, User } from 'lucide-react';
import { mockPessoas } from './data/mockData';
import './App.css';

function App() {
  //Armazenar o valor 
  const [filtro, setFiltro] = useState('');

  //Extrair tipos para montar as opções do select
  const tiposUnicos = [...new Set(mockPessoas.map(p => p.Tipo))];

  // Filtrar lista 
  const pessoasFiltradas = filtro 
    ? mockPessoas.filter(p => p.Tipo === filtro) 
    : mockPessoas;

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
          
          <button className="btn-add">
            <Plus size={18} /> Adicionar
          </button>
        </div>
      </header>

      <main className="list-container">
        {pessoasFiltradas.map(pessoa => (
          <div key={pessoa.id} className="person-card">
            <div className="avatar">
              <User size={28} color="#aaa" />
            </div>
            
            <div className="person-info">
              <h3 className="person-name">{pessoa.Nome}</h3>
              <p className="person-contact">{pessoa.Telefone}</p>
              <p className="person-contact">{pessoa['E-mail']}</p>
            </div>
            
            <div className="person-meta">
              <span className="person-date">{pessoa['Data de Cadastro']}</span>
              <div className="action-buttons">
                <button className="icon-btn"><Edit size={20} color="#666" /></button>
                <button className="icon-btn"><Trash2 size={20} color="#666" /></button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;