# Leseübung

This is a generator for musical note sequences to train recognition and instrumentation of musical compositions.
It uses [ABC Notation](http://abcnotation.com/wiki/abc:standard:v2.1) to define short patterns.

* [Run app](./app)
* [Run standalone app](./standalone.html)

Utilized Libraries:

* [abcjs](https://github.com/paulrosen/abcjs) - music rendering
* [saveSvgAsPng](https://github.com/exupero/saveSvgAsPng) - export to PNG

# Usage

You need to install [nodejs](https://nodejs.org) (including `npm`).
Then inside the repository run `npm install` to install dependecies.

## Server
`grunt serve` creates the app and serves it on localhost.

## Build
`grund build` creates the app in the `build/` folder:

* `build/standalone/index.html` contains an HTML file with inlined assets, ready to use without a webserver or internet connection.
* `build/app` contains the app in multiple files.
