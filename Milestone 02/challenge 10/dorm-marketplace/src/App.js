import { useEffect, useMemo, useState } from 'react';
import './App.css';

const STORAGE_KEY = 'dorm-marketplace-items';

function normalizeItem(raw) {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description || '',
    status: raw.status || 'available',
    claimedBy: raw.claimedBy ?? null,
    expiryTime: raw.expiryTime ?? null,
  };
}

function App() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setItems(parsed.map(normalizeItem));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setItems((prevItems) =>
        prevItems.map((item) => {
          if (
            item.status === 'reserved' &&
            item.expiryTime !== null &&
            now > item.expiryTime
          ) {
            return {
              ...item,
              status: 'available',
              claimedBy: null,
              expiryTime: null,
            };
          }

          return item;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const nextId = useMemo(() => {
    if (items.length === 0) {
      return 1;
    }

    return Math.max(...items.map((item) => item.id)) + 1;
  }, [items]);

  const addItem = () => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      return;
    }

    setItems((prevItems) => [
      ...prevItems,
      {
        id: nextId,
        name: trimmedName,
        description: trimmedDescription,
        status: 'available',
        claimedBy: null,
        expiryTime: null,
      },
    ]);

    setName('');
    setDescription('');
  };

  const claimItem = (id) => {
    let blocked = false;

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== id) {
          return item;
        }

        if (item.status !== 'available') {
          blocked = true;
          return item;
        }

        return {
          ...item,
          status: 'reserved',
          claimedBy: 'user1',
          expiryTime: Date.now() + 30000,
        };
      })
    );

    if (blocked) {
      alert('Item not available');
    }
  };

  const markSold = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== id) {
          return item;
        }

        return {
          ...item,
          status: 'sold',
          claimedBy: null,
          expiryTime: null,
        };
      })
    );
  };

  const getStatusLabel = (item) => {
    if (item.status === 'available') {
      return 'Available ✅';
    }

    if (item.status === 'reserved') {
      return 'Reserved ⏳';
    }

    return 'Sold ❌';
  };

  const getCountdown = (item) => {
    if (item.status !== 'reserved' || item.expiryTime === null) {
      return '';
    }

    const seconds = Math.max(0, Math.ceil((item.expiryTime - Date.now()) / 1000));
    return `${seconds}s remaining`;
  };

  return (
    <div className="App">
      <main className="marketplace">
        <h1>Dorm Marketplace</h1>

        <section className="composer">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Item name"
          />
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description"
          />
          <button onClick={addItem}>Add Item</button>
        </section>

        <section className="items">
          {items.length === 0 && <p className="empty">No items yet.</p>}

          {items.map((item) => (
            <article key={item.id} className="item-card">
              <div className="item-top">
                <h2>{item.name}</h2>
                <span>{getStatusLabel(item)}</span>
              </div>

              <p>{item.description || 'No description provided.'}</p>

              {item.status === 'reserved' && (
                <p className="meta">Claimed by {item.claimedBy} · {getCountdown(item)}</p>
              )}

              <div className="actions">
                <button onClick={() => claimItem(item.id)} disabled={item.status !== 'available'}>
                  Claim
                </button>
                <button onClick={() => markSold(item.id)} disabled={item.status === 'sold'}>
                  Mark as Sold
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
