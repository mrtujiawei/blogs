# Spring #

## AOP配置 ##

xml方式
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd">

    <bean id="accountService" class="com.aop.service.impl.AccountServiceImpl"></bean>
    <!--
        1. 把通知的bean也交给spring来管理
        2. 使用aop:config表示开始AOP的配置
        3. 使用aop:aspect表明开始配置切面
            id 切面唯一标志
            ref 通知类bean的id
        4. 在aop:aspect内部使用对应的标签来配置通知的类型
            前置通知 aop:before 用于指定那个方法前置
        5. pointcut 指定切入点表达式:对业务层中那些方法增强
            execution(表达式)
            表达式:访问修饰符 返回值 包名.包名...类名.方法名(参数列表)
            访问修饰符可以省略
            返回值可以用通配符: *
            包名可以使用通配符表示任意包,有几级包就需要写几个* (*.*.*.*) 或(*..*)
            类名和方法名都可以使用*来实现通配
            参数列表可以直接写数据类型,基本类型写名称,引用类型写包名.类名 (*) 一个 (..) 任意多个
    -->
    写在aop:aspect外面,所有配置可用(需要在切面之前写)
    里面,只有当前配置可以用
    <aop:pointcut id="pt1" expression="execution(* com.aop.service.impl.*.*(..))"></aop:pointcut>
    <bean id="logger" class="com.aop.service.uilts.Logger"></bean>
<!--    配置AOP-->
    <aop:config>
        <aop:aspect id="logAdvice" ref="logger">
            <aop:before method="printLog" pointcut="execution(public void com.aop.service.impl.AccountServiceImpl.saveAccount())"></aop:before>
<!--            环绕通知  不执行-->
            <aop:around method="printAround" pointcut-ref="pt1" ></aop:around>
<!-- 执行
    public Object printAround(ProceedingJoinPoint pjp) throws Throwable {
        Object[] args = pjp.getArgs();
        System.out.println("printAround");
        return pjp.proceed(args);
    }

-->
        </aop:aspect>
    </aop:config>
</beans>
```

注解方式

```xml
约束和这个
<aop:aspectj-autoproxy></aop:aspectj-autoproxy>
```
或者纯注解
@EnableAspectJ

```java
@Component("logger")
@Aspect
public class Logger {
    @Pointcut("execution(* com.aop.service.impl.*.*(..))")
    private void pt1() {};

    @Before("pt1()")
    public void printLog() {
        System.out.println("Print Before");
    }
    @After("pt1()")
    public void afterLog() {
        System.out.println("Print after");
    }
}

```

## 注解IOC ##
调用
```java
ac = new AnnotationConfigApplicationContext(SpringConfig.class);
		as = ac.getBean("accountService", IAccountService.class);
```

主配置
```java
//指定当前类是一个配置类
//主配置可以不写,因为使用类名.class直接调用的
//最好还是写上
@Configuration
//扫描包
@ComponentScan("com.spring")
//有这个的就是主配置类
@Import(JdbcConfig.class)
public class SpringConfig {
//	指定创建容器时要扫描的包
	@Bean("runner")
	@Scope("prototype")
	public QueryRunner getRunner(DataSource dataSource) {
		return new QueryRunner(dataSource);
	}

}
```

子配置
```
//指定文件的名称和路径
@PropertySource("classpath:jdbcConfig.properties")
@Configuration
public class JdbcConfig {
	@Value("${jdbc.user}")
	private String user;
	@Value("${jdbc.password}")
	private String password;
	@Bean("dataSource")
	public DataSource getDataSource() {
		ComboPooledDataSource ds = new ComboPooledDataSource();
		try {
			ds.setDriverClass("com.mysql.jdbc.Driver");
			ds.setJdbcUrl("jdbc:mysql://localhost:3306/test");
			ds.setUser(user);
			ds.setPassword(password);
		} catch (PropertyVetoException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return ds;
	}
}
```
## XML方式配置注入 ##
配置bean对象
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="UserService" class="com.spring.service.impl.UserServiceImpl" scope="prototype">
        <!-- 构造方法注入 -->
    	<constructor-arg name="name" value="tujiawei"></constructor-arg>
    	<constructor-arg name="age" value="18"></constructor-arg>
        <!-- 
            除基本类型和String 
        -->
    	<constructor-arg name="birtyday" ref="now"></constructor-arg>
    </bean>
    <bean id="now" class="java.util.Date"></bean>
    
    <!-- set 方法注入 -->
    <bean id="UserService" class="com.spring.service.impl.UserServiceImpl" scope="prototype">
    	<property name="age" value="20"></property>
    	<property name="name" value="tujiawei"></property>
    </bean>
    <bean id="now" class="java.util.Date"></bean>
</beans>
```

## 注解方式注入 ##

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">
    <!-- 只需配置一次 -->
    <context:component-scan base-package="com.spring"></context:component-scan>
</beans>
```

```java
//把当前对象存入spring容器中
//如果没写就是当前类名且首字母改小写
@Component("userService")

//可以随意退换为一下三种
//@Controller 和Component一样,一般用于表现层
//@Repository	一般业务层
//@Service	一般持久层

//作用域范围 singleton prototype
//默认单例
@Scope("singleton")
public class UserServiceImpl implements IUserService {
//	基本类型和String类型
//	直接指定值
	@Value("")
	private String name;
	
