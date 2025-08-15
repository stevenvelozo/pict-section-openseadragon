import ArrowTool from './arrow/ArrowTool';

const ALL_TOOLS = new Set([
  'arrow',
]);

const PictPack = (anno, config) => {

  // Add configured tools, or all
  const tools = config?.tools ? 
    config.tools.map(t => t.toLowerCase()) : ALL_TOOLS;

  tools.forEach(tool => {
    if (tool === 'arrow')
      anno.addDrawingTool(ArrowTool);
  });

}

export default PictPack;