function solve() {
   trArray = Array.from(document.querySelector("body > table > tbody").children);
   trArray.map(tr => tr.addEventListener('click', function () {
      if (this.hasAttribute('style')) {
         this.removeAttribute('style');
      }
      else {
         trArray.map(tr => tr.removeAttribute('style'));
         this.style.backgroundColor = "#413f5e";
      }
   }))
}
