# MySQL

## 外键约束

建表时添加外键约束

```sql
constraint [constraint_name] foreign key ([key]) references [table] ([key])
```

建表后添加外键约束

```sql
alter table [table_name] add constraint [constraint_name] foreign key [key_name] references [foreign_table_name] ([key_name])
```

条件表达式

```sql
CASE 表达式 WHEN 值1 THEN 表达式1 [ WHEN 值2 THEN 表达式2] ELSE 表达式m END
```

创建视图

```sql
CREATE [OR REPLACE]
VIEW 视图名称 [(字段列表)]
AS 查询语句
```

存储过程

```sql
CREATE PROCEDURE 存储过程名 （[ IN | OUT | INOUT] 参数名称 类型）程序体
```

存储过程(demo)

```sql
DELEMITER //
begin;

end;
//
DELEMITER ;

-- 调用存储过程
call demo.dailyoperation([参数]);
```

> demo

```sql
-- 准备数据
drop table if exists transactiondetails;
create table transactiondetails ( transactionid int, itemnumber int, quantity decimal(10, 3), salesprice decimal(10, 2), salesvalue decimal(10, 2));
insert into transactiondetails values (1, 1, 1.000, 89.00, 89.00);
insert into transactiondetails values (1, 2, 2.000, 5.00, 10.00);
insert into transactiondetails values (2, 1, 2.000, 89.00, 178.00);
insert into transactiondetails values (3, 2, 10.000, 5.00, 50.00);
insert into transactiondetails values (3, 3, 3.000, 15.00, 45.00);
drop table if exists transactionhead;
create table transactionhead ( transactionid int, transactionno varchar(20), cashierid int, memberid int, operatorid int, transdate datetime);
insert into transactionhead values ( 1, 0120201201000001, 1, 1, 1, '2020-12-01 00:00:00');
insert into transactionhead values ( 2, 0120201201000002, 1, NULL, 1, '2020-12-01 00:00:00');
insert into transactionhead values ( 3, 0120201202000001, 1, NULL, 1, '2020-12-02 00:00:00');
drop table if exists goodsmaster;
create table goodsmaster ( itemnumber int, barcode varchar(20), goodsname varchar(20), specification varchar(20), unit varchar(10), salesprice decimal(10, 2), avgimportprice decimal(10, 2));
insert into goodsmaster values (1, 0001, '书', NULL, '本', 89.00, 33.50);
insert into goodsmaster values (2, 0002, '笔', NULL, '支', 5.00, 3.50);
insert into goodsmaster values (3, 0003, '胶水', NULL, '瓶', 15.00, 11.00);
drop table if exists dailystatistics;
create table dailystatistics ( id int primary key auto_increment, itemnumber int, quantity decimal(10, 3), actualvalue decimal(10, 2), cost decimal(10, 2), profit decimal(10, 2), profitratio decimal(10, 4), salesdate datetime);

drop procedure if exists demo.dailyoperation;
delimiter //

--  定义存储过程
create procedure demo.dailyoperation (transdate text) 
begin
  declare startdate, enddate datetime;
  SET startdate = date_format(transdate,'%Y-%m-%d');
  set enddate = date_add(startdate, interval 1 day);

  delete from demo.dailystatistics where salesdate = startdate;

  insert into
    dailystatistics (
      salesdate,
      itemnumber,
      quantity,
      actualvalue,
      cost,
      profit,
      profitratio
    )
  select
    left (b.transdate, 10),
    a.itemnumber,
    sum(a.quantity),
    sum(a.salesvalue),
    sum(a.quantity * c.avgimportprice),
    sum(a.salesvalue - a.quantity * c.avgimportprice),
    case sum(a.salesvalue)
      when 0 then 0
      else round(
        sum(a.salesvalue - a.quantity * c.avgimportprice) / sum(a.salesvalue),
        4
      )
    end
  from
    demo.transactiondetails as a
    join demo.transactionhead as b on a.transactionid = b.transactionid
    join demo.goodsmaster as c on a.itemnumber = c.itemnumber
  where
    b.transdate >= startdate
    and b.transdate < enddate
  group by
    left (b.transdate, 10),
    a.itemnumber
  order by
    left (b.transdate, 10),
    a.itemnumber;
end
//
delimiter ;

--  调用
call demo.dailyoperation ('2020-12-01');

--  查看结果
select * from demo.dailystatistics;
```
游标

