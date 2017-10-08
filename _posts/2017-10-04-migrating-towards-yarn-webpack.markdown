---
layout: post
title: "Migrating towards Yarn and Webpack"
excerpt: How we migrated to Yarn and Webpack at VWO.
authorslug: s0ftvar
author: Varun Malhotra
---

## Migrating towards Yarn and Webpack

![](/images/2017/10/migration.png)

For the past couple of years, we have been using [require.js](http://requirejs.org/) for module loading and [Grunt](https://gruntjs.com/) for automating tasks on front-end, for one out of many projects we have in Wingify. The project has a huge code-base and has many independent components inside it with some shared utilities. Also, there was no concrete build system which could be scaled upon adding new components.

**Require.js** was being used for good code-structuring, managing modules and their loading. All the different modules were having their own `require-config.js` file to define rules for a particular module.

**Grunt** was being used for automating different tasks required to speed up mundane work. We had a number of tasks like the [require-amdclean](https://github.com/gfranko/amdclean) task, concatenating different script / CSS files, minification of files, cache-busting mechanism and so on.

Following are some benefits we were getting from the `require-amdclean` task:

* We didn't have to include `require.js` in production, thus, saving some bytes.
* Generation of single js file entirely in Vanilla JavaScript.
* Get rid of file size/source code readability concerns.
* It was a great fit to be used as a standalone Javascript library, which is exactly our case.

Everything was working as expected but maintenance, performance, and scale were the issues. We had so many healthy discussions regarding improving things and thus we thought of upgrading our tech stack too. Also, as I mentioned we didn't have a concrete build system; it was the right time to investigate further. We were ready to spend some quality time in researching technologies which could fit in our build system. [Gaurav Nanda](https://twitter.com/gauravmuk) and I took a break from our daily chores and read many articles/blogs and the *not-so-useful* official docs to get a good command over various technologies. Migrating from `Grunt` to `Gulp` wasn't helping us since build time was nearly the same. The task which took a lot of time was the `require-amdclean` task, taking around `10 seconds` even for adding just a single character like `;` while working in the development environment.

### Migrating from NPM to Yarn - First step towards a new journey

After reading about [Yarn](https://yarnpkg.com/en/), the team was really curious to play with this yet new package manager aka dependency manager. When we benchmarked the results, we were literally stunned by the time difference between NPM and Yarn in fetching up resources. Yarn achieves this speed by introducing parallelism and its performance and security via maintaining a `yarn.lock` file.

For a total of `34` packages in total, the following stats would please your eyes too :)

> yarn@1.0.2
> npm@3.10.10

#### Stats when we did a Fresh Install

| Package manager                         | Time taken     |
|-----------------------------------------|----------------|
|    `npm`                                | **3 minutes 12 seconds** |
|   `yarn` *(without yarn.lock file)*     | **1 minute 33 seconds** |
|   `yarn` *(with yarn.lock file)*        | **16 seconds** |

#### Running the commands with already installed packages

| Package manager                         | Time taken     |
|-----------------------------------------|----------------|
|    `npm`                                | **7 seconds** |
|   `yarn` *(with yarn.lock file)*        | **6 seconds** |

![](/images/2017/10/yarn-benchmarking.png)

Yarn offers a lot more besides its fast speed, security, and reliability. Check [these](https://yarnpkg.com/en/docs/cli/) commands Yarn offers.

Since we were using [bower](( https://bower.io/)) too, our first step was to port all the dependencies and dev-dependencies listed in our `bower.json` file to `package.json`. This was a time-consuming task since we had a huge list of packages. After successful porting of packages and validating the version numbers with the previous packages, we were all set to switch to Yarn. This also helped in keeping just one file for managing packages. We are no longer using bower. Even bower's [official site](https://bower.io/) recommends using Yarn and Webpack :)

### Why switch to Webpack 2

It wasn't an easy task to accomplish since Webpack is a module bundler rather than a task runner. We were so accustomed to using task runners along with the old-fashioned `require.js` based module management that it took a good amount of time figuring out how to proceed with our mini-app's new build system.

Apart from the numerous benefits of using Webpack, the most notable features, especially for our codebase and the build system, were:

1. Easy integration with `npm`/`yarn` and seamless handling of multiple module formats. We now use two of its kind, one is `UMD` and the other one is `this` target option (we have such a requirement).
2. Single main entry and one single bundled output - exactly what we needed.
3. Cache busting(hashing) - Very very easy to implement and get benefitted.
4. Building different, independent, and standalone modules simultaneously. Thanks to [parallel-webpack](https://github.com/trivago/parallel-webpack)!
5. Using webpack-loaders -
   * [babel-loader](https://github.com/babel/babel-loader) - so that we could start writing `ES6` compatible code even with our `require.js` module management system.
   * [eslint-loader](https://github.com/MoOx/eslint-loader) - which allows identifying and reporting on patterns found in ECMAScript/JavaScript code
   * [css-loader](https://github.com/webpack-contrib/css-loader) - for bundling CSS

### Converting to Webpack 2 - A transcendent journey ahead

In the beginning, it looked like just porting the `require.js` configuration to Webpack and we're done. A big NO! This thought was absolutely wrong. There were so many scenarios we had to deal with. We will discuss this in detail as we move along.

First thing first, a clear understanding of what exactly Webpack is and how does it bundle the modules are must. Simply copy-pasting the configuration file from the official website and tweaking it won't help in a long run. One must be very clear regarding the fundamentals on which Webpack is built upon.

Problems which we needed to tackle were:

1. Different modules in the same app, having different configuration files.
2. Webpack config should be modular in itself and be able to run multiple configs at once so that we should be able to add/remove a new module easily without affecting any existing one.

#### Installing Webpack

**Via Yarn** *(recommended)*

```
yarn add --dev webpack
```

**Via NPM**

```
npm install webpack --save-dev
```

**Configuration** -

A basic configuration file looks like:

```
// Filename: webpack.config.js

const path = require('path');
const webpack = require('webpack');
module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: './app.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
};
```

Check [this](https://webpack.js.org/configuration/#options) for knowing the role of each key.

Since we needed to support different modules we had to have different config files for each of our module.

```
// Filename webpack.config.js

/**
 * Method to return a desired config with the necessary options
 * @param  {Object} options
 * @return {Object} - Desired config Object as per webpack 2 docs
 */
function executeWebpackConfig(options) {
  return {
    devtool: options.devtool === '' ? options.devtool : 'source-map',
    entry: options.entry,
    output: options.output,
    module: options.module,
    resolve: options.resolve,
    plugins: options.plugins || []
  };
}

// Add/remove different modules' corresponding config files
let multipleConfigs = [
  // For building single bundled JS file
  require('./build/module-A/webpack.main'),
  // Corresponding bundled CSS file
  require('./build/module-A/webpack.main.assets'),

  require('./build/module-B/webpack.main'),
  require('./build/module-B/webpack.main.assets'),

  require('./build/module-C/webpack.main'),

  require('./build/module-D/webpack.main'),
  require('./build/module-D/webpack-main.assets')
];

multipleConfigs.map((config) => {
  return executeWebpackConfig(config);
});

module.exports = multipleConfigs;
```

The above configuration is capable of handling `n` number of modules. Different modules will have at least one bundled JS file as the output. But we also needed to have a bundled CSS file corresponding to each module. So, we decided to have two different config files for every module which has both JS and CSS bundling, one for bundling JS and other for managing assets and bundling CSS files. Tasks like copying files from src to dist, updating the JS file name with a cache-busting hash(prod build) in the index.html file and so on were taken care of inside the assets config file.

The above-mentioned break-down of a module into JS and CSS bundling helped us in having a clean, modular, and scalable approach for our new build system.
We also used parallel-webpack to speed up our build by running independent modules in parallel. But be very careful using it, since it spawns a new thread for each different task, which basically uses the different cores of a machine to process. Also, there should be a cap on the number of parallel-tasks to prevent overshooting of CPU usage.

### Extraction of common stuff for reusability and maintainability

Let's discuss Webpack `module-rules` and `resolve-aliases` which play a significant role, before advancing further with the creation of common webpack-configuration helper methods.

**`module rules`** - Create aliases to import or require certain modules more easily. This basically tells how to read a module and to use it.

We used `expose-loader` and `imports-loader` depending on the use-case.

[expose-loader](https://github.com/webpack-contrib/expose-loader) - adds modules to the global object. This is useful for debugging or supporting libraries that depend on libraries in globals.

[imports-loader](https://github.com/webpack-contrib/imports-loader) - is useful for third-party modules that rely on global variables like $ or this being the window object. The imports loader can add the necessary require('whatever') calls, so those modules work with Webpack.

This is an obvious thing that we had same third-party libraries, wrappers over external libraries, and self-baked useful utilities shared across different modules. This means that our module-specific webpack config file would have the same set of repeated rules and aliases. Code duplication might seem a good fit here for readability but is really painful to maintain in a long run.

Let's discuss how we managed to share the common module rules and resolve aliases across the different modules.

Below is a generic utility file’s code which has two methods. One outputs whether a passed argument is an Object and the other one outputs whether it’s an array.

```
// Filename: GenericUtils.js

module.exports = {
    isObject: function (obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    },
    isArray: function (arr) {
        return Object.prototype.toString.call(arr) === '[object Array]';
    }
};
```

Here's a list of common rules and aliases defined explicitly in a separate file.

```
// Filename: webpack.common-module-rules-and-alias.js

const path = require('path');
let basePath = path.join(__dirname, '/../');

module.exports = {
    alias: {
        // Common thrid-party libraries being used in different modules
        'pubSub': basePath + 'node_modules/pubsub/dist/ba-tiny-pubsub.min',
        'select2': basePath + 'node_modules/select2/dist/js/select2.full.min',
        'acrossTabs': basePath + 'node_modules/across-tabs/dist/across-tabs.this',
        // ....more

        // Common self-baked utilities
        'utils': 'lib/player/utils',
        'storage': 'lib/player/storage',
        // ....more

        // Common services
        'auth': 'lib/Auth',
        'gaUtils': 'lib/GAUtils',
        'DOMUtils': 'lib/DOMUtils',
        'arrayUtils': 'lib/ArrayUtils',
        // ....more

        // Common constants
        'AnalyticsEventEnum': 'lib/constants/AnalyticsEventEnum',
        'MapTypeEnum': 'lib/constants/MapTypeEnum',
        'segmentAnalyticsUtils': 'lib/analytics/SegmentAnalyticsUtils',
        // ....more
    },

    rules: [
        { test: /jQuery/, loader: 'expose-loader?$' },
        { test: /pubSub/, loader: 'expose-loader?pubSub!imports-loader?jQuery' },
        { test: /select2/, loader: 'expose-loader?select2!imports-loader?jQuery' },
        { test: /acrossTabs/, loader: 'expose-loader?AcrossTabs' },
        // ....more

        { test: /utils/, loader: 'expose-loader?utils' },
        { test: /storage/, loader: 'expose-loader?storage' },
        // ....more

        { test: /auth/, loader: 'expose-loader?auth' },
        { test: /gaUtils/, loader: 'expose-loader?gaUtils' },
        { test: /DOMUtils/, loader: 'expose-loader?DOMUtils' },
        { test: /arrayUtils/, loader: 'expose-loader?arrayUtils' },
        // ....more

        { test: /AnalyticsEventEnum/, loader: 'expose-loader?AnalyticsEventEnum' },
        { test: /MapTypeEnum/, loader: 'expose-loader?MapTypeEnum' },
        { test: /segmentAnalyticsUtils/, loader: 'expose-loader?segmentAnalyticsUtils' },
        // ....more
    ]
};
```

We now had a common file where we could easily add/update/remove any rule and its corresponding alias. Now we needed to have a utility which combines the common rules and aliases with the already defined rules and aliases in a particular modules' config file.

```
// Filename: rulesAndAliasUtil.js

const moduleRulesAndAlias = require('./webpack.common-module-rules-and-alias');
const genericUtil = require('./genericUtil');

module.exports = {
    mergeRulesAndUpdate: function(testRules, config) {
        if (testRules && config && config.module && config.module.rules &&
            genericUtil.isObject(config) &&
            genericUtil.isArray(testRules)
        ) {
            testRules.concat(moduleRulesAndAlias.rules);
            for (let i = 0; i < testRules.length; i++) {
              config.module.rules.push(testRules[i]);
            }

            return config;
        }
        return config;
    },
    mergeAliasAndUpdate: function (aliases, config) {
        if (aliases && config && config.resolve &&
            genericUtil.isObject(aliases) && genericUtil.isObject(config)
        ) {
            let allAliases = Object.assign(aliases, moduleRulesAndAlias.alias);

            config.resolve.alias = allAliases;
            return config;
        }

        return config;
    }
};
```

Time to write our module specific config file. We'll demonstrate just one config file i.e. for moduleA and the others would look exactly the same except the options' value as per module.

Here's the full webpack config file for `moduleA`.

```
// Filename: webpack.moduleA.js

const path = require('path');
const webpack = require('webpack');
const env = require('./../webpack.env').env; // Just to get the env(dev/prod), discussed in detail later

const rulesAndAliasUtil = require('./utils/rulesAndAliasUtil');

let basePath = path.join(__dirname, '/../');
let config = {
  // Entry, file to be bundled
  entry: {
    'moduleA': basePath + 'src/path/to/moduleA-entry.js',
  },
  devtool: env === 'build' ? 'source-map' : false,
  output: {
    // Output directory
    path: basePath + 'dist/moduleA',
    library: '[name]',
    // [hash:6] with add a SHA based on file changes if the env is build
    filename: env === EnvEnum.BUILD ? '[name]-[hash:6].min.js' : '[name].min.js',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: []
  },
  resolve: {
    alias: {},
    modules: [
      // Files path which will be referenced while bundling
      basePath + 'src',
      basePath + 'node_modules',
    ],
    extensions: ['.js'] // File types
  },
  plugins: []
};

// Following requirejs format - define how will they be exposed(via expose-loader or exports-loader) and their dependenices(via imports-loader)
let testRules = [
  { test: /jQuery/, loader: 'expose-loader?$' },
  { test: /base64/, loader: 'exports-loader?Base64' },
  { test: /ModuleSpecificEnum/, loader: 'expose-loader?ModuleSpecificEnum' }
];

// Following requirejs format - define the paths of the libs/constants/vendor specific to this moduleA only
let moduleAlias = {
  'jQuery': 'moduleA/vendor/jquery-3.1.0',
  'base64': 'moduleA/vendor/base64',
  'ModuleSpecificEnum': 'moduleA/constants/ModuleSpecificEnum'
}

config = rulesAndAliasUtil.mergeRulesAndUpdate(testRules, config);
config = rulesAndAliasUtil.mergeAliasAndUpdate(moduleAlias, config);

module.exports = config;
```

This is a complete webpack config file for bundling JS file for `moduleA`. While configuring it, we defined different options, each one has its own purpose. To know more about each option, please refer [this](https://webpack.js.org/configuration/#options).

#### Webpack loaders

Webpack enables the use of loaders to preprocess files. This allows us to bundle any static resource way beyond JavaScript.

We introduced two loaders for bundling JS resources inside our app.

1. [babel-loader](https://github.com/babel/babel-loader) - This package allows transpiling JavaScript files using Babel and Webpack. Thanks to babel-loader as we are fearlessly writing ES6 code and updating our mundane code.
2. [eslint-loader](https://github.com/MoOx/eslint-loader) - This package allows identifying and reporting on patterns found in ECMAScript/JavaScript code.

Since we needed these two loaders for all our modules, we defined them in the same file we discussed earlier - `rulesAndAliasUtil.js`

```
// Filename: rulesAndAliasUtil.js

let defaultLoaders = [{
  enforce: 'pre', // to check source files, not modified by other loaders (like babel-loader)
  test: /(.js)$/,
  exclude: /(node_modules|moduleA\/vendor|moduleB\/lib\/lodash-template.min.js)/,
  use: {
    loader: 'eslint-loader',
    options: {
      emitError: true,
      emitWarning: true,
      failOnWarning: true, // will not allow webpack to build if eslint warns
      failOnError: true // will not allow webpack to build if eslint fails
    }
  }
}, {
  test: /(\.js)$/,
  exclude: /(node_modules)/,
  use: {
    // babel-loader to convert ES6 code to ES5
    loader: 'babel-loader',
    options: {
      presets: ['env'],
      plugins: []
    }
  }
}];
```

And updating the method: `mergeRulesAndUpdate` as follows

```
mergeRulesAndUpdate: function(testRules, config) {
    if (testRules && config && config.module && config.module.rules &&
        genericUtil.isObject(config) &&
        genericUtil.isArray(testRules)
    ) {
        testRules.concat(moduleRulesAndAlias.rules);
        for (let i = 0; i < testRules.length; i++) {
          config.module.rules.push(testRules[i]);
        }

        // Default babel-loader and eslint-loader for all js-modules
        config.module.rules = config.module.rules.concat(defaultLoaders);

        return config;
    }
    return config;
}
```

This was all about bundling of JS modules. The same approach was followed for different modules. Now we were left with the bundling of our CSS files and the obvious chores like copying, replacing, etc.

### Webpack Bundling of CSS files

```
// Filename: webpack.moduleA.assets.js

const fs = require('fs');
const path = require('path');
const glob = require('glob-all');
const env = require('./../webpack.env').env;
const EnvEnum = require('./../constants/Enums').EnvEnum;

// To remove unused css
const PurifyCSSPlugin = require('purifycss-webpack');
// Copy Assests to dist
const CopyWebpackPlugin = require('copy-webpack-plugin');
// To generate a file in JSON format so that the hash appended can be later read by another file like one css file is used in multiple files so its hash needs to be stored somewhere to be read so that it can be replaced in corresponding `index.html` files
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// For combining multiple css files
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// Minify css files for env=build
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// Replace filename if env=build since hash is appended for cache bursting
const replacePlugin = require('./../utils/webpack.custom-string-replace.plugin');

let buildPlugins = [];
let basePath = path.join(__dirname, '/../');

if (env === 'build') {
  // minify css files if env is build i.e. production
  buildPlugins.push(new OptimizeCssAssetsPlugin({
    cssProcessorOptions: {
      safe: true
    }
  }));
}

module.exports = {
  // Entry, files to be bundled separately
  entry: {
    'css-file-1': [
      basePath + 'src/styles/canvas/common.css',
      basePath + 'src/styles/canvas/mobile.css',
      basePath + 'src/styles/canvas/main.css'
    ],
    'css-file-2': [
      basePath + 'src/styles/app.css',
      basePath + 'src/styles/player/player.css',
      basePath + 'src/styles/mobile.css',
      basePath + 'node_modules/select2/dist/css/select2.min.css'
    ]
  },
  devtool: '',
  output: {
    // Output directory
    path: basePath + 'dist/styles/',
    // [hash:6] with add a SHA based on file changes if the env is build
    filename: env === 'build' ? '[name]-[hash:6].min.css' : '[name].min.css'
  },
  // Rules for bundling
  module: {
    rules: [{
      test: /\.css$/i,
      use: ExtractTextPlugin.extract({
        use: [{
          loader: 'css-loader',
          options: {
            // ExtractTextPlugin tries to process url like in backgroun-image, url(), etc. We need to stop that behavior so we need this option
            url: false
          }
        }]
      })
    }]
  },
  resolve: {
    alias: {},
    modules: [],
    extensions: ['.css'] // only for css file
  },
  plugins: [
    // Cleaning specific folder, maintaining other modules dist intact
    new CleanWebpackPlugin([basePath + 'dist/styles'], {
      root: basePath
    }),
    // File to generated to read hash later on
    new ManifestPlugin({
      fileName: 'manifest.json'
    }),
    // Copy css/images file(s) to dist
    new CopyWebpackPlugin([{
      from: basePath + 'src/images',
      to: basePath + 'dist/images/'
    }]),
    // Bundling of entry files
    new ExtractTextPlugin(env === 'build' ? '[name]-[hash:6].min.css' : '[name].min.css'),
    // To remove unused CSS by looking in corresponding html files
    new PurifyCSSPlugin({
      // Give paths to parse for rules. These should be absolute!
      paths: glob.sync([
        path.join(basePath, 'src/moduleA/*.html'),
        path.join(basePath, 'src/moduleA/canBeAnyFile.js'),
        path.join(basePath, 'src/moduleB/*.html'),
        path.join(basePath, 'src/moduleC/*.js')
      ]),
      purifyOptions: {
        whitelist: [ '*select2-*' ] // If classes are added on run-time, then based on the pattern, we can whitelist them, to be always included in our final bundled CSS file
      }
    })
  ].concat(buildPlugins)
};
```

The above configuration outputs two bundled CSS files i.e. css-file-1.min.css & css-file.min.css, and css-file-1-8fb1ed.min.css & css-file-2-6ed3c1.min.css if it's a prod build.

We are using [ExtractTextPlugin](https://github.com/webpack-contrib/extract-text-webpack-plugin), which extracts text from a bundle, or bundles, into a separate file, along with [css-loader](https://github.com/webpack-contrib/css-loader)

We faced a very weird issue and thus worth mentioning here explicitly. `ExtractTextPlugin` tries to process URL like in background-image, url(), etc. We need to stop that behavior so we need to set `url:false` inside the options like:

```
options: {
     url: false
}
```

Few more plugins that we are using are:

1. [CleanWebpackPlugin](https://github.com/johnagan/clean-webpack-plugin) - to remove/clean the styles folder inside the build folder before building

2. [ManifestPlugin](https://github.com/danethurber/webpack-manifest-plugin) - for generating an asset manifest file with a mapping of all source file names to their corresponding output file
This plugin generates a JSON file so that the hash appended(prod build) after a JS file can be later read by another file. Eg. one CSS file is shared among different modules so its hash needs to be stored somewhere to be read later by other modules to update the hash in their corresponding `index.html` files.


3. [CopyWebpackPlugin](https://github.com/kevlened/copy-webpack-plugin) - to copy individual files or entire directories to the build directory

4. [PurifyCSSPlugin](https://github.com/webpack-contrib/purifycss-webpack) - to remove unused selectors from the CSS. This plugin was a must for us. So, what we were doing in this entire project earlier was to copy-paste the Parent projects CSS file to this independent project. We followed the same approach because of time-constraints but found this amazing plugin which automatically removes the unused CSS from the bundled CSS files based on the paths of files which uses it. We can even whitelist selectors if classes are appended on run-time or for any other reason. But it is highly recommended to use the PurifyCSS plugin with the Extract Text plugin which we discussed above.

5. [OptimizeCssAssetsPlugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin) - to optimize/minimize CSS assets

This was all about bundling of CSS file.

### Last step - Automated scripts and provision to execute module-specific build

First, we created a file to read arguments that could be read in our `webpack.config.js` file via a `package.json` script.

```
// Filename: webpack.env.js

// Webpack doesn't pass Webpack env in env variable when using multiple configs, so writing custom code
let argv = process.argv || [],
  // Loop over process arguments and check for --env.mode
  envArgv = argv.filter(function (arg) {
    return arg.indexOf('--env.mode') > -1;
  }),
  targetModuleArgv = argv.filter(function (arg) {
    return arg.indexOf('--env.module') > -1;
  }),
  env, targetModules = '';

// If match fould, spilt so that exact value can be extracted like 'build'/'local'
if (envArgv && envArgv.length) {
  env = envArgv[0].split('=')[1];
}

if (targetModuleArgv && targetModuleArgv.length) {
  targetModules = targetModuleArgv[0].split('=')[1];
}

module.exports = {
  env,
  targetModules
};
```

We tweaked our main `webpack.config.js` to make it module-aware.

```
// Filename: webpack.config.js

const targetModules = require('./build/webpack.env').targetModules;

function executeWebpackConfig(options) {
  return {
    devtool: options.devtool === '' ? options.devtool : 'source-map',
    entry: options.entry,
    output: options.output,
    module: options.module,
    resolve: options.resolve,
    plugins: options.plugins || []
  };
}

// Module specific configuration files
let multipleConfigs = [];

if (targetModules) {
  let modules = targetModules.split(',');

  for (var i = 0; i < modules.length; i++) {
    if (modules[i] === 'moduleA') {
      multipleConfigs.push(require('./build/moduleA-tasks/webpack.moduleA'));
      multipleConfigs.push(require('./build/moduleA-tasks/webpack.moduleA.assets'));
    }
    if (modules[i] === 'moduleB') {
      multipleConfigs.push(require('./build/moduleB-tasks/webpack.moduleB'));
      multipleConfigs.push(require('./build/moduleB-tasks/webpack.moduleB.assets'));
    }
    if (modules[i] === 'moduleC') {
      multipleConfigs.push(require('./build/moduleC-tasks/webpack.moduleC'));
    }
    if (modules[i] === 'moduleD') {
      multipleConfigs.push(require('./build/moduleD-tasks/webpack.moduleD'));
       multipleConfigs.push(require('./build/moduleD-tasks/webpack.moduleD.assets'));
    }
  }
} else {
  multipleConfigs = [
    require('./build/moduleA-tasks/webpack.moduleA-main'),
    require('./build/moduleA-tasks/webpack.moduleA.assets'),

    require('./build/moduleB-tasks/webpack.moduleB'),
    require('./build/moduleB-tasks/webpack.moduleB.assets'),

    require('./build/moduleC/webpack.moduleC'),

    require('./build/moduleD-tasks/webpack.moduleD'),
    require('./build/moduleD-tasks/webpack.moduleD.assets')
  ];
}

multipleConfigs.map((config) => {
  return executeWebpackConfig(config);
});

module.exports = multipleConfigs;
```

In our `package.json` file, we created different scripts for running either a development build or production-ready build(minification, cache-busting, and purification) and either to run build for all modules or for just selective modules.

```
// Filename: package.json

"scripts": {
  "install":      "yarn install --ignore-scripts",
  "build":        "webpack --optimize-minimize --bail --env.mode=build",

  "dev":          "webpack --progress --colors --watch --env.mode=dev --display-error-details",
  "dev-nowatch":  "webpack --progress --colors --env.mode=dev --display-error-details",

  "dev-moduleA":  "webpack --progress --colors --watch --env.mode=dev --env.modules=moduleA",
  "dev-moduleB":  "webpack --progress --colors --watch --env.mode=dev --env.modules=moduleB",
  "dev-moduleC":  "webpack --progress --colors --watch --env.mode=dev --env.modules=moduleB",

  "dev-moduleAB": "webpack --progress --colors --watch --env.mode=dev --env.modules=moduleA,moduleB",
  "dev-moduleBC": "webpack --progress --colors --watch --env.mode=dev --env.modules=moduleB,moduleC",
  "dev-moduleAC": "webpack --progress --colors --watch --env.mode=dev --env.modules=moduleA,moduleC",

  "lint":         "eslint 'src/**/*.js'  --cache --config .eslintrc --ignore-path .eslintignore",
  "lint-fix":     "eslint 'src/**/*.js' --fix  --cache --config .eslintrc --ignore-path .eslintignore"
}
```

### Upgrading to 3

According to Sean T. Larkin in the [release blog post](https://medium.com/webpack/webpack-3-official-release-15fd2dd8f07b): "webpack 3: Official Release!!", migrating from webpack 2 to 3 should involve no effort beyond running the upgrade commands in your terminal. We are using `Webpack@3.6.0` and `yarn@1.0.2` now :)

### Last but not the least - Stepping towards a long journey

This was just the beginning of stepping towards researching different technologies and upgrading our tech stack. We have now gradually started writing `ES6` code for that particular project. The experience was tremendous and the team is now working on evaluating other sections where the change could gradually take a form.

### Helpful resources

* [Getting Started with Webpack 2](https://blog.madewithenvy.com/getting-started-with-webpack-2-ed2b86c68783)
* [Configuring webpack for production: High Performance webpack config](https://www.codementor.io/drewpowers/high-performance-webpack-config-for-front-end-delivery-90sqic1qa)

### Before you go...

Should you have any feedback regarding this article, please share your thoughts via comments.

If you like this article, do share it on social networking sites.