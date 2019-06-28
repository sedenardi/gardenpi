# gardenpi
Irrigation system remotely-controlled via a web interface running on a pi.

### Config

A file named `config.json` must exist in the root with the following shape:

```json
{
  "pumps": {
    "pump_1": {
      "pin": 11,
      "description": "sun gold" // optional
    },
    "pump_2": {
      "pin": 13,
      "description": "sugar lump"
    },
    "pump_3": {
      "pin": 16,
      "description": "jalapenos"
    },
    "pump_4": {
      "pin": 18,
      "description": "bells"
    }
  },
  "rpio_mock": "raspi-3", // null for real thing
  "app": {
    "port": 3001
  }
}
```
