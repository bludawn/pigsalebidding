# 后台开发规范圣经

### 1. 业务表sql建表规范
  - 表名必须用t_ 开头，名称用驼峰命名，如t_pigResource。
  - 字段名必须用f_ 开头，名称用驼峰命名，如f_id，f_name，f_orderId，f_customerPhoneNumber。总长度不能超过32位，超过32个考虑缩写。
  - 每个主表都是f_id字段，分录表必须有f_entryId和f_id字段
  - 每个主表必须有审计字段 f_createTime，f_updateTime，f_creator，f_updator
  - 业务上有关联，但表中不要建外键
  
