# Redis Schema Definition

## Key Format
`user:{starknet_address}:data`

## Value Structure (JSON)
The value is a JSON string with a Time-To-Live (TTL) of 24 hours.

```json
{
  "status": "active_subscription", 
  "tier": 1, 
  "expiry": 1709251200, 
  "airdrops": [
    {
      "name": "Starknet Early Adopter",
      "url": "https://starknet.io/claim",
      "amount": "500 STRK"
    },
    {
      "name": "Optimism Drop #1",
      "url": "https://optimism.io/airdrop",
      "amount": "200 OP"
    }
  ],
  "last_updated": 1708646400
}
```

## Fields
- **status**: `active_subscription` | `expired` | `no_subscription`
- **tier**: Subscription tier level (1, 2, 3)
- **expiry**: Unix timestamp of subscription expiry
- **airdrops**: List of eligible aidrops
    - **name**: Name of the airdrop
    - **url**: Claim URL (Filtered against `ALLOWED_DOMAINS`)
    - **amount**: Estimated amount
- **last_updated**: Unix timestamp of when this data was fetched/written
