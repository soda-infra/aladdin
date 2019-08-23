## Kiali 이미지 업데이트 - Docker Hub

### Docker Hub Create and Push Kiali Image

1. 우선 Docker Hub에 자신만의 Repo를 생성한다. 나는 우리 프로젝트에서 사용하는 `soda2019/aladdin` Repo를 사용할 것이다.

2. `make docker-build`를 통해 생성한 Docker Image를 아래 과정을 통해 Docker Hub에 업로드한다.

   ```bash
   ## 기존 kiali/kiali:dev를 rename한다.
   docker tag kiali/kiali:dev soda2019/aladdin:dev
   
   ## Docker Login
   docker login 
   
   ## Push image 
   docker soda2019/aladdin
   ```

### Modify /kiali/operator/Makefile

```makefile
SHELL := /bin/bash

# Details about the Kiali operator image.
OPERATOR_IMAGE_REPO ?= quay.io
OPERATOR_IMAGE_NAME ?= ${OPERATOR_IMAGE_REPO}/kiali/kiali-operator
OPERATOR_IMAGE_PULL_POLICY ?= IfNotPresent
OPERATOR_IMAGE_VERSION ?= dev
OPERATOR_NAMESPACE ?= kiali-operator
OPERATOR_WATCH_NAMESPACE ?= kiali-operator

# When deploying the Kiali operator via operator-create target, this indicates if it should install Kiali also.
OPERATOR_INSTALL_KIALI ?= false

# When installing Kiali, here are some configuration settings for it.
AUTH_STRATEGY ?= openshift
CREDENTIALS_USERNAME ?= admin
CREDENTIALS_PASSPHRASE ?= admin
# KIALI_IMAGE_REPO ?= quay.io
# KIALI_IMAGE_NAME ?= ${KIALI_IMAGE_REPO}/kiali/kiali
KIALI_IMAGE_NAME ?= soda2019/aladdin
KIALI_IMAGE_PULL_POLICY ?= IfNotPresent
KIALI_IMAGE_VERSION ?= ${OPERATOR_IMAGE_VERSION}
NAMESPACE ?= istio-system
VERBOSE_MODE ?= 3
SERVICE_TYPE ?= NodePort
```

1. 기존 `KIALI_IMAGE_REPO`가 `quay.io`로 설정되어 있다. 이것을 주석 처리한다.
2. `KIALI_IMAGE_NAME`을 `soda2019/aladdin`으로 설정한다(Docker Hub Repo로 설정)

### Make /kiali/operator/deploy/kiali_cr_jyk.yaml 

```yaml
apiVersion: kiali.io/v1alpha1
kind: Kiali
metadata:
  name: kiali
annotations:
  ansible.operator-sdk/reconcile-period: "0s"
spec:
  auth:
    strategy: "login"
  deployment:
    image_name: "soda2019/aladdin"
    image_pull_policy: "IfNotPresent"
    image_version: "dev"
    namespace: "istio-system"
    service_type: "NodePort"

```

* `deployment`의 내용을 위와 같이 수정한다.

### Apply kiali_cr_jyk.yaml

```bash
kubectl apply -n kiali-operator -f deploy/kiali/kiali_cr_jyk.yaml
```

* 위의 명령어를 통해 `kiali`를 생성한다.
* 기다리면 `kiali` 파드가 생성되는 것을 확인할 수 있다.
