import { describe, it, expect } from 'vitest';
import { extractEvidence } from '../extractEvidence';

describe('Evidence Extractor', () => {
  it('1. complete narrative extracts all fields', async () => {
    const message = "I was at work writing an email when my phone rang. I checked it and lost my train of thought.";
    const result = await extractEvidence(message);
    
    expect(result.evidence.situation).toBe('At work');
    expect(result.evidence.startingPoint).toBe('Writing an email');
    expect(result.evidence.shift).toBe('Phone rang');
    expect(result.evidence.action).toBe('Checked phone');
    expect(result.evidence.outcome).toBe('Lost train of thought');
  });

  it('2. partial narrative extracts available fields', async () => {
    const message = "I was at work and the phone rang.";
    const result = await extractEvidence(message);
    
    expect(result.evidence.situation).toBe('At work');
    expect(result.evidence.shift).toBe('Phone rang');
    expect(result.evidence.startingPoint).toBeUndefined();
    expect(result.evidence.action).toBeUndefined();
    expect(result.evidence.outcome).toBeUndefined();
  });

  it('3. vague statement extracts nothing', async () => {
    const message = "I don't know, just stuff happened.";
    const result = await extractEvidence(message);
    
    expect(result.evidence.situation).toBeUndefined();
    expect(result.evidence.startingPoint).toBeUndefined();
    expect(result.evidence.shift).toBeUndefined();
    expect(result.evidence.action).toBeUndefined();
    expect(result.evidence.outcome).toBeUndefined();
  });

  it('4. missing shift is handled correctly', async () => {
    const message = "I was at work writing an email. I checked it and lost my train of thought.";
    const result = await extractEvidence(message);
    
    expect(result.evidence.situation).toBe('At work');
    expect(result.evidence.startingPoint).toBe('Writing an email');
    expect(result.evidence.shift).toBeUndefined();
    expect(result.evidence.action).toBe('Checked phone');
    expect(result.evidence.outcome).toBe('Lost train of thought');
  });

  it('5. missing outcome is handled correctly', async () => {
    const message = "I was at work writing an email when my phone rang. I checked it.";
    const result = await extractEvidence(message);
    
    expect(result.evidence.situation).toBe('At work');
    expect(result.evidence.startingPoint).toBe('Writing an email');
    expect(result.evidence.shift).toBe('Phone rang');
    expect(result.evidence.action).toBe('Checked phone');
    expect(result.evidence.outcome).toBeUndefined();
  });

  it('6. no invented fields (confirms undefined for non-present fields)', async () => {
    const message = "Writing an email.";
    const result = await extractEvidence(message);
    
    expect(result.evidence.startingPoint).toBe('Writing an email');
    expect(result.evidence.situation).toBeUndefined();
    expect(result.evidence.shift).toBeUndefined();
    expect(result.evidence.action).toBeUndefined();
    expect(result.evidence.outcome).toBeUndefined();
  });

  it('7. deterministic parsing behaviour (same input gives same output)', async () => {
    const message = "I was at work writing an email when my phone rang. I checked it and lost my train of thought.";
    const result1 = await extractEvidence(message);
    const result2 = await extractEvidence(message);
    
    expect(result1.evidence).toEqual(result2.evidence);
  });
});
