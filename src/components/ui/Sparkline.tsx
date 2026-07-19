interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showDots?: boolean;
  projection?: number; // valor proyectado extra (línea punteada)
}

/** Mini-gráfico de línea en SVG puro (sin dependencias). */
export default function Sparkline({
  data,
  width = 300,
  height = 64,
  color = 'var(--accent)',
  showDots = true,
  projection,
}: SparklineProps) {
  const all = projection !== undefined ? [...data, projection] : data;
  if (all.length === 0) {
    return <div className="faint" style={{ fontSize: 13 }}>Sin datos todavía</div>;
  }
  const pad = 6;
  const min = Math.min(...all);
  const max = Math.max(...all);
  const span = max - min || 1;
  const w = width - pad * 2;
  const h = height - pad * 2;

  const x = (i: number, n: number) => pad + (n <= 1 ? w / 2 : (i / (n - 1)) * w);
  const y = (v: number) => pad + h - ((v - min) / span) * h;

  const pts = data.map((v, i) => `${x(i, data.length)},${y(v)}`);
  const path = pts.length === 1 ? '' : `M ${pts.join(' L ')}`;
  const areaPath =
    pts.length > 1
      ? `M ${pad},${height - pad} L ${pts.join(' L ')} L ${width - pad},${height - pad} Z`
      : '';

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {areaPath && (
        <path d={areaPath} fill={color} opacity={0.1} />
      )}
      {path && <path d={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />}
      {projection !== undefined && data.length >= 1 && (
        <line
          x1={x(data.length - 1, data.length)}
          y1={y(data[data.length - 1])}
          x2={width - pad}
          y2={y(projection)}
          stroke={color}
          strokeWidth={2}
          strokeDasharray="4 4"
          opacity={0.55}
        />
      )}
      {showDots &&
        data.map((v, i) => (
          <circle key={i} cx={x(i, data.length)} cy={y(v)} r={i === data.length - 1 ? 3.5 : 2.5} fill={color} />
        ))}
    </svg>
  );
}
