# Electron IPC API

[![NPM Version][npm-image]][npm-url]

> Create and consume electron IPC APIs


## Index
- [Installing](#installing)
- [Examples](#examples)
- [Renderer process](#renderer-process)
- [License](#license)


---


## Installing
```
$ npm install @potentii/electron-ipc-api
```


---


## Examples

### Main process

```javascript
import { IpcApiMain } from '@potentii/electron-ipc-api';

const myUsersDatabase = //...

IpcApiMain.process('user-by-id', async data => {    
    const userFound = await myUsersDatabase.find({ id: data.id });
    return userFound;    
});
```

### Renderer process

```javascript
import { IpcApiRenderer } from '@potentii/electron-ipc-api';

const userFound = await IpcApiRenderer.send('user-by-id', { id: '1234' });
```

---

## License

[MIT](LICENSE)


[npm-image]: https://img.shields.io/npm/v/@potentii/electron-ipc-api.svg
[npm-url]: https://npmjs.org/package/@potentii/electron-ipc-api
