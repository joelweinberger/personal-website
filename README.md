The website of Joel H. W. Weinberger, Go Edition!

To run:
* Make sure you have the `GOPATH` environment variable set to a location that
  files can be downloaded to, for example /home/user/gocode.
* Set `GOBIN` to `$GOPATH/bin`.
* Run `go install`.
* To directly run the server, you can try `go run server.go`, but this sometimes
  results in an error (for reasons I'm still debugging). In that case, run `go
  build server.go` then `./server`.
* By default, the server runs HTTPS on port 8443 and the HTTP (for redircts only)
  on port 8080. Use the options `--https-port=xxx` and `--http-port=yyy` to
  change the HTTPS and HTTP ports to xxx and yyy, respectively.

The public/img/lock.ico favicon is used under a Creative Commons
Attribution-Share Alike 3.0 Unported license, courtesy of Wikimedia user
Urutseg, converted from: http://commons.wikimedia.org/wiki/File:Crypto_stub.svg

The photo public/img/joel-weinberger-headshot.jpg is used courtsey of Steve
Hanna (http://www.vividmachines.com).
