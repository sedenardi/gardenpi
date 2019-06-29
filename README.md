# gardenpi
Irrigation system remotely-controlled via a web interface running on a pi.

### How It Works
gardenpi is a raspberry-pi web server connected to relays that control water pumps. Written in nodejs, it presents a simple interface that allows the user to turn on and off pumps, as well as see how long and when they were last run. Some features include:

- Written in simple html/js/css, no frameworks
- Configurable number of pumps, pin assignments, and descriptions
- Optional maximum number of simultaneously running pumps allowed
- Optional maximum allowed pump runtime

### Config

A file named `config.json` must exist in the root with the following shape:

```json
{
  "io": {
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
    "maxSimultaneousPumps": 2, // optional
    "maxPumpRuntime": 10000 // optional
  },
  "rpio_mock": "raspi-3", // null for real thing
  "app": {
    "port": 3001
  }
}
```
