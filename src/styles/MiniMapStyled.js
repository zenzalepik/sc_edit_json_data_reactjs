//MiniMapStyled.js

import {
  // ReactFlow,
  // useNodesState,
  // useEdgesState,
  // addEdge,
  MiniMap,
  // Controls,
  // Panel,
  // Background,
} from "@xyflow/react";
import styled
//, { ThemeProvider } 
from "styled-components";

const MiniMapStyled = styled(MiniMap)`
  background-color: ${(props) => props.theme.bg};

  .react-flow__minimap-mask {
    fill: ${(props) => props.theme.minimapMaskBg};
  }

  .react-flow__minimap-node {
    fill: ${(props) => props.theme.nodeBg};
    stroke: none;
  }
`;

export default MiniMapStyled;