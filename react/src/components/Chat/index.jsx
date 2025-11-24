import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../../api/auth';
import { getMessages, createMessage } from '../../api/messages';
import './style.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Проверка аутентификации
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Загрузка сообщений при монтировании
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages();
        setMessages(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
        setLoading(false);
      }
    };

    fetchMessages();
  }, [navigate]);

  // Авто-прокрутка вниз при новых сообщениях
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Обработка отправки сообщения
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!messageText.trim() || sending) {
      return;
    }

    setSending(true);

    try {
      const newMessage = await createMessage(messageText.trim());
      setMessages([...messages, newMessage]);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
      alert('Ошибка при отправке сообщения. Попробуйте еще раз.');
    } finally {
      setSending(false);
    }
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин. назад`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} ч. назад`;

    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="chat-container" data-easytag="id1-react/src/components/Chat/index.jsx">
      <div className="chat-header">
        <h1>Групповой чат</h1>
        <button 
          className="profile-btn"
          onClick={() => navigate('/profile')}
        >
          Профиль
        </button>
      </div>

      <div className="messages-container">
        {loading ? (
          <div className="loading">Загрузка сообщений...</div>
        ) : messages.length === 0 ? (
          <div className="no-messages">Нет сообщений. Напишите первое сообщение!</div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="message-item">
              <div className="message-header">
                <span className="message-author">{message.member_username || 'Аноним'}</span>
                <span className="message-time">{formatDate(message.created_at)}</span>
              </div>
              <div className="message-text">{message.text}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="message-input"
          placeholder="Введите сообщение..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          maxLength={1000}
          disabled={sending}
        />
        <button 
          type="submit" 
          className="send-btn"
          disabled={!messageText.trim() || sending}
        >
          {sending ? 'Отправка...' : 'Отправить'}
        </button>
      </form>
    </div>
  );
};

export default Chat;
