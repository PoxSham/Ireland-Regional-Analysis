// Utility functions for working with sources registry
// Import sources from the JSON file

import sourcesData from '../data/sources.json';

export function getSource(id) {
  return sourcesData.sources.find(s => s.id === id) || null;
}

export function getSourcesByMetric(metric) {
  return sourcesData.sources.filter(s => s.metrics.includes(metric));
}

export function formatSourceNote(sourceId) {
  const s = getSource(sourceId);
  if (!s) return '';
  let note = `Source: ${s.name}`;
  if (s.table) note += ` · ${s.table}`;
  if (s.year) note += ` · ${s.year}`;
  return note;
}

export function formatCitation(sourceId) {
  const s = getSource(sourceId);
  if (!s) return null;
  return s;
}

export const LAST_UPDATED = '13 April 2026';
export const DATA_YEAR = 2024;
