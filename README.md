This is just a simple log server with nodejs and MongoDB (mongoose) 

# Client Side Usage

Sending logs:

```bash
GET /post/<trace-id>?msg=<message>&level=<level>
# Example:
GET /post/foo?msg=firstLog&level=error
```

Checking logs:

```bash
GET /get/<trace-id>?level=<level>
# Example:
GET /get/foo?level=error
```

> If `level` not set, prints all logs.

Clearing logs:

```bash
GET /delete/<trace-id>
# Example:
GET /delete/foo
```

# Server Side Usage

Installation:

```bash
npm install nodejs-log-server
```

Start:

```
nodejs-log-server
# Or use a process manager
pm2 start --name="log-server" nodejs-log-server
```

# Source

https://github.com/harttle/nodejs-log-server
