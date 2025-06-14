import { useEffect, useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const SALT = 'SALT1234';
const KEY = CryptoJS.SHA256('internsNeverGuess');

function decrypt(encrypted, iv) {
  const key = KEY;
  const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: CryptoJS.enc.Base64.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString(CryptoJS.enc.Utf8);
  return decrypted.replace(SALT, '');
}

function App() {
  const [fields, setFields] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/api/form').then(res => {
      const validFields = res.data
        .map(f => {
          try {
            const result = decrypt(f.data, f.iv);
            return /^[^:]+:[^:]+$/.test(result) ? result : null;
          } catch {
            return null;
          }
        })
        .filter(Boolean);
      setFields(validFields);
    });
  }, []);

  const handleBlur = (e, label) => {
    setFormData({ ...formData, [label]: e.target.value });
    setCurrentIndex(prev => prev + 1);
  };

  const handleSubmit = () => {
    axios.post('http://localhost:5000/api/submit', formData).then(res => {
      alert(res.data.message);
    });
  };

  useEffect(() => {
    if (currentIndex === fields.length && fields.length > 0) {
      handleSubmit();
    }
  }, [currentIndex]);

  if (currentIndex >= fields.length) return <h2>Submitting...</h2>;

  const [label, type] = fields[currentIndex]?.split(':');

  return (
    <div style={{ padding: 20 }}>
      <h2>{label}</h2>
      <input
        type={type}
        placeholder={label}
        onBlur={(e) => handleBlur(e, label)}
        autoFocus
      />
    </div>
  );
}

export default App;
