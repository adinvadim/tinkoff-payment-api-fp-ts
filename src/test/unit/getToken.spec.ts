import * as sha from 'sha.js';
import { getToken } from '../../index';

describe('getToken', () => {
  test('common behavior', () => {
    const token = getToken({ B: 1, A: 2 }, 'test');
    const testToken = sha('sha256').update('21test').digest('hex');

    expect(token).toBe(testToken);
  });

  test('official tinkoff example', () => {
    const dto = {
      TerminalKey: 'TinkoffBankTest',
      Amount: '100000',
      OrderId: 'TokenExample',
      Description: 'test',
      DATA: {
        Phone: '+71234567890',
        Email: 'a@test.com',
      },
      Receipt: {
        Email: 'a@test.ru',
        Phone: '+79031234567',
        Taxation: 'osn',
        Items: [
          {
            Name: 'Наименование товара 1',
            Price: 10000,
            Quantity: 1.0,
            Amount: 10000,
            Tax: 'vat10',
            Ean13: '0123456789',
          },
        ],
      },
    };
    const token = getToken(dto, 'TinkoffBankTest');
    expect(token).toBe(
      '48d4ca825aab2ede06736d3eae099bd56ac97bd1bcdd598aff210f729de4eb21',
    );
  });
});
