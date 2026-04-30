export function createAIMessages(aiResponse) {
  return [
    {
      createSurface: {
        surfaceId: 'main',
        catalogId: 'custom'
      }
    },
    {
      updateComponents: {
        surfaceId: 'main',
        components: aiResponse.nodes.map(({ props, ...node }) => ({
          ...node,
          ...props,
          action: typeof props?.action === 'string' ? { name: props.action } : props?.action
        }))
      }
    }
  ];
}
