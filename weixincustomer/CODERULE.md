# 项目规范圣经

### 1. 本项目的所有代码要能在微信小程序运行
### 2. 代码要基于SOLID原则
### 3. 相同代码要抽象并抽离出来
### 4. 所有调用后端api接口，放在AppApi.tsx文件中，后端api接口有开发者实现。
  * 所有接口是都http请求，post方式，入参以json格式放在payload中
  * 返回值格式如下:
  ```json
    {
        "errcode": 0, // 0 请求成功，其他异常
        "errmsg": "", // errcode 非0时的异常信息
        "data": {}  // 这里返回业务数据，可以是任意格式 如"data": 123
    }
  ```
  * 所有api接口都由你来定义，命名格式为驼峰格式，前缀为 v1/weixincustomer/[api名称]，如v1/weixincustomer/getPigPrices
  * 所有接口入参和出参的字段由你来定义，字段名称格式是驼峰格式，如下:
  ```json
  // 入参
  {
    "current": 1,
    "size": 10,
    "searchCount": true,
    "search": "xxx"
  }
  // 返回
  {
    "errcode": 0,
    "errmsg": "",
    "data": {   // 出参
        "current": 1,
        "size": 10,
        "total": 128,
        "pages": 13,
        "records": [
            {
                "pigName": "白猪",
                "pigPrice": 10,
                "pigWeight": 228,
                "baddingArea": "山东槐村左家场"
            },
            ...
        ]
    }
  }
  ```
  * 列表请求入参固定是size、current、searchCount，出参current、size、total、pages、records

### 5. 1个页面1个代码文件，高内聚，低耦合

  
