---
title: 2019-2020届-Java应届生面试题总结，附带真实面试记录
copyright: true
comments: true
toc: true
tags:
  - Java面试题
categories:
  - Java
abbrlink: 6669b4ec
date: 2019-07-13 20:21:02
---

# 1. map怎么实现hashcode和equals,为什么重写equals必须重写hashcode

## 1. equals方法是Object类的一个基本方法，他实际上是用来比较两个对象的引用地址是否一致，从而返回一个Boolean结果。

```java
public boolean equals(Object obj) {
	return (this == obj);     
}
```
## 2. equals()与‘==’的区别
      大多人会说`equlas`是比较内容，而`==`是比较内存地址。但是从上面的代码可以得知，`equals`实际上是借用了`==`运算符，比较了内存地址，所以上述的回答是正确的吗？先看一段示例代码：
```java
public class Car {
          private int batch;
          public Car(int batch) {
          this.batch = batch;
      }
      // ----------------------------
      public static void main(String[] args) {
          Car c1 = new Car(1);
          Car c2 = new Car(1);
          System.out.println(c1.equals(c2));
          System.out.println(c1 == c2);
      }
}
```
**返回结果：**

```java
false
false
```
**分析：**对于`==`返回的flase很好理解，，因为`==`是比较内存地址，而两个Car对象的地址是不同的，所以自然是false。
但是对于`equals`返回的false，是怎么理解的？如果说`equals`是比较内容，此时应该是返回true，为什么是返回false？这是因为Java里所有的对象都是基于Object类，所以Car类也是继承自Object类，自然也有equals方法。但是从问题1的代码可以得知，`equals`方法的是依赖于运算符`==`，所以在不重写`equals`方法的时候，默认还是比较两个对象的内存地址，两个对象的地址不同，自然返回false。
**如果我想让Car的batch相等，则用equals也返回true时，应该怎么做？**
在Car里，重写equals方法，判断Car的batch属性即可，示例代码如下：

```java
@Override
public boolean equals(Object obj) {
    if (obj instanceof Car) {
        Car c = (Car) obj;
        return batch == c.batch;
    }
    return false;
}
```
**代码原理：**通过instance关键字，判断对象是否属于Car类，通过后进一步判断batch属性是否相等。否则返回false。

**总结：**默认情况下equals方法和==是等价的，是对比对象的内存地址。但是我们可以通过方法重写，按照我们自己的需求进行比较。例如String类的equals方法，是比较字符串的序列，而不再是内存地址。

## 3.**为什么重写equals()的同时还得重写hashCode()**

Map集合在添加元素的时候，先要计算该元素的Hash值，然后根据Hash值才决定该元素的存储位置。当多个元素的Hash值相同的时候，就会以链表的形式存储。但是在存储之前还需要与旧元素进行对比是否相同，如果相同则不存入。不重写HashCode会导致**相同内容的一个对象，在取出时为null。**原因就是虽然两个对象内容相同，但是由于没有重写HashCode方法，导致默认调用Object类的HashCode方法，返回了该对象的地址，而两个对象虽然内容是相同，但是地址不同的，那么新的对象就去一个不存在bucket里寻找，自然是返回null。

