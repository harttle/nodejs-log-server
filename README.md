This is just a simple log server powered by Nodejs and MongoDB

# Client Side Usage

```bash
# Sending logs with ID `foo` and Level `error`:
GET /post/foo?msg=firstLog&level=error

# Retrieve logs with ID `foo` and Level `error`
GET /get/foo?level=error

# Retrieve logs of all levels with ID `foo`
GET /get/foo?level=error

# Retrieve logs from all IDs
GET /get?level=error

# Delete logs with ID `foo`
GET /delete/foo

# Clear logs from all IDs
GET /delete
```

Parameters:

* `ID` (URL param) is used to trace the specific logger, can be arbitrary string.
* `level` (URL query) is used to filter log messages, typically be one of `debug`, `log`, `info`, `warn`, `error`.
* `msg` (URL query) contains the actual log message.

# Server Side Usage

Installation:

```bash
npm install nodejs-log-server
```

Env Variables:

```bash
# port default to 8777
export PORT=8777
```

Start:

```
nodejs-log-server
# Or use a process manager
pm2 start --name="log-server" nodejs-log-server
```

# Source

https://github.com/harttle/nodejs-log-server
