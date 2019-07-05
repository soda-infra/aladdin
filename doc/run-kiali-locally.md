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


### `token.go` 파일 수정

```go
### 12 line

token, err := ioutil.ReadFile('/source/kiali/kiali/src/github.com/kiali/kiali/vendor/k8s.io/client-go/tools/bootstrap/token')
```

* `/var/run/secrets/kubernetes.io/serviceaccount/token` 를 `/source/kiali/kiali/src/github.com/kiali/kiali/vendor/k8s.io/client-go/tools/bootstrap/token` 로 수정

### `client_config.go` 파일 수정

```go
### 538~543 line

func (config *inClusterClientConfig) Possible() bool {
	fi, err := os.Stat("/var/lib/kubelet/pods/bc40f488-306f-450f-b233-6331890b46a6/volumes/kubernetes.io~secret/flannel-token-fs8jh/token")
	return os.Getenv("KUBERNETES_SERVICE_HOST") != "" &&
		os.Getenv("KUBERNETES_SERVICE_PORT") != "" &&
		err == nil && !fi.IsDir()
}
```

* `/var/run/secrets/kubernetes.io/serviceaccount/token` 를 `/source/kiali/kiali/src/github.com/kiali/kiali/vendor/k8s.io/client-go/tools/bootstrap/token` 로 수정

### `config.go` 파일 수정

```go
# 319 line

token, err := ioutil.ReadFile("/var/lib/kubelet/pods/bc40f488-306f-450f-b233-6331890b46a6/volumes/kubernetes.io~secret/flannel-token-fs8jh/token")

```

* `/var/run/secrets/kubernetes.io/serviceaccount/token` 를 `/source/kiali/kiali/src/github.com/kiali/kiali/vendor/k8s.io/client-go/tools/bootstrap/token` 로 수정