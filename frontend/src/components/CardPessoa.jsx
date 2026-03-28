import { Edit, Trash2, User } from 'lucide-react';

//Recebe pessoa como uma propriedade
function CardPessoa({ pessoa }) {
  return (
    <div className="person-card">
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
          {/* Mais para frente, adicionaremos as funções de clique aqui */}
          <button className="icon-btn"><Edit size={20} color="#666" /></button>
          <button className="icon-btn"><Trash2 size={20} color="#666" /></button>
        </div>
      </div>
    </div>
  );
}

export default CardPessoa;