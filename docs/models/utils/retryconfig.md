# RetryConfig

Allows customizing the default retry configuration. Only usable with methods that mention they support retries.

## Fields

| Name                      | Type                                | Description                             | Example   |
| ------------------------- | ----------------------------------- | --------------------------------------- | --------- |
| `strategy`                | `*string*`                             | The retry strategy to use.              | `backoff` |
| `backoff`                 | [BackoffStrategy](#backoffstrategy) | Configuration for the backoff strategy. |           |
| `retryConnectionErrors` | `*boolean*`                            | Whether to retry on connection errors.  | `true`    |

## BackoffStrategy

The backoff strategy allows retrying a request with an exponential backoff between each retry.

### Fields

| Name               | Type      | Description                               | Example  |
| ------------------ | --------- | ----------------------------------------- | -------- |
| `initialInterval` | `*number*`   | The initial interval in milliseconds.     | `500`    |
| `maxInterval`     | `*number*`   | The maximum interval in milliseconds.     | `60000`  |
| `exponent`         | `*number*` | The exponent to use for the backoff.      | `1.5`    |
| `maxElapsedTime` | `*number*`   | The maximum elapsed time in milliseconds. | `300000` |