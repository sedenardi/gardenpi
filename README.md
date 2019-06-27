# gardenpi
Irrigation system remotely-controlled via a web interface running on a pi.

### Config

A file named `config.json` must exist in the root with the following shape:

```json
{
  "pumps": {
    "pump_1": {
      "pin": 11
    },
    "pump_2": {
      "pin": 13
    },
    "pump_3": {
      "pin": 16
    },
    "pump_4": {
      "pin": 18
    }
  },
  "rpio_mock": "raspi-3" // null for real thing
}
```
