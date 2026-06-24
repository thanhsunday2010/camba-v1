/**
 * M3.4 — Certification registry for inventory management.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import type {
  MockCertificationRecord,
  MockCertificationResult,
} from "@/lib/cambridge-assessment/certification/mock-certification-types";

export const CERTIFICATION_REGISTRY_ROOT = resolve(
  process.cwd(),
  "data/cambridge-certification"
);

export type CertificationRegistryFile = {
  registryVersion: "1.0.0";
  updatedAt: string;
  records: MockCertificationRecord[];
};

const inMemoryRecords = new Map<string, MockCertificationRecord>();

function recordKey(mockId: string, version: string): string {
  return `${mockId}::${version}`;
}

function registryPath(root = CERTIFICATION_REGISTRY_ROOT): string {
  return join(root, "certification-registry.json");
}

export function resultToRecord(result: MockCertificationResult): MockCertificationRecord {
  return {
    mockId: result.mockId,
    version: result.version,
    level: result.level,
    source: result.source,
    certificationLevel: result.levelAssigned,
    certificationScore: result.metrics.certificationScore,
    coverageScore: result.metrics.coverageScore,
    qaScore: result.metrics.qaScore,
    diversityScore: result.metrics.diversityScore,
    certifiedAt: result.certifiedAt,
    notes: result.notes,
  };
}

export function registerCertification(
  result: MockCertificationResult,
  options: { persist?: boolean; rootDir?: string } = {}
): MockCertificationRecord {
  const record = resultToRecord(result);
  inMemoryRecords.set(recordKey(record.mockId, record.version), record);
  if (options.persist !== false) {
    persistRegistry(loadRegistry(options.rootDir), options.rootDir);
  }
  return record;
}

export function getCertification(
  mockId: string,
  version: string,
  rootDir?: string
): MockCertificationRecord | null {
  const key = recordKey(mockId, version);
  if (inMemoryRecords.has(key)) return inMemoryRecords.get(key)!;
  const file = loadRegistry(rootDir);
  return file.records.find((r) => r.mockId === mockId && r.version === version) ?? null;
}

export function listCertifications(options: {
  level?: CambridgeExamLevel;
  rootDir?: string;
} = {}): MockCertificationRecord[] {
  const file = loadRegistry(options.rootDir);
  for (const r of file.records) {
    inMemoryRecords.set(recordKey(r.mockId, r.version), r);
  }
  let records = [...inMemoryRecords.values()];
  if (options.level) records = records.filter((r) => r.level === options.level);
  return records.sort((a, b) => b.certifiedAt.localeCompare(a.certifiedAt));
}

export function loadRegistry(rootDir = CERTIFICATION_REGISTRY_ROOT): CertificationRegistryFile {
  const path = registryPath(rootDir);
  if (!existsSync(path)) {
    return { registryVersion: "1.0.0", updatedAt: new Date().toISOString(), records: [] };
  }
  return JSON.parse(readFileSync(path, "utf8")) as CertificationRegistryFile;
}

export function persistRegistry(
  file: CertificationRegistryFile,
  rootDir = CERTIFICATION_REGISTRY_ROOT
): string {
  mkdirSync(rootDir, { recursive: true });
  const merged = new Map<string, MockCertificationRecord>();
  for (const r of file.records) merged.set(recordKey(r.mockId, r.version), r);
  for (const r of inMemoryRecords.values()) merged.set(recordKey(r.mockId, r.version), r);

  const out: CertificationRegistryFile = {
    registryVersion: "1.0.0",
    updatedAt: new Date().toISOString(),
    records: [...merged.values()],
  };
  const path = registryPath(rootDir);
  writeFileSync(path, JSON.stringify(out, null, 2), "utf8");
  return path;
}

export function clearInMemoryRegistry(): void {
  inMemoryRecords.clear();
}
