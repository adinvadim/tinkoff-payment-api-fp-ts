# tinkoff-payment-api-fp-ts

```
yarn add tinkoff-payment-api-fp-ts
```

Все методы API возвращает [ReaderTaskEither](https://grossbart.github.io/fp-ts/modules/ReaderTaskEither.ts.html), где в Reader передаются secrets (Password и TerminalKey).

### Тинькоф тесты

Эти тесты лежат в папочке `test/tinkoff-test` и нужны для того чтобы проходить тесты, которые требует тинькоф. Плюс как ни как это e2e тесты. Единственное что здесь не тестируется, это все методы связанные с рекуррентным платежом, но это потому что Тинькоф не поддерживает Charge метод в тестовом терминале.
