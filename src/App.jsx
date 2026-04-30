import { useState } from 'react';
import { useDispatchAction, ComponentRenderer } from '@a2ui-sdk/react/0.9';
import * as A2UICore from '@a2ui/web_core';
import {catalogJson} from './catalog.js';
import { aiResponse } from './aiResponse';
import { createAIMessages } from './aiMessages';
import A2UIRenderPanel from './A2UIRenderPanel';


// 1. Define the components the AI is allowed to use
const MyButton = ({ surfaceId, componentId, action, label }) => {
  const dispatchAction = useDispatchAction();

  const handleClick = () => {
    if (action) {
      dispatchAction(surfaceId, componentId, action);
    }
  };

  return (
    <button style={{ padding: '10px', background: '#007bff', color: '#fff', width: '100%', borderRadius: '8px', border: 'none' }} onClick={handleClick}>
      {label}
    </button>
  );
};

const MyTextInput = ({ label, placeholder, type = 'text' }) => {
  const [value, setValue] = useState('');

  return (
    <div style={{ marginBottom: '16px' }}>
      {label && <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.95rem', color: '#333' }}>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }}
      />
    </div>
  );
};

const MyColumn = ({ surfaceId, children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {Array.isArray(children) && children.map((childId) => (
        <ComponentRenderer key={childId} surfaceId={surfaceId} componentId={childId} />
      ))}
    </div>
  );
};

const MyCard = ({ title, content }) => (
  <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
    <h3>{title}</h3>
    <p>{content}</p>
  </div>
);

const componentMap = {
  MyButton,
  MyTextInput,
  MyCard,
  MyColumn
};

// 2. Create the Catalog from JSON
const catalog = {
  components: Object.fromEntries(
    Object.entries(catalogJson).map(([key, componentOrName]) => [
      key,
      typeof componentOrName === 'string' ? componentMap[componentOrName] : componentOrName
    ])
  )
};

export default function App() {
  const validateV09Response = (data, catalog) => {
  const errors = [];

  // 1. Check Version
  if (data.version !== "v0.9") {
    errors.push("Missing or incorrect version: Expected v0.9");
  }

  // 2. Check main instruction key
  const update = data.nodes;
  if (!update) {
    errors.push("Missing 'updateComponents' key.");
    return { valid: false, errors };
  }

  // 3. Check Components array
  if (!Array.isArray(update)) {
    errors.push("'components' must be an array.");
  } else {
    update.forEach((node, index) => {
      // Check for ID
      if (!node.id) errors.push(`Component at index ${index} missing 'id'.`);
      
      // Check if component exists in your local catalog
      if (!catalog[node.component]) {
        errors.push(`Component '${node.component}' (id: ${node.id}) not found in Catalog.`);
      }

      // Check Children (if present)
      if (node.props.children && !Array.isArray(node.props.children)) {
        errors.push(`'children' in ${node.id} must be an array of string IDs.`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

  // 3. Simulated state: This JSON normally comes from your AI backend
  const result = validateV09Response(aiResponse, catalog.components);

  if (!result.valid) {
    console.error("A2UI JSON Error:", result.errors);
  } else {
    console.log("JSON is protocol-compliant!:::", result);
  }
  const aiMessages = createAIMessages(aiResponse);

  const [chatMessages, setChatMessages] = useState([
    { id: 1, author: 'AI', text: 'Welcome! Ask me to render a UI component on the right.' },
    { id: 2, author: 'User', text: 'Please show a card and a button.' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [renderAIResponse, setRenderAIResponse] = useState(false);

  const handleAction = (payload) => {
    console.log("Action received from A2UI:", payload);
    alert(`AI Action Triggered: ${payload.action}`);
  };

  const sendChatMessage = () => {
    if (!userInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now(), author: 'User', text: userInput.trim() }
    ]);
    setUserInput('');
    setRenderAIResponse(true);
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <h1>My A2UI Project</h1>
      <p style={{ marginBottom: '24px', color: '#555' }}>
        Chat on the left and preview dynamic AI-rendered UI on the right.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '20px',
          minHeight: '70vh'
        }}
      >
        <section
          style={{
            border: '1px solid #ddd',
            borderRadius: '16px',
            padding: '16px',
            background: '#fafafa',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ margin: 0 }}>Chatbot</h2>
            <p style={{ margin: '8px 0 0', color: '#666' }}>
              Use this panel like a conversation interface.
            </p>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px',
              background: '#fff',
              borderRadius: '12px',
              border: '1px solid #ececec',
              marginBottom: '16px'
            }}
          >
            {chatMessages.map((message) => (
              <div
                key={message.id}
                style={{
                  marginBottom: '12px',
                  textAlign: message.author === 'User' ? 'right' : 'left'
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    padding: '10px 14px',
                    borderRadius: '16px',
                    background: message.author === 'User' ? '#007bff' : '#f3f4f6',
                    color: message.author === 'User' ? '#fff' : '#111',
                    maxWidth: '100%'
                  }}
                >
                  <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.92rem' }}>
                    {message.author}
                  </strong>
                  <span>{message.text}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              value={userInput}
              onChange={(event) => setUserInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') sendChatMessage();
              }}
              placeholder="Type a prompt..."
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: '12px',
                border: '1px solid #ccc',
                outline: 'none'
              }}
            />
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                sendChatMessage();
              }}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                border: 'none',
                background: '#007bff',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              Send
            </button>
          </div>
        </section>

        <section
          style={{
            border: '1px solid #ddd',
            borderRadius: '16px',
            padding: '24px',
            background: '#fff'
          }}
        >
          <h2 style={{ marginTop: 0 }}>Dynamic AI Content</h2>
          <p style={{ marginBottom: '24px', color: '#666' }}>
            The right panel renders UI using the A2UI SDK when the Send button is clicked.
          </p>

          <A2UIRenderPanel
            messages={aiMessages}
            catalog={catalog}
            renderAIResponse={renderAIResponse}
            onAction={handleAction}
          />
        </section>
      </div>
    </div>
  );
}