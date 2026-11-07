import { describe, expect, it } from 'vitest';
import { detectPhone } from './platform';

describe('detectPhone', () => {
  it('recognizes iPhone, iPad and Android', () => {
    expect(detectPhone('Mozilla/5.0 (iPhone; CPU iPhone OS 27_2 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1')).toBe('ios');
    expect(detectPhone('Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)')).toBe('ios');
    expect(detectPhone('Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36')).toBe('android');
  });

  it('treats a touch Mac as an iPad but a desktop Mac as other', () => {
    const mac = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15';
    expect(detectPhone(mac, 5)).toBe('ios');
    expect(detectPhone(mac, 0)).toBe('other');
  });
});
