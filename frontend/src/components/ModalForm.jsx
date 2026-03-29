import { useState } from 'react';
import { X } from 'lucide-react';

function ModalForm({ onClose, onSave, pessoaEditando }) {
  const [formData, setFormData] = useState({
    nome: pessoaEditando ? pessoaEditando.nome : '',
    telefone: pessoaEditando ? pessoaEditando.telefone : '',
    email: pessoaEditando ? pessoaEditando.email : '',
    tipo: pessoaEditando ? pessoaEditando.tipo : ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <header className="modal-header">
          <h2>{pessoaEditando ? 'Editar Pessoa' : 'Cadastrar Pessoa'}</h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={24} color="#666" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nome Completo</label>
            <input 
              type="text" name="nome" required
              value={formData.nome} onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Telefone</label>
            <input 
              type="text" name="telefone" required
              value={formData.telefone} onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>E-mail</label>
            <input 
              type="email" name="email" required
              value={formData.email} onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Tipo</label>
            <select name="tipo" required value={formData.tipo} onChange={handleChange}>
              <option value="">Selecione o tipo</option>
              <option value="Hóspede">Hóspede</option>
              <option value="Proprietário">Proprietário</option>
              <option value="Operador">Operador</option>
              <option value="Fornecedor">Fornecedor</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save">
              {pessoaEditando ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalForm;