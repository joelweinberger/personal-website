The website of Joel H. W. Weinberger, Go Edition!

To run:
* Make sure you have GOPATH set to a location that files can be downloaded to,
  for example /home/user/gocode.
* Set GOBIN to $GOPATH/bin.
* Run `go install`.
* To directly the server, you can try `go run server.go` but this sometimes
  results in an error (for reasons I'm still debugging). In that case, run `go
  build server.go` then `./server`.
* This will run the server on port 8443 (and the HTTP redirection on port 8080)
  by default. To run on different ports, run the server with the options
  `--https-port=7443` and `--http-port=7080` to change the https and http ports,
  respectively, substituting 7443 and 7080 for the actual desired port numbers.

The public/img/lock.ico favicon is used under a Creative Commons
Attribution-Share Alike 3.0 Unported license, courtesy of Wikimedia user
Urutseg, converted from: http://commons.wikimedia.org/wiki/File:Crypto_stub.svg

The photo public/img/joel-weinberger-headshot.jpg is used courtsey of Steve
Hanna (http://www.vividmachines.com).