```sql
declare [cursor_name] cursor for [query];
open [cursor_name];
fetch [cursor_name] into [variable0, variable1, ...variablen];
close [cursor_name];
```

游标 demo
```sql
drop table if exists demo.test;

create table demo.test (id int primary key, myquant int);

insert into
  demo.test
values
  (1, 101);

insert into
  demo.test
values
  (2, 102);

insert into
  demo.test
values
  (3, 103);

insert into
  demo.test
values
  (4, 104);


drop procedure if exists rowIncrement;

delimiter //
create procedure rowIncrement()
begin
  declare cid, cquant int;
  declare done int default false;

  declare cursor_increment cursor for select id from demo.test;
  declare continue handler for not found set done = true;

  open cursor_increment;
  fetch cursor_increment into cid;
  while not done do
    update demo.test set myquant = case mod(myquant, 2) when 0 then myquant + 1 else myquant + 2 end where id = cid;
    fetch cursor_increment into cid;
  end while;
 
  close cursor_increment;
end
//
delimiter ;

select * from demo.test;
call rowIncrement();
select * from demo.test;
```

游标 demo 2

```sql
drop table if exists importhead;
create table importhead (listnumber int comment '进货单编号', supplierid int comment '供货商编号', stockid int comment '仓库编号', operatorid int comment '操作员编号', totalquantity int comment '进货数量', totalvalue decimal(30, 3) comment '进货金额', recordingdate datetime comment '进货日期');
insert into importhead values (1234, 1, 1, 1, 18, 171, '2020-12-12');

drop table if exists importdetails;
create table importdetails ( listnumber int comment '进货单号', itemnumber int comment '商品编号', quantity int comment '进货数量', importprice decimal(10, 3) comment '进货价格', importvalue decimal(30, 3) comment '进货金额');
insert into importdetails values (1234, 1, 5, 33, 165);
insert into importdetails values (1234, 2, 3, 2, 6);

drop table if exists inventory;
create table inventory ( stockid int comment '仓库编号', itemnumber int comment '商品编号', invquantity int comment '库存数量');
insert into inventory values (1, 1, 10);
insert into inventory values (1, 2, 20);

drop table if exists goodsmaster;
create table goodsmaster ( itemnumber int comment '商品编号', barcode int comment '商品条码', goodsname varchar(50) comment '商品名称', specification varchar(20) comment '商品规格', unit char(10) comment '单位', salesprice decimal(30, 3) comment '售价', avgimportprice decimal(30, 3) comment '平均进价');
insert into goodsmaster values (1, '0001', '书', '16开', '本', 89, 30);
insert into goodsmaster values (2, '0002', '笔', null, '支', 5, 3);

drop procedure if exists importgoods;

delimiter //
create procedure importgoods(ilistnumber int)
begin

  declare done int default false;
  declare cstockid, citemnumber, cquantity int;
  declare cimportprice decimal(10, 3);

  declare cursor_importgoods cursor for
  select ih.stockid, id.itemnumber,id.importprice,id.quantity from importhead ih join importdetails id on ih.listnumber = id.listnumber where id.listnumber = ilistnumber;

  declare continue handler for not found set done = true;

  open cursor_importgoods;
  fetch cursor_importgoods into cstockid, citemnumber, cimportprice, cquantity;

  while not done do
    update demo.goodsmaster a, inventory b set a.avgimportprice = (a.avgimportprice * b.invquantity + cimportprice * cquantity) / (b.invquantity + cquantity) 
    where a.itemnumber = b.itemnumber and b.stockid = cstockid and a.itemnumber = citemnumber;
    update inventory set invquantity = invquantity + cquantity where stockid = cstockid and itemnumber = citemnumber;
    fetch cursor_importgoods into cstockid, citemnumber, cimportprice, cquantity;
  end while;

  close cursor_importgoods;
end
//
delimiter ;

call importgoods(1234);
select * from goodsmaster;
select * from inventory;
```

存储函数

```sql
CREATE FUNCTION 函数名称 （参数）RETURNS 数据类型 程序体
```

条件处理语句

```sql
DECLARE 处理方式 HANDLER FOR 问题 操作；
```

条件处理语句(demo)

