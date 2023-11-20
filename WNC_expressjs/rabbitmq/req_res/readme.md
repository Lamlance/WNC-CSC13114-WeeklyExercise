## Usage

RabbitMQ Req/Reply

### Run server

npm run dev_rr

### API Endpoint

- `POST localhost:3090/operate`

### Sample Request Body

```json
{
  "operation": "multiply",
  "num1": 3,
  "num2": 5
}
or
{
  "operation": "sum",
  "num1": 3,
  "num2": 5
}

```
