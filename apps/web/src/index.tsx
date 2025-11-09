import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { User, HelloResponse, ApiError } from '@monorepo/types';

interface AppState {
  loading: boolean;
  result: HelloResponse | null;
  error: string | null;
}

const App: React.FC = () => {
  const [userId, setUserId] = useState('world');
  const [state, setState] = useState<AppState>({
    loading: false,
    result: null,
    error: null
  });

  const fetchHello = async () => {
    setState({ loading: true, result: null, error: null });

    try {
      const response = await fetch(`${process.env.API_URL}/hello/${userId}`, {
        headers: {
          'Accept-Language': navigator.language
        }
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message);
      }

      const result: HelloResponse = await response.json();
      setState({ loading: false, result, error: null });
    } catch (err) {
      setState({
        loading: false,
        result: null,
        error: err instanceof Error ? err.message : 'An error occurred'
      });
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🌍 Hello World Monorepo Demo</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="userId" style={{ display: 'block', marginBottom: '0.5rem' }}>
          User ID:
        </label>
        <input
          id="userId"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter user ID (1, 2, 3, or world)"
          style={{
            padding: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginRight: '0.5rem',
            minWidth: '200px'
          }}
        />
        <button
          onClick={fetchHello}
          disabled={state.loading || !userId.trim()}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007acc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: state.loading ? 'not-allowed' : 'pointer',
            opacity: state.loading || !userId.trim() ? 0.6 : 1
          }}
        >
          {state.loading ? 'Loading...' : 'Say Hello'}
        </button>
      </div>

      {state.error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          color: '#c00',
          marginBottom: '1rem'
        }}>
          Error: {state.error}
        </div>
      )}

      {state.result && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#efe',
          border: '1px solid #cfc',
          borderRadius: '4px',
          color: '#060'
        }}>
          <h2>🎉 {state.result.greeting}, {state.result.user.name}!</h2>
          <p><strong>User:</strong> {state.result.user.name} (ID: {state.result.user.id})</p>
          {state.result.user.language && (
            <p><strong>Language:</strong> {state.result.user.language}</p>
          )}
          <p><strong>Timestamp:</strong> {state.result.timestamp}</p>
          <p><strong>Your Browser Language:</strong> {navigator.language}</p>
        </div>
      )}

      <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
        <h3>Available Users:</h3>
        <ul>
          <li><code>world</code> - Hello, World!</li>
          <li><code>1</code> - Alice (English)</li>
          <li><code>2</code> - José (Spanish)</li>
          <li><code>3</code> - Marie (French)</li>
        </ul>
        <p>The greeting will be translated to your browser's preferred language!</p>
      </div>
    </div>
  );
};

// Mount the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error('Root container not found');
}
