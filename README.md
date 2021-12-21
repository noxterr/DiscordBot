
<p align="center">
  <a href="https://nodejs.org/">
    <img
      alt="Node.js"
      src="https://nodejs.org/static/images/logo-light.svg"
      width="200"
    />
  </a>
</p>

# ![Logo](https://github.com/mongodb/mongo/blob/master/docs/leaf.svg) 

# Purple Lambda Discord BOT
A Discord Bot made with Node.js for Purple Lambda


## What does the Purple Lambda Discord BOT offers

<p>Purple Lambda Discord BOT (pldb) offers a variety of services to interface with FACEIT APIs via commands and other sort of methods</p>

<span>With those features</span>
<ul>
  <li>FACEIT Justice API calls</li>
  <li>FACEIT Justice Judge on Time calls</li>
  <li>Support command to ask support on a very specific channel</li>
  <li>Todo command to add Todos in a MongoDB Database</li>
  <li>Some other features you are free to discover</li>
</ul>

## Use this repo

```
git clone <this.repo><dev>
npm update to get all dependencies
```

## Heroku Logs

```
heroku login
heroku logs -a lambda-purple-bot
heroku logs -a lambda-purple-bot -n 1500
```

## Changelog

All notable changes to this project will be documented in this section.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [released]
## [2.1.7] 03-12-2021

- `console.logs` are removed around to help improve logs retrace on hard commands
- `cron.js` will be introduced to allow judge on time
