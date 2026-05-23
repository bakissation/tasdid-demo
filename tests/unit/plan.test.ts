import { describe, it, expect } from 'vitest';
import { PLAN } from '@/lib/plan';

describe('PLAN', () => {
  it('is the single "Pro" plan at 5000 DZD', () => {
    expect(PLAN.id).toBe('pro');
    expect(PLAN.amountDinars).toBe(5000);
    expect(PLAN.currency).toBe('DZD');
  });
});
