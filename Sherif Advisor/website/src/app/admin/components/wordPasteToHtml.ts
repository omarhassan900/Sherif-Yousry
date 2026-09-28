/**
 * wordPasteToHtml.ts
 *
 * Converts HTML pasted from Microsoft Word into clean service-content HTML.
 *
 * Handles two cases:
 *  1. "Approach / Steps" block — detects "Step N" labels and groups them into
 *     a <ul class="service-steps"> 2-column grid.
 *  2. Everything else — strips Word-specific markup and returns clean HTML.
 *
 * The converter works on the *plain-text lines* extracted from the Word HTML
 * so it is immune to the unpredictable inline styles and namespace clutter
 * that Word embeds in its clipboard HTML.
 */

/** Strip every HTML tag and return raw text, collapsing whitespace. */
function stripTags(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'");
}

/** True if a line looks like "Step 1", "Step 2", "الخطوة 1", etc. */
function isStepLabel(line: string): boolean {
  return /^(step\s*\d+|الخطوة\s*\d+|\d+\.\s*step|\bخطوة\s*\d+)/i.test(line.trim());
}

/**
 * Escape HTML special chars for safe text insertion.
 */
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

interface StepEntry {
  num: string;
  title: string;
  body: string;
}

/**
 * Try to extract a steps block from an array of plain-text lines.
 * Returns null if no step pattern is found.
 *
 * Expected structure (from Word):
 *   Step 1          ← step label
 *   Diagnose        ← title (next non-empty line)
 *   Review returns… ← body (remaining lines until next step label)
 *   Step 2
 *   …
 */
function extractSteps(lines: string[]): StepEntry[] | null {
  // Find the index of the first step label
  const firstIdx = lines.findIndex(isStepLabel);
  if (firstIdx === -1) return null;

  const steps: StepEntry[] = [];
  let i = firstIdx;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!isStepLabel(line)) { i++; continue; }

    const num = line;
    i++;

    // Title = next non-empty line
    let title = '';
    while (i < lines.length && !lines[i].trim()) i++;
    if (i < lines.length && !isStepLabel(lines[i].trim())) {
      title = lines[i].trim();
      i++;
    }

    // Body = remaining non-empty lines until the next step label
    const bodyLines: string[] = [];
    while (i < lines.length && !isStepLabel(lines[i].trim())) {
      const l = lines[i].trim();
      if (l) bodyLines.push(l);
      i++;
    }

    steps.push({ num, title, body: bodyLines.join(' ') });
  }

  return steps.length >= 2 ? steps : null;
}

/**
 * Build the <ul class="service-steps">…</ul> HTML from extracted steps.
 */
function buildStepsHtml(steps: StepEntry[]): string {
  const items = steps
    .map(
      (s) => `<li class="service-step">` +
        `<span class="service-step-num">${esc(s.num)}</span>` +
        `<span class="service-step-title">${esc(s.title)}</span>` +
        (s.body ? `<p class="service-step-body">${esc(s.body)}</p>` : '') +
        `</li>`
    )
    .join('\n');
  return `<ul class="service-steps">\n${items}\n</ul>`;
}

/**
 * Remove Word-specific junk from raw HTML while keeping structure.
 */
function stripWordGarbage(html: string): string {
  return html
    .replace(/<o:p>[\s\S]*?<\/o:p>/gi, '')
    .replace(/<w:[^>]*>[\s\S]*?<\/w:[^>]*>/gi, '')
    .replace(/<m:[^>]*>[\s\S]*?<\/m:[^>]*>/gi, '')
    .replace(/class="Mso[^"]*"/gi, '')
    .replace(/style="[^"]*mso-[^"]*"/gi, '')
    .replace(/<span\s*>/gi, '')        // empty spans
    .replace(/<span[^>]*>\s*<\/span>/gi, '')
    .replace(/<!--[\s\S]*?-->/gi, '')
    .replace(/<meta[^>]*>/gi, '')
    .replace(/<link[^>]*>/gi, '');
}

/**
 * Main entry point.
 *
 * Pass the raw HTML string that arrives in `transformPastedHTML`.
 * Returns a clean HTML string suitable for loading into Tiptap.
 */
export function wordPasteToHtml(html: string): string {
  const clean = stripWordGarbage(html);
  const plainText = stripTags(clean);
  const lines = plainText.split('\n').map((l) => l.trim()).filter(Boolean);

  const steps = extractSteps(lines);
  if (!steps) {
    // No step pattern — return stripped Word HTML as-is
    return clean;
  }

  // Find lines that come BEFORE the first step label to use as a preamble
  const firstStepIdx = lines.findIndex(isStepLabel);
  const preambleLines = lines.slice(0, firstStepIdx);

  const parts: string[] = [];

  // Preamble: render each line as a <p> (section heading gets <h2>)
  for (const line of preambleLines) {
    // Heuristic: short lines (≤60 chars) with no period are section headings
    const isHeading = line.length <= 60 && !line.endsWith('.');
    parts.push(isHeading ? `<h2>${esc(line)}</h2>` : `<p>${esc(line)}</p>`);
  }

  parts.push(buildStepsHtml(steps));

  return parts.join('\n');
}
