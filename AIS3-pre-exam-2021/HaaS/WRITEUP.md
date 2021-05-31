# HaaS
- Category: Web
- Difficulty: Beginner
- Keywords: SSRF


這題在出題和上題目時出了點錯誤，照著 My-First-CTF Only 的難度下去出，所以在 pre-exam 這邊來看相當水，但是仍然在 mfCTF 算超難題，也許是因為 mfCTF  參賽者還沒有聽過 SSRF 

這題考點是對 HTTP 和 SSRF 有簡單的了解，並且會簡單的繞域名手法

## Solution
![image](https://user-images.githubusercontent.com/13635413/120225119-3cb00f00-c277-11eb-804c-03f8751782b9.png)

- 這題一開始給的連結是 `/HaaS` ，其實是支 POST 請求的 API URL，新手看到 Method Not Allowed 可能就卡住了，其實只要到 `/` 就可以看到首頁。
> 有參賽者只從 `/HaaS` 入手就解了題目，大概思路是從 HEAD 得知 GET，看錯誤訊息通出 url 參數，繞域名，剛好沒有 status 就會拿到 flag，真。通靈
- HaaS 是一支幫忙測試站點是否存活的服務，架構上分成前後端 server，目標 flag 在後端 server 根目錄。(比賽中並不會知道)
- 首頁上的表單可以提交一個 URL，一臉就是 SSRF
- 觀察 HTML，可以看到一個 url 欄位和另一隱藏的欄位 status，戳戳看就能得知當對 url 發 request ，response 的 status code 不等於提交的 status code 時，會把頁面噴出來
- 接下來就可以拿這個亂戳內網的網站，先戳 localhost 發現被擋，一臉就是 SSRF 的目標
- 這裡只做些基本的 IP 和 Domain name 過濾，google 到的手法都繞得過去 
- Payload:   Bash `curl -X POST "http://${HOST}:7122/haas" -d 'url=http://127.1&status=7122'`
