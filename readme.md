<h1 align="center">
  Wiclipedia
</h1>

<h4 align="center">
  Wikipedia articles summaries in your terminal
</h4>

<div align="center">
  <img alt="Boards" width="60%" src="media/screenshot.png"/>
</div>

## Description

Wiclipedia is a CLI app made with nodeJs that let you search through wikipedia and display articles summaries in a practical way.

## Install

### Yarn

```bash
yarn global add wiclipedia
```

### NPM

```bash
npm install --global wiclipedia
```

## Usage

```
$ wicli --help

  Usage
    $ wicli [<options> ...]

    Options
        none              launch wiclipedia
      --version, -v       print app version
      --lang, -l          set language for wikipedia articles
      --previous, -p      display and use previous searches
      --clear, -c         clear search history

    Examples
      $ wicli
      $ wicli --lang
      $ wicli --previous
      $ wicli --clear
```

## Development

- Fork the repository and clone it to your machine
- Navigate to your local fork: `cd wiclipedia`
- Install the project dependencies: `npm install` or `yarn install`
- Lint the code for errors: `npm test` or `yarn test`

## License

[MIT](https://github.com/kikiklang/wiclipedia/blob/master/license.md)
