import { Edit, Trash2, User } from 'lucide-react';

function CardPessoa({ pessoa, onEdit, onDelete }) {
  return (
    
    <div className="person-row">
      <div className="avatar-wrapper">
        <div className="avatar">
          <User size={30} color="#0088ff" /> 
        </div>
      </div>
      
      <div className="person-info">
        <h3 className="person-name">{pessoa.nome}</h3>
        <p className="person-contact">{pessoa.telefone}</p>
        <p className="person-contact">{pessoa.email}</p>
        <p className="person-contact">{pessoa.tipo}</p>
      </div>
      
      <div className="person-meta">
        <div className="person-date">
          {pessoa.data_cadastro}
        </div>
        <div className="action-buttons">
          <button className="icon-btn" onClick={() => onEdit(pessoa)}>
            <Edit size={20} color="#888" />
          </button>
          <button className="icon-btn" onClick={() => onDelete(pessoa.id)}>
            <Trash2 size={20} color="#888" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardPessoa;