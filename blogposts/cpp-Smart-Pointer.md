---
title: '智能指针'
date: '2023-08-07'
---
# 智能指针

## 独占指针: unique_ptr

### 介绍

在任何给定时刻，只能有一个指针管理内存

该类型指针不能copy，只能Move

使用 `unique_ptr` 可以避免内存泄漏和手动释放资源的问题，它会在不再需要时自动释放所管理的对象。当 `unique_ptr` 被销毁时，它会自动调用 `delete` 来释放对象的内存。



### unique_ptr有三种常用的创建方式

1. 使用 `new` 关键字创建：可以使用 `new` 关键字直接创建一个对象，并将其传递给 `unique_ptr` 的构造函数。
2. 使用 `std::make_unique` 函数创建：C++14 引入了 `std::make_unique` 函数，可以更方便地创建 `unique_ptr` 对象。
3. 使用 `reset` 函数创建：可以先创建一个空的 `unique_ptr`，然后使用 `reset` 函数重新指定对象。

>  这些创建方式都可以用来创建 `unique_ptr` 对象，并将其管理的资源初始化为指定的值。需要注意的是，在使用 `new` 创建对象时，需要手动释放资源，而使用 `make_unique` 函数或 `reset` 函数创建的 `unique_ptr` 在作用域结束时会自动释放资源。



#### 3种创建方式

```cpp
#include "cat.h"
#include <iostream>
#include <memory>
using namespace std;
int main(int argc,char* argv[]){
    std::unique_ptr<Cat> u_c_p2{new Cat("yz")};
    u_c_p2->cat_info();
    return 0;
}
```

这样会自动释放内存，防止内存泄漏和悬空指针问题

```cpp
#include "cat.h"
#include <iostream>
#include <memory>
using namespace std;
int main(int argc,char* argv[]){
    std::unique_ptr<Cat> u_c_p2 = make_unique<Cat>();
    u_c_p2->cat_info();
    u_c_p2->set_cat_name("meow");
    u_c_p2->cat_info();
    return 0;
}
```

```cpp
#include "cat.h"
#include <iostream>
#include <memory>
using namespace std;
int main(int argc,char* argv[]){
    std::unique_ptr<Cat> u_c_p2;
    u_c_p2.reset(new Cat("yz"));
    u_c_p2->cat_info();
    return 0;
}
```



### 不安全的raw pointer

cat.h

```cpp
#ifndef CAT_H
#define CAT_H
#include <string>
#include <iostream>
class Cat
{
public:
    Cat(std::string name);
    Cat() = default;
    ~Cat();

    void cat_info() const{
        std::cout << "cat info name:" << name << std::endl;

    }
    std::string get_name() const {
        return name;
    }
    void set_cat_name(const std::string& name){
        this->name = name;
    }
private:
    std::string name{"Mini"};
};
#endif
```

cat.cpp

```cpp
#include "cat.h"
Cat::Cat(std::string _name) : name(_name)
{
    std::cout << "Constructor of Cat:" << name << std::endl;
}
Cat::~Cat() {
    std::cout << "Destructor of Cat " << name << std::endl;
}
```

main.cpp

```cpp
#include "cat.h"
#include <iostream>
#include <memory>
using namespace std;
int main(int argc,char* argv[]){
    Cat *cat = new Cat("yy");
    cat->cat_info();
    delete cat; //raw pointer必须使用Delete进行删除，如果没有delete，是不安全的
    return 0;
}
```

makefile

```makefile
# 编译器
CXX := g++
# 编译选项
CXXFLAGS := -std=c++11 -Wall

# 目标文件列表
OBJS := output/cat.o output/main.o

# 默认目标
all: create_dir program

# 生成可执行文件
program: $(OBJS)
	$(CXX) $(CXXFLAGS) $^ -o $@

# 编译源文件
output/%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

# 创建 output 目录
create_dir:
	mkdir -p output

# 清理生成的目标文件和可执行文件
clean:
	rm -rf output program

```



### 获取unique_ptr指向的对象的地址

要获取 `unique_ptr` 指向的对象的地址，可以使用 `get()` 成员函数。`get()` 返回一个指向被 `unique_ptr` 管理的对象的原始指针。



要调用 `unique_ptr` 管理的对象的成员函数，可以使用箭头操作符 `->`。箭头操作符用于访问指针所指向对象的成员。

