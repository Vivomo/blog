/**
 You are given two non-empty linked lists representing two non-negative integers.
 The digits are stored in reverse order and each of their nodes contain a single digit.
 Add the two numbers and return it as a linked list.
 You may assume the two numbers do not contain any leading zero, except the number 0 itself.

 Example

 Input: (2 -> 4 -> 3) + (5 -> 6 -> 4)
 Output: 7 -> 0 -> 8
 Explanation: 342 + 465 = 807.

 */

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
 * @return
 */
let addTwoNumbers = function(l1, l2) {
    let answer = [];
    let lt10 = true;
    while (l1 || l2){
        let v1, v2;
        if (l1) {
            v1 = l1.val;
            l1 = l1.next;
        } else {
            v1 = 0;
        }
        if (l2) {
            v2 = l2.val;
            l2 = l2.next;
        } else {
            v2 = 0;
        }
        let count = v1 + v2 + (lt10 ? 0 : 1);
        lt10 = count < 10;
        answer.push(count % 10);
    }
    if (!lt10) {
        answer.push(1)
    }
    return answer;
};