参考自：[重写equal()时为什么也得重写hashCode()之深度解读equal方法与hashCode方法渊源](https://blog.csdn.net/javazejian/article/details/51348320)

> 
>
> 多线程的start和run函数的区别

# 2.新人的疑惑：什么是Java的三大特性，五大原则

## 什么是面向对象？

> 面向[对象](https://baike.baidu.com/item/对象)(Object Oriented,OO)是[软件开发方法](https://baike.baidu.com/item/软件开发方法/971447)。面向[对象](https://baike.baidu.com/item/对象)的概念和应用已超越了[程序设计](https://baike.baidu.com/item/程序设计/223952)和软件开发，扩展到如[数据库系统](https://baike.baidu.com/item/数据库系统/215176)、交互式界面、应用结构、应用平台、[分布式系统](https://baike.baidu.com/item/分布式系统/4905336)、[网络管理](https://baike.baidu.com/item/网络管理/5903609)结构、CAD技术、[人工智能](https://baike.baidu.com/item/人工智能/9180)等领域。面向对象是一种对现实世界理解和抽象的方法，是计算机编程技术发展到一定阶段后的产物。

下面用一张图诠释什么是面向对象：

![如何理解面向对象](//wx1.sinaimg.cn/large/96e311f0gy1g5mldsz2yyj20en0dewg5.jpg)

## 三大特性：

1. 封装 encapsulation

   - 把现实中存在的事物，封装成抽象成类。类可以把属性field、方法function只让可信的类或者对象来操作，对不可信的进行隐藏。一个类就是封装encapsulation了一些数据这操作这些数据的代码的逻辑实体。在一个对象的内部，某些代码，或者某系数据是可以被私有的，也就是不能被外界访问。通过这种方式，对象对内部数据提供了不同级别的保护，以防止程序中无关的部分意外的改变或错误的使用了对象的私有部分。

   - **个人理解：**Java封装是先把现实生活中某个事物，比如汽车给抽象成一个Java类也就是Class文件。既然汽车有车轮、方向盘、能开起来，那么抽象后的Java类应该用属性（字段Field）、方法function来描述这个事物。例车有四个轮子，有一个方向盘，这些都可以抽象成字段。那么方法是什么？可以把汽车运行抽象成一个Run()方法。既然是封装，那么肯定还要提到权限等级，因为我这些车轮、方向盘的属性，以及汽车Run()的调用，不是任何一个人，某个对象就能调用的。只有取得了驾照的人才能开车，只有具有修理资质的人才能为我修车，所以我就需要使用上权限修饰符，如下表格所示。这些种种的规则，其实都是为了将显示中的物体描述成代码，让程序员更好的写出逻辑代码，毕竟即使面向再通俗易懂，最终还是需要翻译成二进制共给CPU进行处理，所以面向对象也好，面向过程也好它其实是为了服务于程序员，仅此而已。所以如果你真的够厉害，你的键盘只需要0/1两个键来编程也不是不可以。

   | 访问权限 |  类  |  包  | 子类 | 其他包 |
   | :------: | :--: | :--: | :--: | :----: |
   |  public  |  √   |  √   |  √   |   √    |
   | protect  |  √   |  √   |  √   |   ×    |
   | default  |  √   |  √   |  ×   |   ×    |
   | private  |  √   |  ×   |  ×   |   ×    |

   具体详细信息请参见：[java中4种修饰符访问权限的区别及详解全过程](https://www.cnblogs.com/Annoying/p/5403912.html)

2. 继承 extends

   - 继承是让某个类型的对象获得另一个类型对象的属性、方法。支持按级分类的概念。继承是指这样的一种能力：他可以使用现有类的所有功能，并在无需重新编写原来类的情况下对这些功能进行拓展。通过继承创建的新类称之为“子类”或者“派生类”，被继承的类称之为“父类”、“基类”、“超类”。继承的使用方式一共有两种：实现继承、接口继承。实现继承就是继承父类的属性、方法，不需要额外的代码进行编写就能直接使用。接口继承是指仅使用属性、方法的名称，但是子类必须要实现方法。
   - **个人理解：**实现继承就是拥有父类的所有的属性、方法，拿来直接用，不再需要进行额外的编码。例如儿子继承了父亲的财产，父亲的财产儿子拿来就可以使用，不需要为了这些财产去做一些劳动。接口继承，接口继承更新是定一个规矩，让子类把这个规矩完善并实现出来。例如家有家法，族有族规，但是族规只说不能伤天害理，但是没有规定哪些事情是伤天害理的。所以子孙们需要继承族规并实现出来，例如根据当今社会对族规进行完善，不能让族违反国家法律。简单说接口继承制告诉你现在有**哪些属性**，有**哪些方法**。而这些属性类型，方法的参数类型、个数，以及返回类型都是固定的。至于你方法体内的代码怎么做我不管你，你只需要按照我的这个格式返回结果就行。

3. 多态

   - 多态性是面向对象编程的又一个重要特征，它是指在父类中定义的属性和方法被子类继承之后，可以具有不同的数据类型或表现出不同的行为，这使得同一个属性或方法在父类及其各个子类中具有不同的含义。

     对面向对象来说，多态分为编译时多态和运行时多态。其中编译时多态是静态的，主要是指方法的重载，它是根据参数列表的不同来区分不同的方法。通过编译之后会变成两个不同的方法，在运行时谈不上多态。而运行时多态是动态的，它是通过动态绑定来实现的，也就是大家通常所说的多态性。

     Java 实现多态有 **3 个必要条件**：继承、重写和向上转型。只有满足这 3 个条件，开发人员才能够在同一个继承结构中使用统一的逻辑实现代码处理不同的对象，从而执行不同的行为。

   - 多态存在的三个必要条件

     1. 要有继承：在多态中必须存在有继承关系的子类和父类。
     2. 要有重写：子类对父类中某些方法进行重新定义，在调用这些方法时就会调用子类的方法。
     3. 父类引用指向子类对象：在多态中需要将子类的引用赋给父类对象，只有这样该引用才既能可以调用父类的方法，又能调用子类的方法。

     > 参考：[Java多态性：Java什么是多态？](http://c.biancheng.net/view/1001.html)

## 五大原则：

### 1. 单一职责原则SRP(Single Responsibility Principle)

指一个类要功能单一，不要包罗万象。如同一个人，分配的工作不能太多，否则一天到晚虽然忙忙碌碌，但是效率却高不起来。

> 职员类例子： 比如在职员类里，将工程师、销售人员、销售经理这些情况都放在职员类里考虑，其结果将会非常混乱，在这个假设下，职员类里的每个方法都要ifelse判断是哪种情况，从类结构上来说将会十分臃肿，并且上述三种的职员类型，不论哪一种发生需求变化，都会改变职员类！这个是大家所不愿意看到的！

### 2.开放封闭原则OCP(Open－Close Principle) 

一个模块在拓展性方面应该是公开的，而在可更改性方面应该是封闭的。比如：一个网络模块，原来是服务端功能，而现在要加入客户端功能，那么应当在不用修改服务端代码的前提下，能够增加客户端功能的实现代码，这就要求在设计之初，就应当将客户端和服务端的功能分开，把公共部分的抽象出来。

> 变化来临时，如果不必改动软件实体裁的源代码，就能扩充它的行为，那么这个软件实体设计就是满足开放封闭原则的。如果说我们预测到某种变化，或者某种变化发生了，我们应当创建抽象类来隔离以后发生的同类变化。

### 3.里氏替换原则(the Liskov Substitution Principle LSP) 

子类应当能够替换父类，并且出现在父类能够出现的任何地方。比如公司举办年度晚会，所有员工都可以参加抽奖，那么不管是老员工还是新员工，也不管是总部员工还是外派员工，都应该可以参加抽奖，否则这家公司内部就会不和谐。

> 在这个原则中父类应尽可能使用接口或者抽象类来实现！
>
> 子类通过实现了父类接口，能够替父类的使用地方！
>
> 通过这个原则，我们客户端在使用父类接口的时候，通过子类实现！
>
> 意思就是说我们依赖父类接口，在客户端声明一个父类接口，通过其子类来实现
>
> 这个时候就要求子类必须能够替换父类所出现的任何地方，这样做的好处就是，在根据新要求扩展父类接口的新子类的时候而不影响当前客户端的使用！

### 4.依赖倒置原则(the Dependency Inversion Principle DIP) 

传统的结构化编程中，最上层的模块通常都要依赖下面的子模块来实现，也称为高层依赖低层！所以DIP原则就是要逆转这种依赖关系，让高层模块不要依赖低层模块，所以称之为依赖倒置原则！

> 假设B模块比A模块级别低，但是B需要使用A的功能，这个时候B不应当使用A中的具体类；而是应当有B定义一个抽象接口，并由A来实现这个抽象接口，B只使用这个抽象接口，这样就达到了依赖倒置的目的，B也解除了对A的依赖，反过来是A依赖于B的定义的抽象接口。通过上层模块难以避免依赖下层模块，假如B也依赖于A的实现，那么就可能造成了循环依赖。一个常见的问题就是编译A模块是需要包含B模块的class文件，而编译B时需要包含A模块的class文件。

**建议必读：**[轻松学，浅析依赖倒置（DIP）、控制反转(IOC)和依赖注入(DI)](https://blog.csdn.net/briblue/article/details/75093382)

### 5.接口分离原则(the Interface Segregation Principle ISP) 

使用多个专门的接口比使用单个接口要好的多！模块间要通过抽象接口来隔离开，而不是通过具体的类强耦合起来。

> 在我实际编程中，为了减少接口的定义，将许多类似的方法都放在一个接口中，最后发现，维护和实现接口的时候花了太多精力，而接口所定义的操作相当于对客户端的一种承诺，这种承诺当然是越少越好，越精练越好，过多的承诺带来的就是你的大量精力和时间去维护！

# 3.string,string buffer,string builder它们各自的区别，为什么要使用？

### [请见：String和StringBuffer以及StringBuilder，哪个效率高？为什么？](https://blog.gobyte.cn/post/4a74da6f.html#2-String和StringBuffer以及StringBuilder，哪个效率高？为什么？)

# 4.Java多线程的start和run方法的区别？

- **Start()：**它是用来启动一个新的线程。通过start()启动的线程，出于就绪（可运行）的状态，但是并没有运行，一旦得到了CPU的时间片，就开始执行相应线程的run()方法，这里方法run()称之为线程体，它包含了这个要执行的线程的内容。run()执行结束，此线程随机终止。start()不能被重复的调用。用start()来启动线程，真正实现了多线程运行，**即无需等待某个run()方法执行完毕就执行下面的代码**，即进行了线程的切换。

- **run()：**和普通成员方法一样，可以被重复的调用。**如果直接调用run()方法并不会启动新的线程！！！**程序中依然只有主线程这一个线程，其程序执行路径还是只有这一条，还是要顺序执行，还是要等待run()方法体执行完毕才可执行下面代码，这样并没有达到多线程的目的。

  **示例代码：**
  
  ```Java
  /**
   * TODO: 多线程测试start和run方法
   *
   * @author shanLan http://blog.gobyte.cn
   * @date 2019/8/5 23:21
   */
  public class threadTest {
      public static void main(String[] args) {
          Runner1 r = new Runner1();
          //这是方法调用，而不是开启一个线程
          r.run();
          //调用了Thread(Runnable target)方法。且父类对象变量指向子类对象。
          Thread t = new Thread(r);
          t.start();
          // 在主线程里进行循环执行
          for (int i = 0; i < 100; i++) {
              System.out.println("进入Main Thread运行状态" + i);
          }
      }
  }
  
  /**
   * TODO: 实现了这个接口，jdk就知道这个类是一个线程
   *
   * @author shanLan http://blog.gobyte.cn
   * @date 2019/8/5 23:29
   */
  class Runner1 implements Runnable {
      public void run() {
          for (int i = 0; i < 100; i++) {
              System.out.println("进入Runner1运行状态" + i);
          }
      }
  }
  ```
  
  **打印结果：**
  
  <details><summary>点击查看完整打印结果</summary>
  ```
    进入Runner1运行状态0
    进入Runner1运行状态1
    进入Runner1运行状态2
    进入Runner1运行状态3
    进入Runner1运行状态4
    进入Runner1运行状态5
    进入Runner1运行状态6
    进入Runner1运行状态7
    进入Runner1运行状态8
    进入Runner1运行状态9
    进入Runner1运行状态10
    进入Runner1运行状态11
    进入Runner1运行状态12
    进入Runner1运行状态13
    进入Runner1运行状态14
    进入Runner1运行状态15
    进入Runner1运行状态16
    进入Runner1运行状态17
    进入Runner1运行状态18
    进入Runner1运行状态19
    进入Runner1运行状态20
    进入Runner1运行状态21
    进入Runner1运行状态22
    进入Runner1运行状态23
    进入Runner1运行状态24
    进入Runner1运行状态25
    进入Runner1运行状态26
    进入Runner1运行状态27
    进入Runner1运行状态28
    进入Runner1运行状态29
    进入Runner1运行状态30
    进入Runner1运行状态31
    进入Runner1运行状态32
    进入Runner1运行状态33
    进入Runner1运行状态34
    进入Runner1运行状态35
    进入Runner1运行状态36
    进入Runner1运行状态37
    进入Runner1运行状态38
    进入Runner1运行状态39
    进入Runner1运行状态40
    进入Runner1运行状态41
    进入Runner1运行状态42
    进入Runner1运行状态43
    进入Runner1运行状态44
    进入Runner1运行状态45
    进入Runner1运行状态46
    进入Runner1运行状态47
    进入Runner1运行状态48
    进入Runner1运行状态49
    进入Runner1运行状态50
    进入Runner1运行状态51
    进入Runner1运行状态52
    进入Runner1运行状态53
    进入Runner1运行状态54
    进入Runner1运行状态55
    进入Runner1运行状态56
    进入Runner1运行状态57
    进入Runner1运行状态58
    进入Runner1运行状态59
    进入Runner1运行状态60
    进入Runner1运行状态61
    进入Runner1运行状态62
    进入Runner1运行状态63
    进入Runner1运行状态64
    进入Runner1运行状态65
    进入Runner1运行状态66
    进入Runner1运行状态67
    进入Runner1运行状态68
    进入Runner1运行状态69
    进入Runner1运行状态70
    进入Runner1运行状态71
    进入Runner1运行状态72
    进入Runner1运行状态73
    进入Runner1运行状态74
    进入Runner1运行状态75
    进入Runner1运行状态76
    进入Runner1运行状态77
    进入Runner1运行状态78
    进入Runner1运行状态79
    进入Runner1运行状态80
    进入Runner1运行状态81
    进入Runner1运行状态82
    进入Runner1运行状态83
    进入Runner1运行状态84
    进入Runner1运行状态85
    进入Runner1运行状态86
    进入Runner1运行状态87
    进入Runner1运行状态88
    进入Runner1运行状态89
    进入Runner1运行状态90
    进入Runner1运行状态91
    进入Runner1运行状态92
    进入Runner1运行状态93
    进入Runner1运行状态94
    进入Runner1运行状态95
    进入Runner1运行状态96
    进入Runner1运行状态97
    进入Runner1运行状态98
    进入Runner1运行状态99
    进入Main Thread运行状态0
    进入Main Thread运行状态1
    进入Main Thread运行状态2
    进入Main Thread运行状态3
    进入Main Thread运行状态4
    进入Main Thread运行状态5
    进入Main Thread运行状态6
    进入Main Thread运行状态7
    进入Main Thread运行状态8
    进入Main Thread运行状态9
    进入Runner1运行状态0
    进入Runner1运行状态1
    进入Main Thread运行状态10
    进入Runner1运行状态2
    进入Runner1运行状态3
    进入Runner1运行状态4
    进入Runner1运行状态5
    进入Runner1运行状态6
    进入Runner1运行状态7
    进入Main Thread运行状态11
    进入Main Thread运行状态12
    进入Runner1运行状态8
    进入Main Thread运行状态13
    进入Runner1运行状态9
    进入Main Thread运行状态14
    进入Runner1运行状态10
    进入Main Thread运行状态15
    进入Runner1运行状态11
    进入Main Thread运行状态16
    进入Runner1运行状态12
    进入Main Thread运行状态17
    进入Runner1运行状态13
    进入Main Thread运行状态18
    进入Runner1运行状态14
    进入Runner1运行状态15
    进入Runner1运行状态16
    进入Runner1运行状态17
    进入Runner1运行状态18
    进入Runner1运行状态19
    进入Runner1运行状态20
    进入Runner1运行状态21
    进入Runner1运行状态22
    进入Main Thread运行状态19
    进入Runner1运行状态23
    进入Main Thread运行状态20
    进入Runner1运行状态24
    进入Main Thread运行状态21
    进入Runner1运行状态25
    进入Main Thread运行状态22
    进入Runner1运行状态26
    进入Main Thread运行状态23
    进入Runner1运行状态27
    进入Main Thread运行状态24
    进入Runner1运行状态28
    进入Main Thread运行状态25
    进入Runner1运行状态29
    进入Main Thread运行状态26
    进入Runner1运行状态30
    进入Main Thread运行状态27
    进入Runner1运行状态31
    进入Main Thread运行状态28
    进入Runner1运行状态32
    进入Main Thread运行状态29
    进入Runner1运行状态33
    进入Main Thread运行状态30
    进入Runner1运行状态34
    进入Main Thread运行状态31
    进入Runner1运行状态35
    进入Main Thread运行状态32
    进入Runner1运行状态36
    进入Main Thread运行状态33
    进入Runner1运行状态37
    进入Main Thread运行状态34
    进入Runner1运行状态38
    进入Main Thread运行状态35
    进入Runner1运行状态39
    进入Main Thread运行状态36
    进入Runner1运行状态40
    进入Main Thread运行状态37
    进入Runner1运行状态41
    进入Main Thread运行状态38
    进入Runner1运行状态42
    进入Main Thread运行状态39
    进入Runner1运行状态43
    进入Main Thread运行状态40
    进入Main Thread运行状态41
    进入Main Thread运行状态42
    进入Main Thread运行状态43
    进入Main Thread运行状态44
    进入Main Thread运行状态45
    进入Main Thread运行状态46
    进入Main Thread运行状态47
    进入Main Thread运行状态48
    进入Main Thread运行状态49
    进入Main Thread运行状态50
    进入Main Thread运行状态51
    进入Main Thread运行状态52
    进入Runner1运行状态44
    进入Main Thread运行状态53
    进入Main Thread运行状态54
    进入Main Thread运行状态55
    进入Main Thread运行状态56
    进入Main Thread运行状态57
    进入Main Thread运行状态58
    进入Main Thread运行状态59
    进入Main Thread运行状态60
    进入Runner1运行状态45
    进入Main Thread运行状态61
    进入Main Thread运行状态62
    进入Main Thread运行状态63
    进入Main Thread运行状态64
    进入Main Thread运行状态65
    进入Main Thread运行状态66
    进入Main Thread运行状态67
    进入Main Thread运行状态68
    进入Runner1运行状态46
    进入Main Thread运行状态69
    进入Main Thread运行状态70
    进入Main Thread运行状态71
    进入Main Thread运行状态72
    进入Main Thread运行状态73
    进入Main Thread运行状态74
    进入Main Thread运行状态75
    进入Main Thread运行状态76
    进入Runner1运行状态47
    进入Main Thread运行状态77
    进入Main Thread运行状态78
    进入Main Thread运行状态79
    进入Runner1运行状态48
    进入Runner1运行状态49
    进入Runner1运行状态50
    进入Runner1运行状态51
    进入Runner1运行状态52
    进入Runner1运行状态53
    进入Runner1运行状态54
    进入Runner1运行状态55
    进入Runner1运行状态56
    进入Runner1运行状态57
    进入Runner1运行状态58
    进入Runner1运行状态59
    进入Runner1运行状态60
    进入Main Thread运行状态80
    进入Main Thread运行状态81
    进入Runner1运行状态61
    进入Runner1运行状态62
    进入Runner1运行状态63
    进入Runner1运行状态64
    进入Runner1运行状态65
    进入Main Thread运行状态82
    进入Runner1运行状态66
    进入Main Thread运行状态83
    进入Runner1运行状态67
    进入Runner1运行状态68
    进入Runner1运行状态69
    进入Runner1运行状态70
    进入Runner1运行状态71
    进入Runner1运行状态72
    进入Runner1运行状态73
    进入Runner1运行状态74
    进入Runner1运行状态75
    进入Main Thread运行状态84
    进入Main Thread运行状态85
    进入Main Thread运行状态86
    进入Main Thread运行状态87
    进入Main Thread运行状态88
    进入Main Thread运行状态89
    进入Main Thread运行状态90
    进入Main Thread运行状态91
    进入Runner1运行状态76
    进入Runner1运行状态77
    进入Runner1运行状态78
    进入Runner1运行状态79
    进入Runner1运行状态80
    进入Runner1运行状态81
    进入Runner1运行状态82
    进入Runner1运行状态83
    进入Runner1运行状态84
    进入Runner1运行状态85
    进入Runner1运行状态86
    进入Runner1运行状态87
    进入Runner1运行状态88
    进入Runner1运行状态89
    进入Runner1运行状态90
    进入Runner1运行状态91
    进入Runner1运行状态92
    进入Runner1运行状态93
    进入Runner1运行状态94
    进入Runner1运行状态95
    进入Runner1运行状态96
    进入Runner1运行状态97
    进入Runner1运行状态98
    进入Runner1运行状态99
    进入Main Thread运行状态92
    进入Main Thread运行状态93
    进入Main Thread运行状态94
    进入Main Thread运行状态95
    进入Main Thread运行状态96
    进入Main Thread运行状态97
    进入Main Thread运行状态98
    进入Main Thread运行状态99
  ```
  </details>

  **根据打印结果我们知道，run方法没有执行完毕是不会执行下面的代码的。而start方法则会和主线程进行交替执行，并不需要等start代码执行完毕。**

  ## **总结：**
  
  1. start()方法可以启动新的线程，而run()方法thread类的一个普通方法调用，还是在主线程里执行
  2. start()能启动一个新的线程，run()不行
  3. start()不能被重复调用；run()可以
  4. star()中的run代码块可以不执行完就可以执行下面的代码，即使进行了线程的切换。直接调用run()方法必须等待其代码全部执行完才能继续执行下面的代码
  5. start()实现了多线程；run()没有实现多线程

# 5.springMVC的执行流程？

待完善