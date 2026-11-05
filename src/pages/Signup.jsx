import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Music } from 'lucide-react';
import { seedData } from '../utils/seedData.js';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    country: '', dob: '',
  });
  const [error, setError] = useState('');

  useEffect(() => { seedData(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    const result = await signup({
      name: form.name,
      email: form.email,
      password: form.password,
      country: form.country,
      dob: form.dob,
    });
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-icon"><Music size={22} /></span>
          RagaPlay
        </div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join RagaPlay and start listening</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" type="text" name="name" value={form.name}
              onChange={handleChange} placeholder="John Doe" required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" name="email" value={form.email}
              onChange={handleChange} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password" value={form.password}
              onChange={handleChange} placeholder="At least 6 characters" required />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className="form-input" type="password" name="confirmPassword" value={form.confirmPassword}
              onChange={handleChange} placeholder="Re-enter password" required />
          </div>
          <div className="form-group">
            <label className="form-label">Country</label>
            <select className="form-select" name="country" value={form.country} onChange={handleChange} required>
              <option value="">Select country</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>India</option>
              <option>Canada</option>
              <option>Australia</option>
              <option>Germany</option>
              <option>France</option>
              <option>Japan</option>
              <option>Brazil</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date of Birth</label>
            <input className="form-input" type="date" name="dob" value={form.dob}
              onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary btn-full">Sign Up</button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
