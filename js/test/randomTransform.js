let style = document.createElement('style');
style.innerText = `*{transform:rotate(${180*Math.random()}deg)}`;
document.head.appendChild(style);
