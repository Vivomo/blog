/**
 Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

 push(x) -- Push element x onto stack.
 pop() -- Removes the element on top of the stack.
 top() -- Get the top element.
 getMin() -- Retrieve the minimum element in the stack.


 Example:

 MinStack minStack = new MinStack();
 minStack.push(-2);
 minStack.push(0);
 minStack.push(-3);
 minStack.getMin();   --> Returns -3.
 minStack.pop();
 minStack.top();      --> Returns 0.
 minStack.getMin();   --> Returns -2.
 */
/**
 * initialize your data structure here.
 */
let MinStack = function() {
    this.topElem = null;
    this.min = null;
};

/**
 * @param {number} x
 * @return {void}
 */
MinStack.prototype.push = function(x) {
    let elem = this.topElem = {
        value: x,
        next: this.topElem,
        lt: null,
        gt: null
    };
    if (this.min) {
        let temp = this.min;
        while (true) {
            if (x <= temp.value) {
                let {lt, gt} = temp;
                elem.lt = temp;
                elem.gt = temp.gt;
                if (gt) {
                    gt.lt = elem;
                }
                temp.gt = elem;
                if (elem.gt === null) {
                    this.min = elem;
                }
                break;
            }
            if (temp.lt === null) {
                temp.lt = elem;
                elem.gt = temp;
                break;
            }
            temp = temp.lt;
        }
    } else {
        this.min = elem;
    }
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function() {
    if (this.topElem !== null) {
        let {lt, gt} = this.topElem;
        if (lt) {
            lt.gt = gt;
        }
        if (gt) {
            gt.lt = lt;
        } else {
            this.min = lt;
        }
        this.topElem = this.topElem.next;
    }
};

/**
 * @return {number}
 */
MinStack.prototype.top = function() {
    return this.topElem === null ? null : this.topElem.value;
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function() {
    return this.min.value;
};

let minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
console.log(minStack.getMin());//   --> Returns -3.
minStack.pop();
console.log(minStack.top());   //   --> Returns 0.
console.log(minStack.getMin());//   --> Returns -2.
