# pod를 특정 노드에 배포되게 설정하기(Assign pod in specific node)

kiali 이미지를 업데이트하며 개발을 해야 하므로 kiali 이미지가 slave node에 있으면 이미지를 docker hub에 pull & push하는 작업을 계속해야 해서 개발하는동안 이 과정을 없애기 위해 kiali가 배포되는 node를 master node로 설정한다.

1. node에 taint 설정한다.

   우선 **master 노드**에 kiali 관련 taint가 있다면 지운다.

    ```
   $ kubectl taint node master-node kiali-
    ```
   
   **slvae 노드들**에는 kiali=no:Noschedule taint를 추가한다. ```[Key]=[Value]:[Effect]``` 형태로 설정해 줄 수 있다.
   
   ```
   $ kubectl taint node slave-node kiali=no:NoSchedule
   ```
   
   설정된 내용은 ```kubectl describe node <nodename>```명령으로 Taints에서 확인할 수 있다.



2. kiali pod를 배포하는 yaml파일에 설정한다.

   ```
   spec:
     template:
       spec:
         tolerations:
         - key: "kiali"
           operator: "Equal"
           value: "no"
           effect: "NoSchedule"
   ```



3. 이렇게 하고 pod를 지우고 다시 생성하면 master 노드에 잘 생성됨을 확인할 수 있다.

   ```
   $ kubectl delete -f operator/deploy/kiali/kiali_cr.yaml -n kiali-operator
   $ kubectl apply -f operator/deploy/kiali/kiali_cr.yaml -n kiali-operator
   ```

   



