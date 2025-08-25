# 2025 HITCONCTF Qual - Note
- Author: cjiso1117, ggsmita
- Category: Web
- Solved: 7/717

# Run & Dev

laravel/laravel 12.3.0

## Pack Challenge to distribute

```
sh pack.sh
```
 
## Important

The difference of behavior between the browser & the bot is not intended.
Better to test exploit with host 127.0.0.1, and report url as http://app/..., or u may encounter some bug.
If u found that your browser doesn't install serviceworker, please see 
https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts
At least my exploit works in my computer :D
enjoy


## Setup
```
docker compose up -d
```


## Dev

```
docker compose -f docker-compose-dev.yml up
```
### setup
#### Laravel
> can run on host via prefix `docker compose exec app`
```
composer install
composer run post-root-package-install
composer run post-create-project-cmd
```
#### frontend & Admin Review

```
PUPPETEER_PRODUCT=firefox npm install
npx puppeteer browsers install firefox
npm build
```



# Writeup

1. bypass blacklist via json unicode encoding or query parameter
2. flysystem, the filesystem of laravel,  replace `\` with `/` for u, and `basename` consider `\` as part of filename. So just register username `..\admin` and write note to `admin`.
3. Laravel guess file extension for upload file based on content. Just upload html, then the filename will be `xxxxxxxxxx.html`
   
    In deprecated old version of laravel, the traversal can access the storage public folder, which means upload traversal == unlimited XSS if u somehow know the filename.

    Besides, laravel maintains a mimetype list from various upstream source. And the guessing behavior is just like `file` command. The only reason why u cann't create a `.php` suffix file is that `file` return `text/x-php` but laravel mimetype list only use `application/x-httpd-php`. Maybe in some linux distro, it can break the limitation. Or somehow pollute the upstream... 
4. Firefox consider that the host service worker registered is different from the one with HTTP auth. Chrome consider they are the same. e.g. `http://a@app/` != `http://app/`. A post discussed this behavior, but i forget the link.
5. XSS to get admin token.
6. `cp` command injection has two solution. The expected solution utilizes backup and globs the index.php as backup suffix.  e.g. `{filename} -f --backup=simple -S index[,-0]php -t build`. And only the first blood team,  Friendly Maltese Citizens,  use another creative unexpected solution. 🧙
