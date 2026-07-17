import { calculateTotals } from '../calculate-totals';

describe('calculateTotals', () => {
  it('computes subtotal, tax and total for the Appendix A invoice', () => {
    const r = calculateTotals({ quantity: 2, rate: 1000, taxPercent: 10, discount: 20 });
    expect(r.subTotal).toBe('2000.00');
    expect(r.taxAmount).toBe('200.00');
    expect(r.totalAmount).toBe('2180.00'); // 2000 + 200 - 20
  });

  it('handles zero tax and zero discount', () => {
    const r = calculateTotals({ quantity: 3, rate: '10.5', taxPercent: 0, discount: 0 });
    expect(r.subTotal).toBe('31.50');
    expect(r.taxAmount).toBe('0.00');
    expect(r.totalAmount).toBe('31.50');
  });

  it('does not lose precision (no float drift)', () => {
    const r = calculateTotals({ quantity: 3, rate: '0.10', taxPercent: 10, discount: 0 });
    expect(r.subTotal).toBe('0.30');
    expect(r.taxAmount).toBe('0.03');
    expect(r.totalAmount).toBe('0.33');
  });
});
