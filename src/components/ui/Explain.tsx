import type { ReactNode } from 'react';
import Modal from '@/components/ui/Modal';
import { useGlossary } from '@/store/useGlossary';
import { GLOSSARY_BY_ID } from '@/data/glossary';

/**
 * Marca un término/abreviatura/icono como explicable: se muestra con un sutil
 * subrayado punteado y, al tocarlo, abre el glosario con su significado y para
 * qué sirve. Un único <GlossarySheet/> (en la raíz) renderiza la explicación.
 *
 *   <Explain id="rir">RIR</Explain>          → envuelve texto
 *   <Explain id="icon-fire" plain>🔥</Explain> → icono, sin subrayado
 */
export function Explain({
  id,
  children,
  plain = false,
}: {
  id: string;
  children: ReactNode;
  plain?: boolean;
}) {
  const open = useGlossary((s) => s.open);
  const known = id in GLOSSARY_BY_ID;
  if (!known) return <>{children}</>; // término sin ficha: no rompe la UI

  return (
    <button
      type="button"
      className={plain ? 'explain-icon' : 'explain'}
      onClick={(e) => {
        e.stopPropagation();
        open(id);
      }}
      aria-label={`Qué significa: ${GLOSSARY_BY_ID[id].term}`}
    >
      {children}
    </button>
  );
}

/** Renderiza la ficha del término abierto. Montar UNA sola vez en la raíz. */
export function GlossarySheet() {
  const openId = useGlossary((s) => s.openId);
  const close = useGlossary((s) => s.close);
  const open = useGlossary((s) => s.open);
  if (!openId) return null;
  const entry = GLOSSARY_BY_ID[openId];
  if (!entry) return null;

  // Enlaces [[id]] dentro del cuerpo → botones que saltan a otra ficha.
  const renderBody = (text: string) => {
    const parts = text.split(/(\[\[[a-z0-9-]+\]\])/g);
    return parts.map((p, i) => {
      const m = p.match(/^\[\[([a-z0-9-]+)\]\]$/);
      if (m && GLOSSARY_BY_ID[m[1]]) {
        const target = GLOSSARY_BY_ID[m[1]];
        return (
          <button key={i} type="button" className="glossary-link" onClick={() => open(target.id)}>
            {target.term}
          </button>
        );
      }
      return <span key={i}>{p}</span>;
    });
  };

  return (
    <Modal onClose={close}>
      <div className="glossary-card">
        <div className="glossary-term">{entry.term}</div>
        <div className="glossary-title">{entry.title}</div>
        <p className="glossary-short">{entry.short}</p>
        <p className="glossary-body">
          {entry.body.split('\n\n').map((para, i) => (
            <span key={i} style={{ display: 'block', marginTop: i ? 10 : 0 }}>
              {renderBody(para)}
            </span>
          ))}
        </p>
        {entry.example && (
          <div className="glossary-example">
            <span className="glossary-example-tag">EJEMPLO</span>
            {entry.example}
          </div>
        )}
      </div>
    </Modal>
  );
}
