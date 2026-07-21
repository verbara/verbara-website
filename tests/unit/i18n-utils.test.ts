import { describe, expect, it } from 'vitest';
import { getLocaleFromPath, getRouteFromPath, localiseHref } from '../../src/i18n/utils';

describe('getLocaleFromPath', () => {
  it('getLocaleFromPath_ShouldReturnDefault_WhenRoot', () => {
    expect(getLocaleFromPath('/')).toBe('es-419');
  });

  it('getLocaleFromPath_ShouldReturnDefault_WhenUnprefixedPath', () => {
    expect(getLocaleFromPath('/pricing/')).toBe('es-419');
  });

  it('getLocaleFromPath_ShouldReturnLocale_WhenEnUsPrefixed', () => {
    expect(getLocaleFromPath('/en-US/')).toBe('en-US');
    expect(getLocaleFromPath('/en-US/pricing/')).toBe('en-US');
  });

  it('getLocaleFromPath_ShouldReturnLocale_WhenPtBrPrefixed', () => {
    expect(getLocaleFromPath('/pt-BR/pricing/')).toBe('pt-BR');
  });

  it('getLocaleFromPath_ShouldReturnDefault_WhenFirstSegmentIsNotALocale', () => {
    expect(getLocaleFromPath('/fr-FR/pricing/')).toBe('es-419');
  });

  it('getLocaleFromPath_ShouldHandlePathWithoutTrailingSlash', () => {
    expect(getLocaleFromPath('/en-US')).toBe('en-US');
  });
});

describe('getRouteFromPath', () => {
  it('getRouteFromPath_ShouldReturnEmpty_WhenRoot', () => {
    expect(getRouteFromPath('/')).toBe('');
  });

  it('getRouteFromPath_ShouldStripDefaultLocaleImplicitly', () => {
    expect(getRouteFromPath('/pricing/')).toBe('pricing');
  });

  it('getRouteFromPath_ShouldStripLocalePrefix', () => {
    expect(getRouteFromPath('/en-US/pricing/')).toBe('pricing');
    expect(getRouteFromPath('/en-US/')).toBe('');
  });

  it('getRouteFromPath_ShouldJoinNestedSegments', () => {
    expect(getRouteFromPath('/pt-BR/solutions/omnichannel/')).toBe('solutions/omnichannel');
    expect(getRouteFromPath('/solutions/omnichannel/')).toBe('solutions/omnichannel');
  });
});

describe('localiseHref', () => {
  it('localiseHref_ShouldReturnRoot_WhenDefaultLocaleAndEmptyRoute', () => {
    expect(localiseHref('', 'es-419')).toBe('/');
  });

  it('localiseHref_ShouldReturnBareRoute_WhenDefaultLocale', () => {
    expect(localiseHref('pricing', 'es-419')).toBe('/pricing/');
  });

  it('localiseHref_ShouldPrefixLocale_WhenNonDefault', () => {
    expect(localiseHref('pricing', 'en-US')).toBe('/en-US/pricing/');
    expect(localiseHref('', 'pt-BR')).toBe('/pt-BR/');
  });

  it('localiseHref_ShouldStripLeadingAndTrailingSlashes_FromRoute', () => {
    expect(localiseHref('/pricing/', 'en-US')).toBe('/en-US/pricing/');
    expect(localiseHref('/pricing/', 'es-419')).toBe('/pricing/');
  });
});
