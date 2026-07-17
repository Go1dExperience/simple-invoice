import { deriveStatus } from '../derive-status';

const today = new Date('2026-07-17');

describe('deriveStatus', () => {
  it('returns Overdue when an unpaid invoice is past its due date', () => {
    expect(deriveStatus('Pending', new Date('2026-07-01'), today)).toBe('Overdue');
    expect(deriveStatus('Draft', new Date('2026-07-01'), today)).toBe('Overdue');
  });
  it('never marks a Paid invoice Overdue even if past due', () => {
    expect(deriveStatus('Paid', new Date('2026-01-01'), today)).toBe('Paid');
  });
  it('returns the persisted status when not past due', () => {
    expect(deriveStatus('Pending', new Date('2026-08-01'), today)).toBe('Pending');
    expect(deriveStatus('Draft', new Date('2026-07-17'), today)).toBe('Draft'); // due today is not past
  });
});
