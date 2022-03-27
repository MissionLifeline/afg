# Backend

## Configuration

Configuration management is done with [yogthos](https://github.com/yogthos/config).
Default values are set at `src/config.edn`, there you see the available options.
To set config options at runtime, use `environment variables`, `java system properties` or an .edn file specified using the `config` environment variable.

A sample configuration for development+testing is provided by:
```sh
CONFIG=data/config/test.edn lein run
```
