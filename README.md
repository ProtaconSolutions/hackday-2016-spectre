# What is this?
TODO
 
# Installation
First of all you have to install npm and node.js to your box. Installation instructions can be found here.

Note that node.js 6.x or newer is required.

```bash
$ git clone https://github.com/protacon/hackday-2016-spectre.git
$ cd hackday-2016-spectre

# install the project's dependencies
$ npm install

# fast install (via Yarn, https://yarnpkg.com)
$ yarn install  # or yarn
```

## Configuration
See ```/src/app/config/config.ts_example``` file and copy it to ```/src/app/config/config.ts``` file and make necessary 
changes to it. Note that you need a Firebase account to get all necessary config values. You'll also need to be invited
by an existing project member to use the Firebase project.

# Development
To start developing in the project run:

```bash
$ npm start
# OR
$ ng serve
 ```

# Authors
 * Tarmo Leppänen
 * Sami Ristinen
 * Olli Kalmari
 * Joose Alm

# License
The MIT License (MIT)
Copyright (c) 2016 [Protacon Solutions](https://www.protacon.com)
