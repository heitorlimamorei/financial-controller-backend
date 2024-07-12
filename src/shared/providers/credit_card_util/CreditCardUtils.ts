import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class CreditCardUtils {
  isValidCreditCardNumber(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\D/g, '');
    let sum = 0;
    let shouldDouble = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

  getCreditCardFlag(cardNumber: string): string | null {
    const cleaned = cardNumber.replace(/\D/g, '');

    const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
    const masterCardRegex =
      /^(5[1-5][0-9]{14}|2(2[2-9][1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[01][0-9]{13}|720[0-9]{12}))$/;
    const eloRegex =
      /^(?:4011(78|79)|4312(74|76|77)|438935|451416|457393|4576(31|32)|5041(75|76|77|78|94)|50(67(38|39)|6368|6516(52|53)|6550(00|01|02)))\d{10}$/;

    if (visaRegex.test(cleaned)) {
      return 'visa';
    } else if (masterCardRegex.test(cleaned)) {
      return 'mastercard';
    } else if (eloRegex.test(cleaned)) {
      return 'elo';
    } else {
      return null;
    }
  }

  generateRandomCardNumber(brand: string): string {
    let prefix: string;

    const calculateCheckDigit = (baseNumber: string): string => {
      let sum = 0;
      let shouldDouble = true;

      for (let i = baseNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(baseNumber.charAt(i), 10);

        if (shouldDouble) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }

        sum += digit;
        shouldDouble = !shouldDouble;
      }

      const mod10 = sum % 10;
      return (mod10 === 0 ? 0 : 10 - mod10).toString();
    };

    const generateRandomDigits = (length: number): string => {
      let digits = '';
      for (let i = 0; i < length; i++) {
        digits += Math.floor(Math.random() * 10).toString();
      }
      return digits;
    };

    switch (brand.toLowerCase()) {
      case 'visa':
        prefix = '4';
        break;
      case 'mastercard':
        prefix = '5' + (Math.floor(Math.random() * 5) + 1);
        break;
      case 'elo':
        const eloPrefixes = [
          '401178',
          '401179',
          '431274',
          '431276',
          '431277',
          '438935',
          '451416',
          '457393',
          '457631',
          '457632',
          '504175',
          '504176',
          '504177',
          '504178',
          '504794',
          '506738',
          '506739',
          '636368',
          '651652',
          '651653',
          '655000',
          '655001',
          '655002',
        ];
        prefix = eloPrefixes[Math.floor(Math.random() * eloPrefixes.length)];
        break;
      default:
        throw new HttpException('SERVICE: Card Brand(flag) Invalid', 500);
    }

    const cardLength = brand.toLowerCase() === 'elo' ? 16 : 16;
    const baseCardNumber =
      prefix + generateRandomDigits(cardLength - prefix.length - 1);

    return baseCardNumber + calculateCheckDigit(baseCardNumber);
  }
}
