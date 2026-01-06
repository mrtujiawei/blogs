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
