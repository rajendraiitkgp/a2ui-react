import { A2UIProvider, A2UIRenderer } from '@a2ui-sdk/react/0.9';

export default function A2UIRenderPanel({ messages, catalog, renderAIResponse, onAction }) {
  if (!renderAIResponse) {
    return <div style={{ color: '#555' }}>Click the Send button to render the AI response list on the right.</div>;
  }

  return (
    <A2UIProvider messages={messages} catalog={catalog}>
      <A2UIRenderer onAction={onAction} />
    </A2UIProvider>
  );
}
