import { describe, it, expect } from 'vitest';
import { normalizzaStringa, normalizzaPrezzo } from '../../scripts/lib/xlsx';

describe('Import Excel - Normalizzazione', () => {
  describe('normalizzaStringa', () => {
    it('dovrebbe normalizzare stringhe con spazi multipli', () => {
      expect(normalizzaStringa('  Pasta   Penne  500g  ')).toBe('Pasta Penne 500g');
    });

    it('dovrebbe gestire valori null/undefined', () => {
      expect(normalizzaStringa(null)).toBe('');
      expect(normalizzaStringa(undefined)).toBe('');
    });

    it('dovrebbe convertire numeri in stringhe', () => {
      expect(normalizzaStringa(123)).toBe('123');
    });

    it('dovrebbe preservare maiuscole/minuscole', () => {
      expect(normalizzaStringa('Coca Cola 330ml')).toBe('Coca Cola 330ml');
    });
  });

  describe('normalizzaPrezzo', () => {
    it('dovrebbe convertire stringhe con virgola in numeri', () => {
      expect(normalizzaPrezzo('12,50')).toBe(12.5);
      expect(normalizzaPrezzo('1,99')).toBe(1.99);
    });

    it('dovrebbe convertire stringhe con punto in numeri', () => {
      expect(normalizzaPrezzo('12.50')).toBe(12.5);
      expect(normalizzaPrezzo('1.99')).toBe(1.99);
    });

    it('dovrebbe gestire valori con simboli di valuta', () => {
      expect(normalizzaPrezzo('€ 12,50')).toBe(12.5);
      expect(normalizzaPrezzo('$ 1.99')).toBe(1.99);
    });

    it('dovrebbe gestire valori null/undefined/vuoti', () => {
      expect(normalizzaPrezzo(null)).toBe(null);
      expect(normalizzaPrezzo(undefined)).toBe(null);
      expect(normalizzaPrezzo('')).toBe(null);
      expect(normalizzaPrezzo('   ')).toBe(null);
    });

    it('dovrebbe rifiutare valori negativi', () => {
      expect(normalizzaPrezzo('-12.50')).toBe(null);
      expect(normalizzaPrezzo('-1,99')).toBe(null);
    });

    it('dovrebbe rifiutare valori non numerici', () => {
      expect(normalizzaPrezzo('abc')).toBe(null);
      expect(normalizzaPrezzo('N/A')).toBe(null);
    });

    it('dovrebbe arrotondare a 2 decimali', () => {
      expect(normalizzaPrezzo('12.999')).toBe(13);
      expect(normalizzaPrezzo('12.994')).toBe(12.99);
    });

    it('dovrebbe gestire numeri interi', () => {
      expect(normalizzaPrezzo(15)).toBe(15);
      expect(normalizzaPrezzo('15')).toBe(15);
    });
  });
});
