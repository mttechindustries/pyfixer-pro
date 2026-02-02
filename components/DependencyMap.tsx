
import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { PythonFile } from '../types';

interface DependencyMapProps {
  files: PythonFile[];
  activeFileId: string | null;
  onNodeClick: (fileId: string) => void;
}

const DependencyMap: React.FC<DependencyMapProps> = ({ files, activeFileId, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const { nodes, links } = useMemo(() => {
    const nodes = files.map(f => ({ 
      id: f.name, 
      fileId: f.id,
      isActive: f.id === activeFileId,
      incoming: 0 
    }));
    
    const links: any[] = [];
    
    files.forEach(fTarget => {
      files.forEach(fSource => {
        if (fSource.id !== fTarget.id) {
          // Detect simple imports: "import filename" or "from filename"
          const moduleName = fSource.name.replace('.py', '');
          const importRegex = new RegExp(`(import|from)\\s+${moduleName}\\b`, 'g');
          
          if (importRegex.test(fTarget.content)) {
            links.push({ source: fTarget.name, target: fSource.name });
            const sourceNode = nodes.find(n => n.id === fSource.name);
            if (sourceNode) sourceNode.incoming += 1;
          }
        }
      });
    });

    return { nodes, links };
  }, [files, activeFileId]);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const width = 400;
    const height = 240;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Define arrow markers
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "#475569")
      .style("stroke", "none");

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#334155")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrowhead)");

    const nodeGroup = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .on("click", (event, d: any) => onNodeClick(d.fileId));

    // Outer glow for active node
    nodeGroup.append("circle")
      .attr("r", (d: any) => 8 + (d.incoming * 2))
      .attr("fill", (d: any) => d.isActive ? "#3b82f6" : "transparent")
      .attr("filter", "blur(4px)")
      .attr("opacity", 0.4);

    // Main node circle
    nodeGroup.append("circle")
      .attr("r", (d: any) => 5 + (d.incoming * 1.5))
      .attr("fill", (d: any) => d.isActive ? "#60a5fa" : "#334155")
      .attr("stroke", (d: any) => d.isActive ? "#fff" : "#475569")
      .attr("stroke-width", 2)
      .attr("class", "transition-colors duration-300");

    // Labels
    nodeGroup.append("text")
      .text(d => d.id)
      .attr("dy", 20)
      .attr("text-anchor", "middle")
      .attr("fill", (d: any) => d.isActive ? "#fff" : "#94a3b8")
      .attr("font-size", "9px")
      .attr("font-family", "monospace")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeGroup
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => simulation.stop();
  }, [nodes, links, onNodeClick]);

  return (
    <div className="bg-slate-900/50 rounded-lg p-2 border border-slate-800 h-full flex flex-col">
      <div className="text-[10px] font-bold text-slate-500 mb-2 px-1 uppercase tracking-tight flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span>Module Logic Map</span>
          <span className="text-[8px] bg-slate-800 text-slate-400 px-1 rounded border border-slate-700 uppercase">Interactive</span>
        </div>
        <span className="text-blue-400/80 animate-pulse text-[9px]">● LIVE ANALYTICS</span>
      </div>
      <div className="flex-1 min-h-0 relative">
        <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 400 240" className="absolute inset-0"></svg>
      </div>
    </div>
  );
};

export default DependencyMap;
