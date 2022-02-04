export interface TinkoffOptions {
  password: string;
  terminalKey: string;
}

enum TaxationEnum {
  OSN = 'osn',
  USN_INCOME = 'usn_income',
  USN_INCOME_OUTCOME = 'usn_income_outcome',
  PATENT = 'patent',
  ENVD = 'envd',
  ESN = 'esn',
}
export type Taxation = `${TaxationEnum}`;

enum TaxEnum {
  NONE = 'none',
  VAT0 = 'vat0',
  VAT10 = 'vat10',
  VAT20 = 'vat20',
  VAT110 = 'vat110',
  VAT120 = 'vat120',
}

export type Tax = `${TaxEnum}`;

enum PaymentMethodEnum {
  FULL_PAYMENT = 'full_payment',
  FULL_PREPAYMENT = 'full_prepayment',
  PREPAYMENT = 'prepayment',
  ADVANCE = 'advance',
  PARTIAL_PAYMENT = 'partial_payment',
  CREDIT = 'credit',
  CREDIT_PAYMENT = 'credit_payment',
}

export type PaymentMethod = `${PaymentMethodEnum}`;

enum PaymentObjectEnum {
  COMMODITY = 'commodity',
  EXCISE = 'excise',
  JOB = 'job',
  SERVICE = 'service',
  GAMBLING_BET = 'gambling_bet',
  GAMBLING_PRIZE = 'gambling_prize',
  LOTTERY = 'lottery',
  LOTTERY_PRIZE = 'lottery_prize',
  INTELLECTUAL_ACTIVITY = 'intellectual_activity',
  PAYMENT = 'payment',
  AGENT_COMMISSION = 'agent_commission',
  COMPOSITE = 'composite',
  ANOTHER = 'another',
}

export type PaymentObject = `${PaymentObjectEnum}`;

export type WithSecrets<T> = T & { Token: string; TerminalKey: string };

export interface ReceiptType {
  Taxation: Taxation;
  Email: string;
  Items: {
    Tax: Tax;
    Name: string;
    Quantity: number;
    Amount: number;
    Price: number;
    PaymentMethod?: PaymentMethod;
    PaymentObject?: PaymentObject;
    Ean13?: string;
    AgentData?: Record<string, string | string[]>;
    SupplierInfo?: Record<string, string | string[]>;
  }[];
  Phone?: string;
  EmailCompany?: string;
  Payments?: {
    Electronic: number;
    Cash?: number;
    AdvancePayment?: number;
    Credit?: number;
    Provision?: number;
  };
}

export interface InitRequestBody {
  Amount: string | number;
  OrderId: string;
  IP?: string;
  Description?: string;
  Language?: string;
  Recurrent?: 'Y';
  CustomerKey?: string;
  RedirectDueDate?: string;
  NotificationURL?: string;
  SuccessURL?: string;
  FailURL?: string;
  PayType?: 'O' | 'T';
  Receipt: ReceiptType;
  DATA: Record<string, string>;
}

export interface InitResponseData {
  Success: boolean;
  TerminalKey: string;
  PaymentId: string;
  Amount: number;
  OrderId: string;
  Status?: string;
  ErrorCode: string;
  PaymentURL?: string;
  Message?: string;
  Details?: string;
}

export interface InitRecurrentRequestBody extends InitRequestBody {
  RebillId: string;
}

export interface CancelRequestBody {
  PaymentId: string;
  Amount?: number;
  IP?: string;
  Receipt?: ReceiptType;
}

export interface CancelResponseData {
  Success: boolean;
  TerminalKey: string;
  OrderId: string;
  Status: string;
  PaymentId: string;
  ErrorCode: string;
  OriginalAmount: number;
  NewAmount: number;
  Message?: string;
  Details?: string;
}

export interface ChargeRequestBody {
  PaymentId: string;
  RebillId: string;
  SendEmail?: boolean;
  InfoEmail?: string;
  IP?: string;
}

export interface ChargeResponseData {
  Success: boolean;
  TerminalKey: string;
  PaymentId: string;
  Amount: number;
  OrderId: string;
  Status: string;
  ErrorCode: string;
  Message?: string;
  Details?: string;
}

export interface GetCardListRequestBody {
  CustomerKey: string;
  IP?: string;
}

export interface GetCardListResponseData {
  CardId: string;
  Pan: string;
  ExpDate: string;
  CardType: '0' | '1' | '2';
  Status: 'A' | 'I' | 'D';
  RebillId?: string;
}

export interface RemoveCardRequestBody {
  CustomerKey: string;
  CardId: string;
  IP?: string;
}

export interface RemoveCardResponseData {
  Success: boolean;
  TerminalKey: string;
  CustomerKey: string;
  CardId: string;
  Status: string;
  CardType: string;
  ErrorCode?: string;
  Message?: string;
  Details?: string;
}

export interface AddCustomerRequestBody {
  CustomerKey: string;
  Email?: string;
  Phone?: string;
  IP?: string;
}

export interface AddCustomerResponseData {
  Success: boolean;
  TerminalKey: string;
  CustomerKey: string;
  ErrorCode?: string;
  Message?: string;
  Details?: string;
}

export interface RemoveCustomerRequestBody {
  CustomerKey: string;
  IP?: string;
}

export interface RemoveCustomerResponseData {
  Success: boolean;
  TerminalKey: string;
  CustomerKey: string;
  ErrorCode?: string;
  Message?: string;
  Details?: string;
}

export interface GetCustomerRequestBody {
  CustomerKey: string;
  IP?: string;
}

export interface GetCustomerResponseData {
  Success: boolean;
  TerminalKey: string;
  CustomerKey: string;
  Email?: string;
  Phone?: string;
  ErrorCode?: string;
  Message?: string;
  Details?: string;
}

enum StatusEnum {
  AUTHORIZED = 'AUTHORIZED',
  REVERSED = 'REVERSED',
  CONFIRMED = 'CONFIRMED',
  PARTIAL_REFUNDED = 'PARTIAL_REFUNDED',
  PARTIAL_REVERSED = 'PARTIAL_REVERSED',
  REFUNDED = 'REFUNDED',
  REJECTED = 'REJECTED',
}
export type Status = `${StatusEnum}`;

export interface Notify {
  Success: boolean;
  Status: Status;
  TerminalKey: string;
  PaymentId: number;
  RebillId?: number;
  CardId: number;
  Pan: string;
  ExpDate: string;
  OrderId: string;
  Amount: number;
  ErrorCode: string;
  Token: string;
  DATA: Record<string, string>;
}
