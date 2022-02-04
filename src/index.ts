import * as TE from 'fp-ts/lib/TaskEither';
import * as RTE from 'fp-ts/ReaderTaskEither';
import { AxiosError, AxiosResponse } from 'axios';
import { flow, pipe } from 'fp-ts/lib/function';
import * as sha from 'sha.js';
import { axiosCallToTask, UnknownAxiosError } from './utils/axios';
import {
  AddCustomerRequestBody,
  AddCustomerResponseData,
  CancelRequestBody,
  CancelResponseData,
  ChargeRequestBody,
  ChargeResponseData,
  GetCardListRequestBody,
  GetCardListResponseData,
  GetCustomerRequestBody,
  GetCustomerResponseData,
  InitRecurrentRequestBody,
  InitRequestBody,
  InitResponseData,
  RemoveCardRequestBody,
  RemoveCardResponseData,
  TinkoffOptions,
  WithSecrets,
} from './utils/contracts';
import { initRequest } from './utils/request';

export {
  Notify,
  InitRequestBody,
  ReceiptType,
  CancelRequestBody,
  ChargeRequestBody,
  GetCardListRequestBody,
  RemoveCardRequestBody,
  AddCustomerRequestBody,
  RemoveCustomerRequestBody,
  GetCustomerRequestBody,
  Status,
} from './utils/contracts';

export const getToken = <T extends object>(dto: T, password: string) => {
  const data = Object.assign({}, dto, { Password: password });

  /**
   * ts-ignore Потому я хз как сделать type-safe работу этой функции
   */

  /* @ts-ignore */
  delete data['Receipt'];

  /* @ts-ignore */
  delete data['DATA'];

  /* @ts-ignore */
  delete data['Shops'];

  /** Transform to format [{ key: value}, { key: value}] */
  let zipData = Object.keys(data).reduce(
    /* @ts-ignore */
    (acc, curr) => acc.concat([{ [curr]: data[curr] }]),
    [] as any[],
  );

  /** Sort by key */
  zipData = zipData.sort((a, b) => {
    const aString = Object.keys(a)[0];
    const bString = Object.keys(b)[0];
    return bString.localeCompare(aString);
  });

  /** Concat all value */
  const concatString = zipData.reduce(
    (acc, curr) => `${Object.values(curr)[0]}${acc}`,
    '',
  );

  /** SHA-256 */
  return sha('sha256').update(concatString).digest('hex');
};

const basicRequest =
  <T extends object, R>(options: { method: string }) =>
  (
    dto: T,
  ): RTE.ReaderTaskEither<TinkoffOptions, AxiosError | UnknownAxiosError, R> =>
  ({ password, terminalKey }) => {
    const request = initRequest();
    const withTerminalKey = Object.assign({}, dto, {
      TerminalKey: terminalKey,
    });
    const data = Object.assign({}, withTerminalKey, {
      Token: getToken(withTerminalKey, password),
    });
    return pipe(
      axiosCallToTask(() =>
        request.post<R, AxiosResponse<R>, WithSecrets<T>>(options.method, data),
      ),
      TE.map(({ data }) => data),
    );
  };

export const init = basicRequest<InitRequestBody, InitResponseData>({
  method: 'Init',
});

export const cancel = basicRequest<CancelRequestBody, CancelResponseData>({
  method: 'Cancel',
});

export const charge = basicRequest<ChargeRequestBody, ChargeResponseData>({
  method: 'Charge',
});

export const recurrentPayment = (dto: InitRecurrentRequestBody) =>
  pipe(
    init(dto),
    RTE.chain((data) =>
      charge({ PaymentId: data.PaymentId, RebillId: dto.RebillId }),
    ),
  );

export const getCardList = basicRequest<
  GetCardListRequestBody,
  GetCardListResponseData
>({
  method: 'GetCardList',
});

export const removeCard = basicRequest<
  RemoveCardRequestBody,
  RemoveCardResponseData
>({
  method: 'RemoveCard',
});

export const addCustomer = basicRequest<
  AddCustomerRequestBody,
  AddCustomerResponseData
>({
  method: 'AddCustomer',
});

export const removeCustomer = basicRequest<
  RemoveCardRequestBody,
  RemoveCardResponseData
>({
  method: 'RemoveCustomer',
});
export const getCustomer = basicRequest<
  GetCustomerRequestBody,
  GetCustomerResponseData
>({
  method: 'GetCustomer',
});