```cpp
#include "cat.h"
#include <iostream>
#include <memory>
using namespace std;
int main(int argc,char* argv[]){
    std::unique_ptr<Cat> u_c_p2{new Cat("meow")};
    std::cout << u_c_p2.get() << std::endl;
    return 0;
}
```



![image-20230719155936898](https://static.meowrain.cn/i/2023/07/19/psevuh-3.webp)





### unique_ptr与函数调用

![image-20230719161457439](https://static.meowrain.cn/i/2023/07/19/qpa4g1-3.webp)



```cpp
#include "cat.h"
#include <iostream>
#include <memory>
void do_with_cat_pass_value(std::unique_ptr<Cat> c) {
    c->cat_info();
}
void do_with_cat_pass_reference(const std::unique_ptr<Cat> &c) {
    c->cat_info();
}
#include <memory>
int main(int argc,char* argv[]){
    //pass value
    std::unique_ptr<Cat> c1 = std::make_unique<Cat>("mimi");
    do_with_cat_pass_value(std::move(c1));
    do_with_cat_pass_value(std::make_unique<Cat>("meowmeow"));
    std::unique_ptr<Cat> c2 = std::make_unique<Cat>("jk");
    do_with_cat_pass_reference(c2);
    c2->cat_info();
    c2.reset();
    std::cout << "c2 address: " << c2.get() << std::endl;
    return 0;

    
    /*
    Constructor of Cat:mimi
    cat info name:mimi
    Destructor of Cat mimi
    Constructor of Cat:meowmeow
    cat info name:meowmeow
    Destructor of Cat meowmeow
    Constructor of Cat:jk
    cat info name:jk
    cat info name:jk
    Destructor of Cat jk
    c2 address: 0
    
    */
}
```

对象所有权是指对一个对象的控制权和责任。在 C++ 中，通过使用智能指针（如 `std::unique_ptr` 和 `std::shared_ptr`）来管理动态分配的对象，可以实现对象所有权的转移和共享。

在 C++ 中，通过动态内存分配（使用 `new` 运算符）创建的对象由创建者拥有所有权。这意味着创建者有责任在适当的时候释放该对象所占用的内存，以避免内存泄漏。

然而，当对象的所有权需要转移到另一个对象时，可以使用移动语义来实现。移动语义允许将资源（如内存）从一个对象转移到另一个对象，而无需进行深拷贝或复制。通过移动语义，可以避免不必要的数据复制和资源管理开销，并提高程序性能。

`std::unique_ptr` 和 `std::shared_ptr` 是智能指针，它们通过使用所有权概念来管理对象的生命周期。`std::unique_ptr` 表示独占所有权，即一个对象只能由一个 `std::unique_ptr` 持有，当 `std::unique_ptr` 被销毁时，它会自动释放所管理的对象。`std::shared_ptr` 表示共享所有权，即多个 `std::shared_ptr` 可以同时持有一个对象，并在最后一个 `std::shared_ptr` 被销毁时释放对象。

通过正确管理对象的所有权，可以确保对象的生命周期正确且高效地管理，避免资源泄漏和悬空指针等问题。



std::move` 是一个函数模板，位于 `<utility>` 头文件中，用于将对象转移到另一个对象。在你的代码中，你使用 `std::move(c1)` 来将 `c1` 的所有权转移到 `do_with_cat_pass_value` 函数中的 `c`。但是，在 `main` 函数中，你又尝试访问 `c1`，这是不正确的，因为它在转移所有权后不再拥有 `Cat` 对象。





## 计数指针(共享指针) shared_ptr

`std::shared_ptr` 是 C++ 中的智能指针，用于管理动态分配的对象。它提供了自动的内存管理和资源释放，可以帮助避免内存泄漏和悬挂指针的问题。`std::shared_ptr` 使用引用计数的方式来跟踪指针的所有权，当引用计数为零时，它会自动释放所管理的对象。

```cpp
#include <iostream>
#include <memory>

struct MyObject {
    int value;

    MyObject(int val) : value(val) {
        std::cout << "Constructing MyObject with value: " << value << std::endl;
    }

    ~MyObject() {
        std::cout << "Destructing MyObject with value: " << value << std::endl;
    }
};

int main() {
    std::shared_ptr<MyObject> ptr = std::make_shared<MyObject>(42);
    std::cout << "Accessing MyObject value: " << ptr->value << std::endl;
    // 输出: Constructing MyObject with value: 42
    // 输出: Accessing MyObject value: 42

    {
        std::shared_ptr<MyObject> ptr2 = ptr;
        std::cout << "Accessing MyObject value through ptr2: " << ptr2->value << std::endl;
        // 输出: Accessing MyObject value through ptr2: 42
    }

    std::cout << "MyObject value: " << ptr->value << std::endl;
    // 输出: MyObject value: 42

    // ptr2 超出作用域，但不会触发析构函数调用

    ptr.reset();  // 手动重置 shared_ptr，释放对象
    std::cout << "After reset()" << std::endl;
    // 输出: Destructing MyObject with value: 42
    // 输出: After reset()

    return 0;
}

```

在这个例子中，我们创建了一个 `MyObject` 类，它具有一个整数成员变量 `value`。在 `main` 函数中，我们使用 `std::make_shared` 创建了一个 `shared_ptr`，指向一个 `MyObject` 对象，并将值设置为 42。然后，我们通过 `ptr` 访问对象的值，并输出结果。

接下来，我们创建了另一个 `shared_ptr`，命名为 `ptr2`，并将其指向 `ptr` 所指向的对象。我们通过 `ptr2` 访问对象的值，并输出结果。

在 `ptr2` 超出作用域后，引用计数减少，但不会触发析构函数的调用，因为 `ptr` 仍然指向对象。

最后，我们通过调用 `ptr.reset()` 手动重置了 `ptr`，释放了对象。此时，引用计数变为零，触发了对象的析构函数的调用。

输出结果显示了对象的构造和析构过程，以及访问对象值的过程。

这个例子展示了 `shared_ptr` 的自动资源管理功能。它确保对象在不再被引用时被释放，避免了内存泄漏，并在对象被释放时自动调用析构函数。



## weak_ptr 弱引用智能指针

C++ 提供了 weak_ptr，它是一种弱引用智能指针。weak_ptr 允许我们获取对 shared_ptr 管理的对象的临时访问权，但不会增加引用计数，也不负责对象的生命周期管理。

下面是 `weak_ptr` 的一些重要特点和用法：

1. 创建 `weak_ptr`：可以通过将 `shared_ptr` 赋值给 `weak_ptr` 来创建它。例如：

   ```cpp
   std::shared_ptr<int> sharedPtr = std::make_shared<int>(42);
   std::weak_ptr<int> weakPtr = sharedPtr;
   ```

2. 使用 `lock()` 获取 `shared_ptr`：`weak_ptr` 提供了一个 `lock()` 成员函数，用于获取一个有效的 `shared_ptr`。如果原始的 `shared_ptr` 仍然存在，`lock()` 将返回一个指向相同对象的有效 `shared_ptr`；否则，它将返回一个空的 `shared_ptr`。例如：

   ```cpp
   std::shared_ptr<int> sharedPtr = std::make_shared<int>(42);
   std::weak_ptr<int> weakPtr = sharedPtr;
   
   std::shared_ptr<int> lockedPtr = weakPtr.lock();
   if (lockedPtr) {
       // 使用 lockedPtr 访问对象
   } else {
       // weakPtr 对应的 shared_ptr 已经失效
   }
   ```

   通过使用 `lock()`，我们可以确保只在 `shared_ptr` 仍然有效时访问对象，避免访问已经被释放的对象。

3. 检查 `expired()`：`weak_ptr` 还提供了 `expired()` 成员函数，用于检查原始的 `shared_ptr` 是否已经失效。如果 `shared_ptr` 仍然有效，`expired()` 返回 `false`；否则，返回 `true`。例如：

   ```cpp
   std::shared_ptr<int> sharedPtr = std::make_shared<int>(42);
   std::weak_ptr<int> weakPtr = sharedPtr;
   
   if (!weakPtr.expired()) {
       // sharedPtr 仍然有效
   } else {
       // sharedPtr 已经失效
   }
   ```

   通过使用 `expired()`，我们可以在不访问对象的情况下检查 `shared_ptr` 是否有效。

使用 `weak_ptr` 可以避免循环引用导致的内存泄漏问题，并且可以安全地访问 `shared_ptr` 管理的对象。但需要注意的是，由于 `weak_ptr` 不会增加引用计数，所以在使用 `weak_ptr` 指向对象时，需要先通过 `lock()` 获取有效的 `shared_ptr`，以确保对象仍然存在。