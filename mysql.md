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
