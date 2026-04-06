export interface RegistryEntry {
  name: string;
  description: string;
}

export const registry: RegistryEntry[] = [
  { name: "feedclaw", description: "RSS/Atom feeds and AI digests" },
  { name: "dustclaw", description: "disk space analysis" },
  { name: "driftclaw", description: "deployment version drift" },
  { name: "dietclaw", description: "codebase health monitoring" },
];
