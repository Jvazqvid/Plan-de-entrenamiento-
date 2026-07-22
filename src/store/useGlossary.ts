// Estado de UI (NO persistido) para el glosario emergente: qué término está
// abierto. Un único <GlossarySheet/> montado en la raíz lo muestra, de modo que
// los muchos <Explain> de la pantalla no montan cada uno su propio modal.
import { create } from 'zustand';

interface GlossaryUI {
  openId: string | null;
  open: (id: string) => void;
  close: () => void;
}

export const useGlossary = create<GlossaryUI>((set) => ({
  openId: null,
  open: (id) => set({ openId: id }),
  close: () => set({ openId: null }),
}));
