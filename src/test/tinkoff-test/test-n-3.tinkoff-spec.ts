import * as E from 'fp-ts/lib/Either';
import { cancel, init } from '../..';
import { InitRequestBody } from '../../utils/contracts';
import { getSafeEnv } from '../../utils/env';
import { nanoid } from 'nanoid';

test('Тест №3 Получите результат платежа «Оплачено». Отмените платеж', async () => {
  const password = getSafeEnv('TINKOFF_PASSWORD');
  const terminalKey = getSafeEnv('TINKOFF_TERMINALKEY');
  const id = `TEST ${nanoid(8)}`;
  const paymentData: InitRequestBody = {
    OrderId: id,
    Amount: '140000',
    Description: 'Подарочная карта на 1400.00 рублей',
    DATA: {
      Phone: '+71234567890',
      Email: 'a@test.com',
    },
    Receipt: {
      Email: 'a_a_a@test.ru',
      Phone: '+79031234567',
      EmailCompany: 'b@test.ru',
      Taxation: 'osn',
      Items: [
        {
          Name: 'TEST 1',
          Price: 10000,
          Quantity: 1.0,
          Amount: 10000,
          PaymentMethod: 'full_prepayment',
          PaymentObject: 'commodity',
          Tax: 'vat10',
          Ean13: '0123456789',
        },
        {
          Name: 'TEST 2',
          Price: 20000,
          Quantity: 2.0,
          Amount: 40000,
          PaymentMethod: 'prepayment',
          PaymentObject: 'service',
          Tax: 'vat20',
        },
        {
          Name: 'TEST 3',
          Price: 30000,
          Quantity: 3.0,
          Amount: 90000,
          Tax: 'vat10',
        },
      ],
    },
  };

  const res = await init(paymentData)({ password, terminalKey })();
  expect(E.isRight(res)).toBe(true);
  if (!E.isRight(res)) {
    return;
  }

  expect(res.right.PaymentURL).toBeDefined();
  if (res.right.PaymentURL == null) {
    return;
  }
  const paymentId = res.right.PaymentId;

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(res.right.PaymentURL);
  await page.waitForSelector('#card_cvc', {
    timeout: 10000,
  });

  await page.type('#pan', '4000 0000 0000 0119');
  await page.type('#expDate', '11/22');
  await page.type('#card_cvc', '111');

  await page.click('.submit[type="submit"]');

  await page.waitForSelector('.page_state');

  const res2 = await cancel({
    PaymentId: paymentId,
  })({ password, terminalKey })();
});
