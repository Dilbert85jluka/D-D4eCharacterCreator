import { v4 as uuidv4 } from 'uuid';
import type { HomebrewItem } from '../types/homebrew';

const FILE_TYPE = 'dnd4e-homebrew';
const FILE_VERSION = 1;

export interface HomebrewExportFile {
  type: 'dnd4e-homebrew';
  version: number;
  exportedAt: string;
  items: HomebrewItem[];
}

export type ImportConflictMode = 'skip' | 'replace' | 'duplicate';

/** Strip campaignIds since they reference local Dexie campaign IDs that don't translate across users. */
function stripCampaignBindings(item: HomebrewItem): HomebrewItem {
  return { ...item, campaignIds: [] };
}

export function buildExport(items: HomebrewItem[]): HomebrewExportFile {
  return {
    type: FILE_TYPE,
    version: FILE_VERSION,
    exportedAt: new Date().toISOString(),
    items: items.map(stripCampaignBindings),
  };
}

export function safeFilename(name: string): string {
  const slug = name.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase();
  return slug || 'item';
}

export function downloadExport(items: HomebrewItem[], filename: string): void {
  const blob = new Blob([JSON.stringify(buildExport(items), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseHomebrewImport(text: string): HomebrewExportFile {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('File is not valid JSON.');
  }
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid file contents.');
  }
  const obj = data as Partial<HomebrewExportFile>;
  if (obj.type !== FILE_TYPE) {
    throw new Error('Not a D&D 4e homebrew export file.');
  }
  if (typeof obj.version !== 'number') {
    throw new Error('Missing version field.');
  }
  if (!Array.isArray(obj.items)) {
    throw new Error('Missing items array.');
  }
  for (const it of obj.items) {
    if (!it || typeof it !== 'object') {
      throw new Error('Items array contains invalid entries.');
    }
    const item = it as HomebrewItem;
    if (!item.id || !item.contentType || !item.name || !item.data) {
      throw new Error('One or more items are missing required fields.');
    }
  }
  return obj as HomebrewExportFile;
}

export interface PreparedImport {
  /** Items to write to Dexie (already de-duplicated per mode). */
  toInsert: HomebrewItem[];
  /** Items in the file whose IDs match something already local. */
  duplicates: HomebrewItem[];
  /** Items in the file with no local match. */
  newItems: HomebrewItem[];
}

export function prepareImport(
  fileItems: HomebrewItem[],
  existing: HomebrewItem[],
  mode: ImportConflictMode,
  importerUserId: string
): PreparedImport {
  const existingMap = new Map(existing.map((i) => [i.id, i]));
  const newItems: HomebrewItem[] = [];
  const duplicates: HomebrewItem[] = [];
  const toInsert: HomebrewItem[] = [];
  const now = Date.now();

  for (const raw of fileItems) {
    const incoming: HomebrewItem = {
      ...raw,
      campaignIds: [],
      createdBy: importerUserId,
    };
    const local = existingMap.get(incoming.id);
    if (!local) {
      newItems.push(incoming);
      toInsert.push(incoming);
      continue;
    }
    duplicates.push(incoming);
    if (mode === 'replace') {
      toInsert.push({ ...incoming, createdAt: local.createdAt, updatedAt: now });
    } else if (mode === 'duplicate') {
      toInsert.push({ ...incoming, id: `homebrew-${uuidv4()}`, createdAt: now, updatedAt: now });
    }
    // 'skip' → do not include in toInsert
  }

  return { toInsert, duplicates, newItems };
}
