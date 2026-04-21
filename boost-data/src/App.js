import React, { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import './App.css';

function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState({ fullname: '', email: '', phone: '' });

  // UPDATED: Your brother's correct number
  const MY_WHATSAPP_NUMBER = "233540952697"; 

  const getFinalPrice = () => {
    if (selectedItem?.price === 'custom') return parseFloat(customAmount) || 0;
    return selectedItem?.price || 0;
  };

  const config = {
    reference: (new Date()).getTime().toString(),
    email: userData.email,
    amount: getFinalPrice() * 100, 
    publicKey: 'pk_live_f41ad9f40e5f24bd6030566e8f1433d6900c1b11', 
    currency: 'GHS',
  };

  const initializePayment = usePaystackPayment(config);

  const sections = [
    { 
      title: "MTN DATA", 
      color: "#facc15",
      items: [
        { name: '1GB MTN Data', price: 8 },
        { name: '2GB MTN Data', price: 16 },
        { name: '3GB MTN Data', price: 24 },
      ]
    },
    { 
      title: "TELECEL DATA", 
      color: "#ef4444",
      items: [
        { name: '5GB Telecel Data', price: 25  },
        { name: '10GB Telecel Data', price: 50},
        { name: '20GB Telecel Data', price: 80 },
      ]
    },
    { 
      title: "MTN AIRTIME", 
      color: "#facc15",
      items: [
        { name: '5 GHS Airtime', price: 5 },
        { name: '10 GHS Airtime', price: 10 },
        { name: '20 GHS Airtime', price: 20 },
        { name: 'Custom Airtime', price: 'custom' },
      ]
    },
    { 
      title: "MTN MASHUP", 
      color: "#facc15",
      items: [
        { name: '5 GHS Mashup', price: 3 },
        { name: '10 GHS Mashup', price: 5 },
        { name: '20 GHS Mashup', price: 10 },
        { name: 'Custom Mashup', price: 'custom' },
      ]
    }
  ];

  const handlePay = () => {
    if (!userData.fullname || !userData.email || !userData.phone) return alert("Fill all details!");
    if (getFinalPrice() <= 0) return alert("Enter a valid amount!");
    
    initializePayment((ref) => {
      const msg = `✅ *PAYMENT VERIFIED*%0A👤 *Name:* ${userData.fullname}%0A📱 *Recipient:* ${userData.phone}%0A📦 *Plan:* ${selectedItem.name}%0A💰 *Paid:* GH₵ ${getFinalPrice()}`;
      
      // Forces the browser to navigate to WhatsApp
      window.location.href = `https://wa.me/${MY_WHATSAPP_NUMBER}?text=${msg}`;
      
      setShowModal(false);
    }, () => alert("Cancelled"));
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>BOOST<span>DATA</span></h1>
        <p>Select a package to get started</p>
      </header>

      <div className="category-grid">
        {sections.map((sec) => (
          <div className="card" key={sec.title} style={{borderColor: sec.color}}>
            <h2 className="cat-title" style={{color: sec.color}}>{sec.title}</h2>
            <div className="items-list">
              {sec.items.map(p => (
                <div key={p.name} className="item-wrapper">
                  <div 
                    className={`item-row ${selectedItem?.name === p.name ? 'active' : ''}`} 
                    onClick={() => setSelectedItem(p)}
                  >
                    <span>{p.name}</span>
                    <span>{p.price === 'custom' ? 'Type Amount' : `GH₵ ${p.price}`}</span>
                  </div>
                  
                  {selectedItem?.name === p.name && p.price === 'custom' && (
                    <input 
                      type="number" 
                      className="inline-input" 
                      style={{ fontSize: '16px' }} 
                      placeholder="Enter Amount (GH₵)" 
                      autoFocus
                      onChange={(e) => setCustomAmount(e.target.value)} 
                    />
                  )}

                  {selectedItem?.name === p.name && (
                    <button className="inline-buy-btn" onClick={() => setShowModal(true)}>
                      BUY NOW
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Finalize Payment</h3>
            <p>Paying: <span style={{color:'#facc15'}}>GH₵ {getFinalPrice()}</span></p>
            <input 
              style={{ fontSize: '16px' }} 
              placeholder="Your Full Name" 
              onChange={e => setUserData({...userData, fullname: e.target.value})} 
            />
            <input 
              style={{ fontSize: '16px' }} 
              placeholder="Email Address" 
              onChange={e => setUserData({...userData, email: e.target.value})} 
            />
            <input 
              style={{ fontSize: '16px' }} 
              placeholder="Recipient Number" 
              onChange={e => setUserData({...userData, phone: e.target.value})} 
            />
            <button className="confirm-btn" onClick={handlePay}>PAY SECURELY</button>
            <button className="cancel-btn" onClick={() => setShowModal(false)}>Back</button>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="footer-content">
          <h3 className="footer-logo">BOOST<span>DATA</span></h3>
          <p>Instant Data & Airtime Delivery</p>
          <div className="footer-links">
            <a href={`https://wa.me/${MY_WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">Support</a>
            <a href="#">Terms</a>
          </div>
          <p className="copyright">© 2026 BoostData Ghana. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;