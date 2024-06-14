import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import arrow_icon from '../../assets/arrow_icon.png';
import cart_icon from '../../assets/cart_icon.jpg';
import './SubSevaList.css';

const SubSevaList = () => {
  const { sevaId } = useParams();
  const [subSevas, setSubSevas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubSevas = async () => {
      setLoading(true);
      try {
        const params = {
          getsubServices: true,
          seva_type: sevaId,
        };
        const response = await axios.get('http://localhost:3501/sub-sevas', { params });
        setSubSevas(response.data);
      } catch (error) {
        console.error('Error fetching sub-sevas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubSevas();
  }, [sevaId]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (subSeva) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.service_id === subSeva.service_id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.service_id === subSeva.service_id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...subSeva, quantity: 1 }];
      }
    });
  };

  const handleQuantityChange = (subSeva, amount) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) =>
          item.service_id === subSeva.service_id ? { ...item, quantity: item.quantity + amount } : item
        )
        .filter((item) => item.quantity > 0);
    });
  };

  const totalCartQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  const handleCartClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="sub-sevas-list-page">
      <button className="back-button" onClick={() => navigate('/sevas')}>
        <img src={arrow_icon} alt="Back" className="rotate-left" /> Back
      </button>
      <div className="cart-icon-container" onClick={handleCartClick}>
        <img src={cart_icon} alt="Cart" />
        {totalCartQuantity > 0 && <span className="cart-quantity">{totalCartQuantity}</span>}
      </div>
      <div className="sub-sevas-list">
        {loading ? (
          <p>Loading...</p>
        ) : subSevas.data && subSevas.data.length > 0 ? (
          subSevas.data.map((subSeva) => {
            const cartItem = cart.find((item) => item.service_id === subSeva.service_id);
            return (
              <div key={subSeva.service_id} className="sub-seva-card">
                <img src={subSeva.image} alt="Seva" />
                <h3>{subSeva.seva_telugu_name}</h3>
                <h3>{subSeva.seva_english_name}</h3>
                <p>Price: {subSeva.price} /-</p>
                {cartItem ? (
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(subSeva, -1)}>-</button>
                    <span>{cartItem.quantity}</span>
                    <button onClick={() => handleQuantityChange(subSeva, 1)}>+</button>
                  </div>
                ) : (
                  <button className='booknow-btn' onClick={() => handleAddToCart(subSeva)}>Add to Cart</button>
                )}
              </div>
            );
          })
        ) : (
          <p className='notavailable'>No Sevas available</p>
        )}
      </div>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <button className="close-popup-btn" onClick={handleClosePopup}>×</button>
            <h2>Cart Summary</h2>
            <ul>
              {cart.map((item) => (
                <li key={item.service_id}>
                  {item.seva_english_name} - {item.quantity} x {item.price} /- = {item.quantity * item.price} /-
                </li>
              ))}
            </ul>
            <button onClick={() => navigate('/checkout', { state: { cart } })}>Checkout</button>
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubSevaList;
