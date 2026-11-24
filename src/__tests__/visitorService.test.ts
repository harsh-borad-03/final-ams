import { describe, it, expect, beforeEach } from 'vitest';
import { visitorService } from '../services/visitorService';

describe('AuraVMS Visitor Service Logic', () => {
  it('should fetch initial visitor dataset', async () => {
    const visitors = await visitorService.getVisitors();
    expect(visitors.length).toBeGreaterThan(0);
  });

  it('should register a new visitor with CHECKED_IN status', async () => {
    const newVisitor = await visitorService.addVisitor({
      fullName: 'Test Visitor',
      company: 'Test Corp',
      phone: '+1 555-0199',
      purpose: 'Unit Test Inspection',
    });

    expect(newVisitor).toBeDefined();
    expect(newVisitor.fullName).toBe('Test Visitor');
    expect(newVisitor.status).toBe('CHECKED_IN');
  });

  it('should update visitor status to CHECKED_OUT', async () => {
    const visitors = await visitorService.getVisitors();
    const target = visitors[0];

    const updated = await visitorService.updateVisitorStatus(target.id, 'CHECKED_OUT');
    expect(updated?.status).toBe('CHECKED_OUT');
  });
});
