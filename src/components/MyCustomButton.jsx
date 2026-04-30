// MyCustomButton.jsx
import React from 'react';

const MyCustomButton = ({ label, variant = 'primary', onAction }) => {
  const buttonStyle = {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: variant === 'primary' ? '#6200ee' : '#03dac6',
    color: 'white',
    transition: 'transform 0.1s'
  };

  return (
    <button 
      style={buttonStyle}
      onClick={() => onAction?.({ name: 'custom_button_click', label })}
      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {label}
    </button>
  );
};

export default MyCustomButton;
