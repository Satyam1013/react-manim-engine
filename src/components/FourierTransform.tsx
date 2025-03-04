import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Complex, exp } from "mathjs";
import gsap from "gsap";

// Define the FourierVisualizer component
const FourierVisualizer: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [windingFrequency, setWindingFrequency] = useState(5);
  const width = 800, height = 400;
  
  // Function to generate cosine wave
  const generateCosineWave = (t: number) => Math.cos(2 * Math.PI * t * 2);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous drawings

    // Create Axes
    const xScale = d3.scaleLinear().domain([0, 4]).range([50, width - 50]);
    const yScale = d3.scaleLinear().domain([-1, 1]).range([height - 50, 50]);

    svg.append("g")
      .attr("transform", `translate(0, ${height / 2})`)
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .attr("transform", `translate(50, 0)`)
      .call(d3.axisLeft(yScale));

    // Generate Wave
    const line = d3.line<number>()
      .x((d: any, i: any) => xScale(i / 50 * 4))
      .y((d: any) => yScale(d));

    const waveData = d3.range(0, 50).map((i: any) => generateCosineWave(i / 50 * 4));

    svg.append("path")
      .datum(waveData)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("d", line as any);

    // Fourier Transform Function
    const fourierTransform = (freq: number) => {
      return waveData.map((y: any, i: any) => {
        let t = i / 50 * 4;
        let z = exp(-2 * Math.PI * freq * t * 1j) as Complex;
        return { x: freq, y: y * z.re };
      });
    };

    // Fourier Graph
    const fourierData = fourierTransform(windingFrequency);
    const fourierLine = d3.line<{ x: number; y: number }>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

    svg.append("path")
      .datum(fourierData)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("d", fourierLine as any);

    // GSAP Animation for Frequency Update
    gsap.to(svgRef.current, {
      duration: 2,
      onUpdate: () => {
        const newFreq = 2 + Math.random() * 3;
        setWindingFrequency(newFreq);
      },
    });
  }, [windingFrequency]);

  return (
    <div>
      <h2>Fourier Transform Visualizer</h2>
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
};

export default FourierVisualizer;
