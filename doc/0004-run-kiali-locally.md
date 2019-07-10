## Run Kiali Locally

### `/source/kiali/kiali-ui/package.json` 수정

```json
{
  "name": "@kiali/kiali-ui",
  "version": "1.2.0",
  "proxy": "https://10.98.37.185:20001/kiali",
  "description": "React UI for [Kiali](https://github.com/kiali/kiali).",
  "keywords": [
    "istio service mesh",
    "kiali",
    "monitoring",
    "observability",
    "okd",
    "openshift"
  ],
  ...
}
```

* `proxy` 추가. `kubectl get svc -A` 명령을 실행했을 때 나오는 `kiali` 서비스 IP로 설정함. 
  (현재 나의 `kiali`서비스 타입은 `NodePort`이다)
* 주소 뒤에 `/kiali`를 꼭 붙여줘야 제대로 동작한다.

### `run kiali`

```bash
$ cd /source/kiali/kiali-ui
$ yarn start
```

* `kiali-ui` 디렉터리로 가서 `yarn start`를 하면, `localhost:3000`에서 동작하는 것을 확인할 수 있다.