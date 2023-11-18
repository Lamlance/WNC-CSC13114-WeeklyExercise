## Usage

RabbitMQ Pub/Sub

## Running the Project with Docker

To run the project using Docker:

````bash
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management

### API Endpoint

- `POST /api/pub`

### Sample Request Body

```json
{
    "message": {
        "buyer_id": "KH-198",
        "action": "buy",
        "product": [
            {
                "name": "laptop-0as0d12",
                "payment_method": "cash"
            },
            {
                "name": "mouse-0218",
                "payment_method": "cash"
            },
            {
                "name": "keyboard-01289",
                "payment_method": "cash"
            },
            ...
        ],
        "at": "shop-0129"
    }
}
````
