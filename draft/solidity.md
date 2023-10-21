
## 函数

### 函数修饰符 view vs pure
```
contract User {

    // 状态变量
    uint public user_age = 12;
    
    // view修饰的条件(只读取状态,但不修改状态)
    // 本地运行,不消耗gas
    function get_age() public view returns(uint){
        return user_age;
    }
    
    // pure修饰的条件(不读取且不修改任何状态)
    // 本地运行,不消耗gas
    function get_pure() public pure returns(string memory){
        return "hello";
    }
}
```