	private Integer age;
//	注入时先找类型匹配的
//	如果有多个找名字匹配的
//	还是行就用Qualifier, 指定注入的类型
//	还有另一种方式,直接指定bean的ID
//	@Resource(name="userDao")
//  集合类型只能通过xml来实现
	
//	@Autowired
//	@Qualifier("userDao")
	@Resource(name="userDao")
	private IUserDao userDao;
//	指定销毁方法
	@PreDestroy
	private void destroy() {
		System.out.println("destroy");
	}
//	初始化方法
	@PostConstruct
	private void init() {
		System.out.println("init");
	}
	public void saveUser() {
		userDao.saveUser();
	}
	
}

```

获取对象
```java
ApplicationContext ac = new ClassPathXmlApplicationContext("bean.xml");
IUserService us = ac.getBean("UserService", IUserService.class);
```

## Mybatis环境搭建 ##

### 依赖 ###
```xml
<dependencies>
  	<dependency>
		  <groupId>org.mybatis</groupId>
		  <artifactId>mybatis</artifactId>
		  <version>3.4.5</version>
	  </dependency>
	  <dependency>
		  <groupId>mysql</groupId>
		  <artifactId>mysql-connector-java</artifactId>
		  <version>5.1.16</version>
	  </dependency>
	  <dependency>
		  <groupId>log4j</groupId>
		  <artifactId>log4j</artifactId>
		  <version>1.2.12</version>
	  </dependency>
	  <dependency>
		  <groupId>junit</groupId>
		  <artifactId>junit</artifactId>
		  <version>4.10</version>
	  </dependency>
  </dependencies>
```

### resources 中的配置 ###
SqlMapConfig.xml (可以取别的名字) 根配置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">

 <!-- 主配置 -->
 <configuration>
 	<!-- 将数据库配置移到外面去
 		<properties resource="jdbcConfig.properties" />
 		要用的时候需要"${value}来使用
 	 -->
 	<!-- 配置别名,不需要写类全名
	 	<typeAliases>
	 		<package name="com.mybatis.domain"/>
	 	</typeAliases>
	-->
 	<!-- 开启缓存 -->
 	<settings>
 		<setting name="cacheEnabled" value="true"/>
 	</settings>

	 <!-- 配置环境 -->
 	<environments default="mysql">
 		<!-- 配置mysql  -->
 		<environment id="mysql">
 		 	<!-- 配置事务类型 -->
	 		<transactionManager type="JDBC"></transactionManager>
	 		<!-- 配置连接池 -->
	 		<dataSource type="POOLED">
	 			<!-- 连接数据库的基本信息 -->
	 			<property name="driver" value="com.mysql.jdbc.Driver"/>
	 			<property name="url" value="jdbc:mysql://localhost:3306/eesy_mybatis?characterEncoding=utf-8"/>
	 			<property name="username" value="root"/>
	 			<property name="password" value="tujiawei"/>
	 		</dataSource>
 		</environment>
 	</environments>
 	<!-- 映射配置文件 带有注解的dao接口位置 -->
 	<mappers>
 		<package name="com.mybatis.dao"/>
 	</mappers>
 </configuration>
```

### log4j.properties ###

```properties
# Set root category priority to INFO and its only appender to CONSOLE.
#log4j.rootCategory=INFO, CONSOLE            debug   info   warn error fatal
log4j.rootCategory=debug, CONSOLE, LOGFILE

# Set the enterprise logger category to FATAL and its only appender to CONSOLE.
log4j.logger.org.apache.axis.enterprise=FATAL, CONSOLE

# CONSOLE is set to be a ConsoleAppender using a PatternLayout.
log4j.appender.CONSOLE=org.apache.log4j.ConsoleAppender
log4j.appender.CONSOLE.layout=org.apache.log4j.PatternLayout
log4j.appender.CONSOLE.layout.ConversionPattern=%d{ISO8601} %-6r [%15.15t] %-5p %30.30c %x - %m\n

# LOGFILE is set to be a File appender using a PatternLayout.
log4j.appender.LOGFILE=org.apache.log4j.FileAppender
log4j.appender.LOGFILE.File=d:\axis.log
log4j.appender.LOGFILE.Append=true
log4j.appender.LOGFILE.layout=org.apache.log4j.PatternLayout
log4j.appender.LOGFILE.layout.ConversionPattern=%d{ISO8601} %-6r [%15.15t] %-5p %30.30c %x - %m\n
```

domain中写实体类
dao中写接口
resources中写sql映射

```java
// 测试
        SqlSession session;
	InputStream in;
	IUserDao userDao;
	@Before
	public void init() throws IOException {
		in = Resources.getResourceAsStream("SqlMapConfig.xml");
		SqlSessionFactory factory= new SqlSessionFactoryBuilder().build(in);
		session = factory.openSession();
		userDao = session.getMapper(IUserDao.class);
	}
	@After
	public void close() throws IOException {
                session.commit();
		in.close();
		session.close();
	}
```

### 注解方式取别名 ###
```java
@Results(id="id", value = {
			@Result(id = true, column = "id", property = "userId"),
			@Result(column = "username", property = "userName"),
			@Result(column = "address", property = "userAddress"),
			@Result(column = "sex", property = "userSex"),
			@Result(column = "birthday", property = "birthday"),
// 一对多
@Result(column = "id", property = "accounts", many = @Many(select = "com.mybatis.dao.IAccountDao.findAll")),
// 一对一
@Result(column = "id", property = "accounts", one = @One(select = "com.mybatis.dao.IAccountDao.findById"))
	})
// 一处定义多处使用
@ResultMap("id")

// 标注写法
@ResultMap(value={"id", "id1"})
```
