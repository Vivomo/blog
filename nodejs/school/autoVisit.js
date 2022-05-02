let iframe = document.createElement('iframe');
document.body.appendChild(iframe);

let links = $$('.aalink').map(item => item.href).filter(Boolean);
let count = links.length;
const visit = () => {
  if (links.length) {
    iframe.src = links.pop();
    console.log(`${count - links.length}/${count}`)
    setTimeout(visit, 15000)
  } else {
    alert('finish')
  }
}

visit();