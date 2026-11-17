// YOLO7 English brand tokens (docs/02-concept-kenh.md — Bộ nhận diện)
export const COLORS = {
  outline: '#3D2C29',
  wallYellow: '#F2C14E',
  doorGreen: '#2E7D5B',
  stoolRed: '#D7263D',
  plateBlue: '#2B6CB0',
  cream: '#FFF4E0',
  mouthInside: '#8B2E2E',
  tongue: '#E07A7A',
  teeth: '#FFFFFF',
  viText: '#6B4A3F',
  highlight: '#F2C14E',
};

// Speaker name colours on subtitles
export const SPEAKER = {
  tin: { name: 'TÍN', color: '#D7263D' },
  jake: { name: 'JAKE', color: '#2B6CB0' },
  'co-ba': { name: 'CÔ BA', color: '#7B3FA0' },
  tony: { name: 'TONY', color: '#2E7D5B' },
  sam: { name: 'SAM', color: '#3D2C29' },
} as Record<string, { name: string; color: string }>;