```sql
declare continue handler for not found set done = true;
```


ITERATE 语句：只能用在循环语句内，表示重新开始循环。

LEAVE 语句：可以用在循环语句内，或者以 BEGIN 和 END 包裹起来的程序体内，表示跳出循环或者跳出程序体的操作

循环语句

```sql
标签：LOOP
操作
END LOOP 标签;

WHILE 条件 DO
操作
END WHILE;

REPEAT
操作
UNTIL 条件 END REPEAT；
```

IF 语句

```sql
IF 表达式1 THEN 操作1
[ELSEIF 表达式2 THEN 操作2]……
[ELSE 操作N]
END IF
```

条件表达式

```sql
CASE 表达式
WHEN 值1 THEN 操作1
[WHEN 值2 THEN 操作2]……
[ELSE 操作N]
END CASE;
```

触发器

> 触发器执行失败时，触发触发器的操作也会失败

```sql
CREATE TRIGGER 触发器名称 {BEFORE|AFTER} {INSERT|UPDATE|DELETE}
ON 表名 FOR EACH ROW 表达式；
```

触发器 demo

```sql
drop table if exists demo.membermaster;

create table demo.membermaster (
  memberid int,
  cardno varchar(30),
  membername varchar(30),
  address varchar(30),
  phone varchar(14),
  memberdeposit decimal(10, 2)
);

insert into
  demo.membermaster
values
  (1, 10000001, '张三', '北京', '13812345678', 100);

insert into
  demo.membermaster
values
  (2, 10000002, '李四', '天津', '18512345678', 200);

drop table if exists demo.deposithist;

create table demo.deposithist (
  id int primary key auto_increment,
  memberid int,
  transdate datetime,
  oldvalue decimal(10, 2),
  newvalue decimal(10, 2),
  changedvalue decimal(10, 2)
);

-- 自动插入操作记录
delimiter //
create trigger trigger_deposithist before update on demo.membermaster for each row
begin
  if (new.memberdeposit <> old.memberdeposit)
    then
      insert into deposithist (memberid, transdate, oldvalue, newvalue, changedvalue)
      select new.memberid, now(), old.memberdeposit, new.memberdeposit, new.memberdeposit - old.memberdeposit;
  end if;
end
//
delimiter ;

update demo.membermaster
set
  memberdeposit = memberdeposit - 150
where
  memberid = 2;

select
  memberdeposit
from
  demo.membermaster
where
  memberid = 2;
```

角色

```sql
drop role if exists 'stocker';

--  创建角色
create role 'stocker';

--  赋予权限
--  GRANT [PERMISSIONS] ON [TABLE] TO [ROLE];

grant select on demo.goodsmaster to 'stocker';
grant insert, delete, update, select on demo.invcount to 'stocker';

grant select on demo.settlement to '';

-- 查看权限
show grants for 'stocker';

-- 所有角色永久激活
-- 默认是不启用的
SET global activate_all_roles_on_login=ON;
```

用户

```sql
--  创建用户
--  可以不用密码，但最好还是设置密码
CREATE USER [USERNAME] [IDENTIFIED BY [PASSWORD]];

-- 给用户授权 角色
GRANT [ROLE] TO [USER];

-- 给用户授权 直接
GRANT [PERMISSIONS] ON [TABLE] TO [USER];

-- 查看用户权限
SHOW GRANTS FOR [USER];

```

日志

```sql
-- 显示日志相关变量
SHOW VARIABLES LIKE '%general%';

-- 开启日志记录
SET GLOBAL general_log = 'ON';

-- 关闭日志记录
SET GLOBAL general_log = 'OFF';
```

慢查询配置

```sql
-- 表示开启慢查询日志
-- 系统将会对慢查询进行记录
slow-query-log=1
 
-- 配置慢查询日志的名称
-- 这里没有指定文件夹，默认就是数据目录
slow_query_log_file="[LOG_NAME]"
 
-- 表示慢查询的标准是查询执行时间超过N秒
long_query_time=[N]

-- 查询扫描过的最少记录数
-- 如果查询扫描过的记录数大于等于这个变量的值，并且查询执行时间超过 long_query_time 的值，
-- 那么，这个查询就被记录到慢查询日志中；反之，则不被记录到慢查询日志中。
min_examined_row_limit
```
