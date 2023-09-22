// TypeScript Code
interface UIPluginMessage {
  type: string;
  color?: string;
  name?: string;
  numTints?: number;
  ellipseSize?: number;
  layoutDirection?: "HORIZONTAL" | "VERTICAL";
  itemSpacing?: number;
  
}

figma.showUI(__html__);
figma.ui.resize(240,410);

figma.ui.onmessage = async (msg: UIPluginMessage) => {
  if (msg.type === 'cancel') {
      figma.closePlugin();
  } else if (msg.type === 'create-tints') {
      const color: RGB = {
          r: parseInt((msg.color ?? "#000000").substring(1, 3), 16) / 255,
          g: parseInt((msg.color ?? "#000000").substring(3, 5), 16) / 255,
          b: parseInt((msg.color ?? "#000000").substring(5, 7), 16) / 255,
      };

      const name = msg.name || "Primary";
      let numTints = msg.numTints || 10;
      numTints = Math.max(2, Math.min(10, numTints));  // Ensure numTints is between 2 and 10
      const ellipseSize = msg.ellipseSize || 120;
      const layoutDirection = msg.layoutDirection || "HORIZONTAL";
      const itemSpacing = msg.itemSpacing || 32;
      const padding = 64;

      const parentFrame = figma.createFrame();
      parentFrame.layoutMode = layoutDirection;
      parentFrame.itemSpacing = itemSpacing;
      parentFrame.primaryAxisSizingMode = "AUTO";
      parentFrame.counterAxisSizingMode = "AUTO";
      parentFrame.layoutAlign = "STRETCH";
      parentFrame.paddingTop = padding;
      parentFrame.paddingRight = padding;
      parentFrame.paddingBottom = padding;
      parentFrame.paddingLeft = padding;

      for (let i = 0; i < numTints; i++) {
          const whiteToAdd = i / (numTints - 1);
          const tint = figma.createEllipse();
          tint.fills = [{
            type: 'SOLID', 
            color: {
              r: color.r + (1 - color.r) * whiteToAdd,
              g: color.g + (1 - color.g) * whiteToAdd,
              b: color.b + (1 - color.b) * whiteToAdd,
            },
            opacity: 1
          }];
          tint.name = `${name} ${100-i*10}`;
          tint.resize(ellipseSize, ellipseSize);
          parentFrame.appendChild(tint);
      }

      figma.currentPage.appendChild(parentFrame);
      parentFrame.x = figma.viewport.center.x - parentFrame.width / 2;
      parentFrame.y = figma.viewport.center.y - parentFrame.height / 2;
      figma.viewport.scrollAndZoomIntoView([parentFrame]);
  }
};
