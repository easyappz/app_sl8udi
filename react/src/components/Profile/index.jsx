import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../../api/profile';
import { getAuthToken, removeAuthToken } from '../../api/auth';
import './style.css';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        setProfile(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Не удалось загрузить профиль');
        if (err.response && err.response.status === 401) {
          removeAuthToken();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    removeAuthToken();
    navigate('/login');
  };

  const handleNavigateToChat = () => {
    navigate('/');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указана';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="profile-container" data-easytag="id1-react/src/components/Profile/index.jsx">
        <div className="profile-loading">
          <div className="spinner"></div>
          <p>Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container" data-easytag="id1-react/src/components/Profile/index.jsx">
        <div className="profile-error">
          <p>{error}</p>
          <button onClick={() => navigate('/login')} className="btn-primary">
            Войти снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container" data-easytag="id1-react/src/components/Profile/index.jsx">
      <div className="profile-header">
        <h1>Профиль</h1>
        <div className="profile-nav">
          <button onClick={handleNavigateToChat} className="btn-secondary">
            💬 Чат
          </button>
          <button onClick={handleLogout} className="btn-logout">
            🚪 Выход
          </button>
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {profile?.username ? profile.username.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>

        <div className="profile-info">
          <div className="info-item">
            <label>Имя пользователя</label>
            <div className="info-value">{profile?.username || 'Не указано'}</div>
          </div>

          <div className="info-item">
            <label>Дата регистрации</label>
            <div className="info-value">{formatDate(profile?.created_at)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
