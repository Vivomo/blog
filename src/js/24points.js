const utils = {
  optSymbols: ['+', '-', '*', '/'],
  swap: (arr, from, to) => {
    let tmp = arr[from];
    arr[from] = arr[to];
    arr[to] = tmp;
  },
  reverse: (arr, start, end) => {
    while (start < end) {
      utils.swap(arr, start, end);
      start++;
      end--;
    }
  },
  nextPermutation: (argArr) => {
    let arr = [...argArr];
    let len = arr.length;
    let i = len - 2;
    let j = len - 1;

    while (i >= 0 && arr[i] >= arr[i + 1]) i--;

    if (i >= 0) {
      while (j > i && arr[j] <= arr[i]) j--;
      utils.swap(arr, i, j);
      utils.reverse(arr, i + 1, len - 1);
    } else {
      utils.reverse(arr, 0, len - 1);
    }
    return arr;
  },
  calcNumber: (num1, num2, opt) => {
    switch (opt) {
      case 0:
        return num1 + num2;
      case 1:
        return num1 - num2;
      case 2:
        return num1 * num2;
      case 3:
        return num1 / num2;
    }
  },
  calc24Result: (arr) => {
    let resultList = [];
    for (let opts = 0; opts <= 63; opts++) {
      let result = arr.slice(1).reduce((pre, cur, index) => {
        return utils.calcNumber(pre, cur, (opts >> index * 2) & 3);
      }, arr[0]);
      if (result === 24) {
        console.log(arr, opts);
        resultList.push([arr, opts])
      }
    }
    return resultList;
  },
  formatResult: ([arr, opts]) => {
    let opt1 = opts & 3;
    let opt2 = opts >> 2 & 3;
    let opt3 = opts >> 4 & 3;
    let brackets1 = (opt1 > 1 || opt2 < 2) ? ['', ''] : ['(', ')'];
    let brackets2 = (opt2 > 1 || opt3 < 2) ? ['', ''] : ['(', ')'];
    return `${brackets2[0]}${brackets1[0]}${arr[0]}${utils.optSymbols[opt1]}${arr[1]}${brackets1[1]}${utils.optSymbols[opt2]}${arr[2]}${brackets2[1]}${utils.optSymbols[opt3]}${arr[3]}`;
  }
}



let inputs = [...document.querySelectorAll('#numberWrap input')];
let form = document.querySelector('#form');
let resultElem = document.querySelector('#result');

form.addEventListener('submit', (e) => {
  let numbers = inputs.map(item => Number(item.value));
  let resultList = utils.calc24Result(numbers);
  for (let i = 0; i < 23; i++) {
    numbers = utils.nextPermutation(numbers);
    resultList = resultList.concat(utils.calc24Result(numbers));
  }
  if (resultList.length === 0) {
    resultElem.value = '无解';
  } else {
    const resultTxt = resultList.map((result) => utils.formatResult(result));
    resultElem.innerHTML = Array.from(new Set(resultTxt)).join('\n');
    // resultElem.value = resultTxt.join('\n');
  }
  e.preventDefault();
  return false;
})
