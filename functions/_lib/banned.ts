const SITE_BANNED = [
  /\bccb\b/i,
  /541[-.\s]*422[-.\s]*2372/,
  /422[-.\s]*2372/,
  /257504192/,
  /macadam/i,
  /portland/i,
  /5441\s*s/i,
]

const TITLE_BANNED = [/\bporch(es)?\b/i, /junk\s*removal/i, ...SITE_BANNED]

function firstHit(rules: RegExp[], value: string) {
  return rules.find((rule) => rule.test(value)) || null
}

export function rejectBanned(...values: string[]) {
  for (const value of values) {
    if (firstHit(SITE_BANNED, value)) {
      return "Do not save CCB, 541-422-2372, Portland, or Macadam."
    }
  }
  return null
}

export function rejectJobTitle(...values: string[]) {
  for (const value of values) {
    if (firstHit(TITLE_BANNED, value)) {
      return "Do not use porch, junk removal, CCB, 541-422-2372, Portland, or Macadam."
    }
  }
  return null
}
