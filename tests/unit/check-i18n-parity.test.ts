import { describe, expect, it } from 'vitest';
import { flatten, checkParity } from '../../scripts/check-i18n-parity.mjs';
import { LOCALES, MESSAGES } from '../../src/i18n/messages';

describe('flatten', () => {
  it('flatten_ShouldProduceDotPaths_WhenNested', () => {
    const out = flatten({ a: { b: { c: 'x' } }, d: 'y' });
    expect(out).toEqual({ 'a.b.c': 'x', d: 'y' });
  });

  it('flatten_ShouldTreatArraysAsLeaves', () => {
    const out = flatten({ list: ['one', 'two'] });
    expect(out).toEqual({ list: ['one', 'two'] });
  });

  it('flatten_ShouldReturnEmptyObject_WhenInputEmpty', () => {
    expect(flatten({})).toEqual({});
  });

  it('flatten_ShouldPreserveEmptyStringLeaves', () => {
    const out = flatten({ a: { b: '' } });
    expect(out).toEqual({ 'a.b': '' });
  });
});

describe('checkParity', () => {
  it('checkParity_ShouldReportOk_WhenAllLocalesMatchReference', () => {
    const messages = {
      'es-419': { nav: { home: 'Inicio' } },
      'en-US': { nav: { home: 'Home' } },
    };
    const result = checkParity(['es-419', 'en-US'], messages);
    expect(result.ok).toBe(true);
    expect(result.refKeyCount).toBe(1);
    expect(result.problems).toEqual({});
  });

  it('checkParity_ShouldReportMissing_WhenLocaleLacksKey', () => {
    const messages = {
      'es-419': { nav: { home: 'Inicio', pricing: 'Precios' } },
      'en-US': { nav: { home: 'Home' } },
    };
    const result = checkParity(['es-419', 'en-US'], messages);
    expect(result.ok).toBe(false);
    expect(result.problems['en-US'].missing).toContain('nav.pricing');
  });

  it('checkParity_ShouldReportExtra_WhenLocaleHasSurplusKey', () => {
    const messages = {
      'es-419': { nav: { home: 'Inicio' } },
      'en-US': { nav: { home: 'Home', extra: 'Extra' } },
    };
    const result = checkParity(['es-419', 'en-US'], messages);
    expect(result.ok).toBe(false);
    expect(result.problems['en-US'].extra).toContain('nav.extra');
  });

  it('checkParity_ShouldReportEmpty_WhenLeafIsBlank', () => {
    const messages = {
      'es-419': { nav: { home: 'Inicio' } },
      'en-US': { nav: { home: '' } },
    };
    const result = checkParity(['es-419', 'en-US'], messages);
    expect(result.ok).toBe(false);
    expect(result.problems['en-US'].empty).toContain('nav.home');
  });

  it('checkParity_ShouldReportEmpty_WhenLeafIsNull', () => {
    const messages = {
      'es-419': { nav: { home: 'Inicio' } },
      'en-US': { nav: { home: null } },
    };
    const result = checkParity(['es-419', 'en-US'], messages);
    expect(result.ok).toBe(false);
    expect(result.problems['en-US'].empty).toContain('nav.home');
  });
});

describe('checkParity — live MESSAGES', () => {
  it('checkParity_ShouldPass_WhenRealLocaleBundleIsInParity', () => {
    const result = checkParity(LOCALES, MESSAGES);
    expect(result.ok).toBe(true);
    expect(result.refKeyCount).toBeGreaterThan(0);
    expect(result.problems).toEqual({});
  });

  it('MESSAGES_ShouldHaveAllThreeLocales', () => {
    expect(LOCALES).toEqual(['es-419', 'en-US', 'pt-BR']);
    for (const locale of LOCALES) {
      expect(MESSAGES[locale]).toBeDefined();
    }
  });
});
