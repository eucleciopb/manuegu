import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { verifyAdminPassword, setAdminSession } from '../../services/adminService';

export function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (verifyAdminPassword(password)) {
      setAdminSession(true);
      navigate('/admin/dashboard');
    } else {
      setError('Senha incorreta');
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <span className="admin-login-icon">🔐</span>
          <h1>Painel Administrativo</h1>
          <p>Chá de Casa Nova — Manu & Gustavo</p>
        </div>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <Input
            label="Senha de acesso"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            error={error}
            placeholder="Digite a senha"
            required
          />
          <Button type="submit" fullWidth size="lg">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
