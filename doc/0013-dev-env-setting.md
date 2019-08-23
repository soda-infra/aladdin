# master firewall
    sudo ufw allow 6443/tcp
    sudo ufw allow 2379/tcp
    sudo ufw allow 2380/tcp
    sudo ufw allow 10250/tcp
    sudo ufw allow 10251/tcp
    sudo ufw allow 10252/tcp


# worker firewall
    sudo ufw allow from k8s-master


# package list update
    sudo apt update
    sudo apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -  
    sudo add-apt-repository \
       "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
       $(lsb_release -cs) \
       stable" 
    sudo apt update


# install docker (version:apt-cache madison docker-ce)
    sudo apt-get install docker-ce=5:18.09.8~3-0~ubuntu-bionic docker-ce-cli=5:18.09.8~3-0~ubuntu-bionic
    sudo systemctl enable docker

# verify docker
    docker run hello-world


# install kubernetes
    apt-get update && apt-get install -y apt-transport-https curl
    curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
    cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
    deb https://apt.kubernetes.io/ kubernetes-xenial main
    EOF
    apt-get update
    apt-get install -y kubelet kubeadm kubectl
    apt-mark hold kubelet kubeadm kubectl


# config about kubernetes initialize
    cat > /etc/docker/daemon.json <<EOF
    {
      "exec-opts": ["native.cgroupdriver=systemd"],
      "log-driver": "json-file",
      "log-opts": {
        "max-size": "100m"
      },
      "storage-driver": "overlay2"
    }
    EOF
    mkdir -p /etc/systemd/system/docker.service.d
    systemctl daemon-reload
    systemctl restart docker
    sudo swapoff -a  
    sudo systemctl enable --now kubelet


# initialize kubernetes cluster
    sudo kubeadm init --pod-network-cidr=10.244.0.0/16


# enable kubectl
    mkdir -p $HOME/.kube
    sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
    sudo chown $(id -u):$(id -g) $HOME/.kube/config


# apply flannel
    kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/bc79dd1505b0c8681ece4de4c0d86c5cd2643275/Documentation/kube-flannel.yml


# kubernetes join example
    kubeadm join 203.253.25.140:6443 --token 1nuxuq.frfzlpfaaphpbst6 \
        --discovery-token-ca-cert-hash sha256:14c725a8bc2a10618908cd086eb30e11a4b6f07431d2987009d57a73ac732a29


# kubeadm join 시 token 및 hash 만료시 새로 발급 받는 방법
    kubeadm token list
    kubeadm token create
    openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | \
       openssl dgst -sha256 -hex | sed 's/^.* //'


# install kubernetes dashboard
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v1.10.1/src/deploy/recommended/kubernetes-dashboard.yaml

    cat >> admin-user.yaml <<EOF
    apiVersion: v1
    kind: ServiceAccount
    metadata:
      name: admin-user
      namespace: kube-system
    EOF

    cat >> admin-role.yaml <<EOF
    apiVersion: rbac.authorization.k8s.io/v1beta1
    kind: ClusterRoleBinding
    metadata:
      name: admin-user
    roleRef:
      apiGroup: rbac.authorization.k8s.io
      kind: ClusterRole
      name: cluster-admin
    subjects:
    - kind: ServiceAccount
      name: admin-user
      namespace: kube-system
    EOF

# create user and role
    kubectl apply -f admin-user.yaml
    kubectl apply -f admin-role.yaml

# check token
    kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep admin-user | awk '{print $1}')
 

# install helm
    curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get > install-helm.sh
    chmod u+x install-helm.sh
    ./install-helm.sh


# config about tiller
    kubectl -n kube-system create serviceaccount tiller
    kubectl create clusterrolebinding tiller --clusterrole cluster-admin --serviceaccount=kube-system:tiller
    helm init --service-account tiller


# download istio-1.2.0
    curl -L https://git.io/getLatestIstio | ISTIO_VERSION=1.2.0 sh -
    export PATH="$PATH:$HOME/istio-1.2.0/bin"
    helm repo add istio.io https://storage.googleapis.com/istio-release/releases/1.2.0/charts/


# install go-lang
    curl -O https://dl.google.com/go/go1.11.5.linux-amd64.tar.gz
    sudo tar -C /usr/local -xzf go1.11.5.linux-amd64.tar.gz
    export PATH="$PATH:/usr/local/go/bin:$HOME/go/bin"

# verify installed go-lang
    go env


# install istio-init
    helm install install/kubernetes/helm/istio-init --name istio-init --namespace istio-system

# verify istio-init (23)
    kubectl get crds | grep 'istio.io\|certmanager.k8s.io' | wc -l


# install istio with additional charts
    helm install install/kubernetes/helm/istio \
        --name istio \
        --namespace istio-system \
        --set tracing.enabled=true \
        --set global.mtls.enabled=true \
        --set grafana.enabled=true \
        --set kiali.enabled=true \
        --set servicegraph.enabled=true


