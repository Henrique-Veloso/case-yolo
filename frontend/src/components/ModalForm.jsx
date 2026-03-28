import { useState } from 'react';
import { X } from 'lucide-react';

function ModalForm({ onClose, onSave }) {

  //Armazenar 
  const [formData, setFormData] = useState({
    Nome: '',
    Telefone: '',
    'E-mail': '',
    Tipo: ''
  });

  //Atualizar 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //Salvar
  const handleSubmit = (e) => {
    e.preventDefault(); 
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <header className="modal-header">
          <h2>Cadastrar Pessoa</h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={24} color="#666" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nome Completo</label>
            <input 
              type="text" name="Nome" required
              value={formData.Nome} onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Telefone</label>
            <input 
              type="text" name="Telefone" required
              value={formData.Telefone} onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>E-mail</label>
            <input 
              type="email" name="E-mail" required
              value={formData['E-mail']} onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Tipo</label>
            <select name="Tipo" required value={formData.Tipo} onChange={handleChange}>
              <option value="">Selecione o tipo</option>
              <option value="Hóspede">Hóspede</option>
              <option value="Proprietário">Proprietário</option>
              <option value="Operador">Operador</option>
              <option value="Fornecedor">Fornecedor</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalForm;