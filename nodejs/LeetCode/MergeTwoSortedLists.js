/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
let mergeTwoLists = function(l1, l2) {
    let l = new ListNode();
    let lIndex = l,
        point1 = l1,
        point2 = l2;

    if (point1.val < point2.val) {
        lIndex.val = point1.val;
        point1 = point1.next;
    } else {
        lIndex.val = point2.val;
        point2 = point2.next;
    }

    while (point1 && point2) {
        if (point1.val < point2.val) {
            lIndex.next = new ListNode(point1.val);
            point1 = point1.next;
        } else {
            lIndex.next = new ListNode(point2.val);
            point2 = point2.next;
        }
        lIndex = lIndex.next;
    }

    let lastIndex = point1 || point2;
    while (lastIndex) {
        lIndex.next = new ListNode(lastIndex.val);
        lastIndex = lastIndex.next;
        lIndex = lIndex.next
    }
    return l;
};

function ListNode(val) {
     this.val = val;
     this.next = null;
}

ListNode.prototype.toString = function () {
    return `${this.val}${this.next ? ' => ' + this.next : ''}`
};

let arr1 = new Array(5).fill(null).map(() => ~~(Math.random() * 20)).sort((a, b) => a - b);
let arr2 = new Array(5).fill(null).map(() => ~~(Math.random() * 20)).sort((a, b) => a - b);


let l1 = new ListNode(arr1[0]);
let l2 = new ListNode(arr2[0]);

let temp1 = l1;
let temp2 = l2;

arr1.slice(1).forEach((item) => {
    temp1 = temp1.next = new ListNode(item);
});

arr2.slice(1).forEach((item) => {
    temp2 = temp2.next = new ListNode(item);
});

console.log(l1.toString());
console.log(l2.toString());
console.log(mergeTwoLists(l1, l2));

var mergeTwoListsToArray = function(l1, l2) {
    let result = [];
    while (l1 && l2) {
        if (l1.val < l2.val) {
            result.push(l1.val);
            l1 = l1.next;
        } else {
            result.push(l2.val);
            l2 = l2.next;
        }
    }

    let lastIndex = l1 || l2;
    while (lastIndex) {
        result.push(lastIndex.val);
        lastIndex = lastIndex.next;
    }
    return result;
};

console.log(mergeTwoListsToArray(l1, l2));