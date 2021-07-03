# 删除表
drop table if exists user;

create table user(
  id int(20),
  name varchar(40),
  age int
) default charset=utf8mb4;

# 显示表字段
desc user;
explain user;
show columns from user;

# 显示建表语句
show create table user;