# labeled istio-injection for default namespace
    kubectl label namespace default istio-injection=enabled


# install istio example
    kubectl apply -f samples/bookinfo/platform/kube/bookinfo.yaml
    kubectl apply -f samples/bookinfo/networking/bookinfo-gateway.yaml
    export INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].nodePort}')
    export SECURE_INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="https")].nodePort}')
    export INGRESS_HOST=$(kubectl get po -l istio=ingressgateway -n istio-system -o jsonpath='{.items[0].status.hostIP}')
    export GATEWAY_URL=$INGRESS_HOST:$INGRESS_PORT
    kubectl apply -f samples/bookinfo/networking/destination-rule-all-mtls.yaml

# verify
    curl -s http://${GATEWAY_URL}/productpage | grep -o "<title>.*</title>"


# istio 등 모든 설치가 끝나면 taint 변경
    kubectl taint node {WORKER-NODE} kiali=no:NoSchedule
    kubectl taint nodes --all node-role.kubernetes.io/master-
    
# remove taint
    kubectl taint nodes {WORKER-NODE} kiali:NoSchedule-


# create kiali token (username:sung-il, password:ssuadmin123 / 원하는 유저명 및 비밀번호는 echo -n 'admin' | base64 이런식으로 인코딩해서 변경해주면 됨)
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: Secret
    metadata:
      name: kiali
      namespace: istio-system
      labels:
        app: kiali
    type: Opaque
    data:
      username: c3VuZy1pbA==
      passphrase: c3N1YWRtaW4xMjM=
    EOF


# create grafana token
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: Secret
    metadata:
      name: grafana
      namespace: istio-system
      labels:
        app: grafana
    type: Opaque
    data:
      username: c3VuZy1pbA==
      passphrase: c3N1YWRtaW4xMjM=
    EOF


# install nodejs, gcc, g++, make, yarn
    curl -sL https://deb.nodesource.com/setup_10.x | bash -
    sudo apt-get install -y nodejs
    sudo apt-get install gcc g++ make
    npm install -g yarn


# get packages
    go get github.com/soda-infra/aladdin
    go get github.com/soda-infra/aladdin-ui


# build packages
    cd $HOME/go/src/github.com/soda-infra/aladdin-ui
    yarn
    yarn build
    cd ../aladdin
    make soda-build # (make build & make docker-build)
    cd operator
    make operator-create
    make kiali-create 


# create kiali (=make kiali-create)
    kubectl create -n kiali-operator -f deploy/kiali/aladdin_cr_dev.yaml


# delete kiali
    kubectl create -n kiali-operator -f deploy/kiali/aladdin_cr_dev.yaml
    
    
# node-exporter
    cat >> node-exporter.yaml <<EOF
    apiVersion: v1
    kind: Service
    metadata:
      annotations:
        prometheus.io/scrape: 'true'
      labels:
        app: node-exporter
        name: node-exporter
      name: node-exporter
    spec:
      clusterIP: None
      ports:
      - name: scrape
        port: 9100
        protocol: TCP
      selector:
        app: node-exporter
      type: ClusterIP
    ---
    apiVersion: extensions/v1beta1
    kind: DaemonSet
    metadata:
      name: node-exporter
    spec:
      template:
        metadata:
          labels:
            app: node-exporter
          name: node-exporter
        spec:
          tolerations:
            - key: node-role.kubernetes.io/master
              effect: NoSchedule
          containers:
          - image: prom/node-exporter
            name: node-exporter
            ports:
            - containerPort: 9100
              hostPort: 9100
              name: scrape
          hostNetwork: true
          hostPID: true
    EOF

    kubectl create -f node-exporter.yaml


# kube-state-metrics
    go get k8s.io/kube-state-metrics
    cd $GOPATH/src/k8s.io/kube-state-metrics
    make container 
    kubectl apply -f kubernetes


# prometheus, grafana NodePort로 변경 (ClusterIP를 NodePort로 변경)
    kubectl edit svc prometheus -n istio-system
    kubectl edit svc grafana -n istio-system


# alias
    cat >> ~/.bash_profile <<EOF
    export PATH="\$PATH:\$HOME/istio-1.2.0/bin"
    export PATH="\$PATH:/usr/local/go/bin:\$HOME/go/bin"
    alias k='kubectl'
    alias kp='kubectl get pod -A'
    alias ks='kubectl get svc -A'
    EOF
    
    cat >> ~/.bashrc <<EOF
    source ~/.bash_profile
    EOF
    
    source ~/.bashrc


# reset kubernetes cluster
    kubeadm reset 
    iptables -F && iptables -t nat -F && iptables -t mangle -F && iptables -X
    systemctl stop kubelet & systemctl stop docker
    rm -rf /var/lib/cni
    rm -rf /run/flannel
    rm -rf /etc/cni
    ifconfig cni0 down & ip link delete cni0
    ifconfig flannel.1 down & ip link delete flannel.1
    ifconfig docker0 down
    systemctl start kubelet & systemctl start docker




