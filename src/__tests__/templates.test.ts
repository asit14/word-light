import { describe, it, expect } from 'vitest';
import { TEMPLATES } from '../templates/sampleDocuments';

describe('Document Templates Library', () => {
  it('should include all 10 required professional templates', () => {
    expect(TEMPLATES.length).toBe(10);
    const templateIds = TEMPLATES.map((t) => t.id);

    expect(templateIds).toContain('blank');
    expect(templateIds).toContain('resume');
    expect(templateIds).toContain('cover-letter');
    expect(templateIds).toContain('business-letter');
    expect(templateIds).toContain('meeting-minutes');
    expect(templateIds).toContain('project-report');
    expect(templateIds).toContain('academic-assignment');
    expect(templateIds).toContain('research-paper');
    expect(templateIds).toContain('invoice');
    expect(templateIds).toContain('simple-business-proposal');
  });

  it('each template should have descriptive names, categories, and non-empty HTML content', () => {
    TEMPLATES.forEach((template) => {
      expect(template.name.length).toBeGreaterThan(0);
      expect(template.description.length).toBeGreaterThan(0);
      expect(['General', 'Career', 'Business', 'Academic']).toContain(template.category);
      expect(template.htmlContent).toBeDefined();
    });
  });
});
