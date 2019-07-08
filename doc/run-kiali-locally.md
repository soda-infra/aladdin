## Run Kiali Locally

### `kiali.go`파일 수정

* 실행 시 아래 명령어 실행

`$GOPATH/bin/kiali -v 4 -config config.yaml`


```
## 242~243 line

path, _ := filepath.Abs("./_output/docker/console/env.js")
```

* `./console/env.js` 를 `./_output/docker/console/index.html`으로 수정

```
## 261~262 line

path, _ := filepath.Abs("./_output/docker/console/index.html")
```

* `./console/index.html` 을 `./_output/docker/console/index.html`으로 수정

### `config/config.go`파일 수정

```go
### 325 line

c.Auth.Strategy = getDefaultString(EnvAuthStrategy, AuthStrategyAnonymous)
```

* `AuthStrategyLogin`을 `AuthStrategyAnonymous`로 수정
