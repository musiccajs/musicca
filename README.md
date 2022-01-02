<div align="center">
  <img src="https://user-images.githubusercontent.com/34704796/147868696-bf61c114-7b94-41fe-8421-fc9b39c094ba.png" alt="Logo">

  <div>
    <img alt="GitHub" src="https://img.shields.io/github/license/musiccajs/musicca">
    <img alt="npm" src="https://img.shields.io/npm/dt/musicca">
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/musiccajs/musicca">
  </div>
</div>

# About 📛

Musicca is a **modular**, **extensible** and **flexible** media stream manager for [Node.js](https://nodejs.org/).

- Object-oriented
- Simple and light-weight
- Modular by design

# Installation 💾

```sh-session
npm install musicca
yarn add musicca
pnpm add musicca
```

# Quick Start 🌠

Install all required dependencies

```sh-session
npm install musicca @musicca/structs @musicca/extractors
yarn add musicca @musicca/structs @musicca/extractors
pnpm add musicca @musicca/structs @musicca/extractors
```

Create a new Musicca instance

```ts
import Musicca from 'musicca';
import { MemoryQueue } from '@musicca/structs';
import { YoutubeExtractor } from '@musicca/extractors';

const client = new Musicca<MemoryQueue>({
  structs: {
    queue: MemoryQueue
  }
});
```

# Links 🔗

- [Website](https://musicca.edqe.me) ([source](https://github.com/musiccajs/website))
- [Documentation](https://musicca.edqe.me/docs)
- [Github](https://github.com/musiccajs/musicca)
- [npm](https://www.npmjs.com/package/musicca)
