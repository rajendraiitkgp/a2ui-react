// src/components/UserProfile.jsx
import React from 'react';

export const UserProfile = ({ name, role, avatarUrl, children, onAction }) => {
  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '16px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <img src={avatarUrl} alt={name} style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
        <div style={{ marginLeft: '12px' }}>
          <h4 style={{ margin: 0 }}>{name}</h4>
          <span style={{ fontSize: '12px', color: '#666' }}>{role}</span>
        </div>
      </div>
      
      {/* This renders any nested components defined in the JSON 'children' array */}
      <div className="a2ui-slots">
        {children}
      </div>

      <button 
        onClick={() => onAction({ name: 'view_profile', userId: name })}
        style={{ marginTop: '10px', width: '100%' }}
      >
        View Details
      </button>
    </div>
  );
};
