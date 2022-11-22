# Electron IPC API

[![NPM Version][npm-image]][npm-url]

> Create and consume electron IPC APIs


## Index
- [Installing](#installing)
- [Main process](#main-process)
- [Renderer process](#renderer-process)
- [License](#license)


---


## Installing
```
$ npm install @potentii/eletron-ipc-api
```


---


## Main process

```javascript
import { IpcApiRoute } from '@potentii/eletron-ipc-api';

const myUsersDatabase = ...

IpcApiRoute.on('user-by-id', async data => {    
    const userFound = await myUsersDatabase.find({ id: data.id });
    return userFound;    
});
```

---


## Renderer process

```javascript
import { IpcApiClient } from '@potentii/eletron-ipc-api';


try{
    
    const userFound = await IpcApiClient.send('user-by-id', { id: '1234' });
    
} catch (err){
    
    console.error(err);
    
}
```

---

## License

[MIT](LICENSE)


[npm-image]: https://img.shields.io/npm/v/@potentii/eletron-ipc-api.svg
[npm-url]: https://npmjs.org/package/@potentii/eletron-ipc-api
