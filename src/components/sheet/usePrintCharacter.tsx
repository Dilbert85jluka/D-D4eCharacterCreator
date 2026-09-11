import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Character } from '../../types/character';
import { CharacterSheetPrint } from './CharacterSheetPrint';

/**
 * "Save as PDF" plumbing for the read-only character viewer.
 *
 * Uses the browser's own print pipeline rather than a PDF library. On iPad that
 * hands you Print / Save to Files with real selectable text, and it adds nothing
 * to a bundle already close to the 8 MB PWA precache ceiling — html2canvas +
 * jsPDF would have cost roughly a megabyte to produce a *worse* artifact (a
 * flattened bitmap with no text layer and awkward pagination).
 *
 * The sheet is portalled to <body>, not rendered in place: the print stylesheet
 * hides every body child except the print root, and inside the viewer modal it
 * would be trapped under `overflow: hidden` and that subtree's `display: none`.
 */
export function usePrintCharacter(character: Character | null | undefined) {
  const [printing, setPrinting] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  useEffect(() => {
    if (!printing) return;

    // Let React commit the portal and the browser lay it out before opening the
    // dialog — printing a subtree that hasn't been laid out yields blank pages.
    const open = setTimeout(() => {
      window.print();
      // Safari fires `afterprint` unreliably (and not at all in some iOS
      // versions), so a timer also releases the print view. Unmounting early
      // would be harmless — the dialog snapshots the document when it opens.
      const release = setTimeout(() => setPrinting(false), 1000);
      timersRef.current.push(release);
    }, 150);
    timersRef.current.push(open);

    const onAfterPrint = () => setPrinting(false);
    window.addEventListener('afterprint', onAfterPrint);
    return () => {
      window.removeEventListener('afterprint', onAfterPrint);
      clearTimers();
    };
  }, [printing]);

  useEffect(() => clearTimers, []);

  const print = useCallback(() => {
    if (character) setPrinting(true);
  }, [character]);

  const printPortal =
    printing && character
      ? createPortal(<CharacterSheetPrint character={character} />, document.body)
      : null;

  return { print, printing, printPortal };
}
