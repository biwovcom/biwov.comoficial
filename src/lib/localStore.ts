import { existsSync, mkdirSync, appendFileSync, readFileSync } from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.jsonl");
const CONTRATOS_FILE = path.join(DATA_DIR, "contract-acceptances.jsonl");

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function appendJsonLine(file: string, record: Record<string, unknown>) {
  ensureDataDir();
  const line = JSON.stringify({ ...record, guardadoEn: new Date().toISOString() });
  appendFileSync(file, line + "\n", "utf-8");
}

function readJsonLines(file: string): Record<string, unknown>[] {
  if (!existsSync(file)) return [];
  const raw = readFileSync(file, "utf-8").trim();
  if (!raw) return [];
  return raw
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter((r): r is Record<string, unknown> => r !== null)
    .reverse();
}

export function guardarLeadLocal(record: Record<string, unknown>) {
  appendJsonLine(LEADS_FILE, record);
}

export function leerLeadsLocales(): Record<string, unknown>[] {
  return readJsonLines(LEADS_FILE);
}

export function guardarContratoLocal(record: Record<string, unknown>) {
  appendJsonLine(CONTRATOS_FILE, record);
}

export function leerContratosLocales(): Record<string, unknown>[] {
  return readJsonLines(CONTRATOS_FILE);
}
