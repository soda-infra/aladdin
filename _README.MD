# 알리딘

### 소개


알라딘은 쿠버네티스 내에서 동작하는 마이크로서비스의 네트워크 시각화와 쿠버네티스 및 물리적인 인프라에 대한 모니터링 서비스를 제공합니다.

### 시작하기


#### 전제조건

Kubernetes 1.15.0

Istio 1.20.0 (Prometheus 포함)

위 프로그램은 알라딘을 구동하는데 필수적으로 필요한 구성요소입니다.

#### 요구사항

알라딘을 구동하는데 필요한 프로메테우스 익스포터들을 설치합니다. (node-exporter, kube-state-metrics)
알라딘은 해당 요소들을 간단하게 설치할 수 있도록 Helm 차트를 제공합니다.

    git install https://github.com/soda-infra/aladdin-requirements
    helm install aladdin-requirements --name aladdin-requirements

#### 컨테이너 이미지 빌드하기

    cd ${GOPATH}/src/github.com/soda-infra/aladdin
    make docker-build
    
#### 쿠버네티스에 알라딘 배포하기

    cd ${GOPATH}/src/github.com/soda-infra/aladdin/operator
    make kiali-create

#### 쿠베네티스에 배포한 알라딘 지우기

    cd ${GOPATH}/src/github.com/soda-infra/aladdin/operator
    make kiali-delete



### 라이센스


Apache License 2.0
