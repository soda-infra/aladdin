# 개발을 위한 Logging 

개발을 하다보면 확인을 위해 Log를 찍어봐야 한다.

kiali의 로그를 얻기 위해 ```github.com/kiali/kiali/log```를 import하여 log를 찍는다. (내부에서 glog를 사용한다.)

```
import (
	"github.com/kiali/kiali/log"
)
```



실제로 위의 경로의 ```log.go```파일을 보면 다양한 로그를 찍는 함수가 있다. 

단순히 print를 하려면 ```Info()```함수나 ```Debug()```함수를 사용하고, 변수나 함수의 리턴값을 넘겨주는 형태로 로그를 찍고싶다면 ```Infof()```함수 또는 ```Debugf()```함수를 사용하면 된다. 이 로그들은 /var/log/container/\<kialipod>에서 확인할 수 있다.
