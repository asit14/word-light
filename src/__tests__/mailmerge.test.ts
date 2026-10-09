import { describe, it, expect } from 'vitest';
import Papa from 'papaparse';
import { MailMergeRecord } from '../types';

describe('Mail Merge Automation', () => {
  const sampleCsv = `FirstName,LastName,Email,Company
Alexander,Wright,alex@example.com,CloudScale
Catherine,Sterling,catherine@example.com,Vertex`;

  it('should parse CSV records and detect columns', () => {
    const parsed = Papa.parse<MailMergeRecord>(sampleCsv, {
      header: true,
      skipEmptyLines: true,
    });

    expect(parsed.data.length).toBe(2);
    expect(parsed.errors.length).toBe(0);

    const fields = Object.keys(parsed.data[0]);
    expect(fields).toEqual(['FirstName', 'LastName', 'Email', 'Company']);
    expect(parsed.data[0].FirstName).toBe('Alexander');
    expect(parsed.data[1].Company).toBe('Vertex');
  });

  it('should interpolate merge fields into template text accurately', () => {
    const template = 'Dear «FirstName» «LastName», welcome to «Company»!';
    const record: MailMergeRecord = {
      FirstName: 'Alexander',
      LastName: 'Wright',
      Company: 'CloudScale',
    };

    let result = template;
    for (const [key, val] of Object.entries(record)) {
      result = result.replace(new RegExp(`«${key}»`, 'g'), val);
    }

    expect(result).toBe('Dear Alexander Wright, welcome to CloudScale!');
  });
});
