# skillocial

Skillocial is a Social Media platform for next generation of Hip Hop Community of INDIA(May change to the WORLD).

## Table of Contents

- [Getting Started](#getting-started)
- [App Preview](#app-preview)
- [Exporting](#exporting)
  - [Android](#android)
  - [iOS](#ios)
- [Deploying](#deploying)
  - [Progressive Web App](#progressive-web-app)
  - [Android](#android)
  - [iOS](#ios)

## Getting Started

- [Download the installer](https://nodejs.org/) for Node.js 6 or greater.
- Install the ionic and cordova CLI globally: `npm install -g ionic cordova`
- Clone this repository: `git clone https://github.com/MaharshiChetan/skillocial.git`.
- Run `npm install` from the project root.
- Run `ionic serve` in a terminal from the project root.
- Hurray. :tada:

## App Preview Pages

App preview screenshots were taken by installing generated apk in android phone.

- Events
- Profile
- Login
- Signup

<img src="https://camo.githubusercontent.com/65827e724fac3d3532d00b8043fee21b045ddfe3/68747470733a2f2f676475726c2e636f6d2f414e366e" alt="Schedule">

## Exporting

To build/export the debug app:

### Android

```sh
ionic cordova build android
```

### iOS

```sh
ionic cordova build ios
```

## Deploying

### Progressive Web App

1. Un-comment [these lines](https://github.com/MaharshiChetan/skillocial/blob/master/src/index.html#L35)
2. Run `npm run ionic:build --prod`
3. Push the `www` folder to your hosting service

### Android

1. Run `ionic cordova run android --prod`

### iOS

1. Run `ionic cordova run ios --prod`
