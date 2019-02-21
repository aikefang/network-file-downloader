# 网络文件下载器
## 安装
```javascript
npm install network-file-downloader --save
```
## 使用方法
```javascript
let download = require('network-file-downloader')
download({
  list: [
          'https://static.webascii.cn/a/b/c.js',
          'https://static.webascii.cn/a/b/d.css',
        ],
  directory: 'demo',
  together: false
})
```

## 版本 v1.0.* 参数详解
#### `list {Array} `
```
必填
文件路径（支持http与https混排）
```

#### `directory {String} `
```
非必填（默认'default'）
将文件下载到此文件夹
```

#### `together {Boolean} `
```
非必填（默认false）
true: 
    [path]/[directory]/c.js
    [path]/[directory]/d.css
false:
    [path]/[directory]/a/b/c.js
    [path]/[directory]/a/b/d.css
```