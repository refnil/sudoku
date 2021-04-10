
import("./node_modules/sudoku/sudoku.js").then((js) => {
  var cases = getElementsByXPath('//li/span')
  var line = '..3.2.6..9..3.5..1..18.64....81.29..7.......8..67.82....26.95..8..2.3..9..5.1.3..';

  function getElementsByXPath(xpath)
  {
      let results = [];
      let query = document.evaluate(xpath, document,
          null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (let i = 0, length = query.snapshotLength; i < length; ++i) {
          results.push(query.snapshotItem(i));
      }
      return results;
  }

  function init_cells(){
    //console.log(cases)
    for (i = 0; i < cases.length; i++) {
      cases[i].innerHTML = i
    } 
  }

  function init_button() {
    button = getElementsByXPath('//button')[0];
    button.onclick = solve_current;
  }

  function solve_current(){
    line = ""
    for(i = 0; i < 81; i++){
      var c = cases[i].innerHTML;
      if(c == ''){
        line += '.';
      }
      else{
        line += cases[i].innerHTML;
      }
    }
    console.log(line)
    var res = js.solve(line)
    console.log(res)
    for(i = 0; i < 81; i++){
      cases[i].innerHTML = res[i];
    }
  }

  function set_line(line){
    for(i = 0; i < 81; i++){
      cases[i].classList.remove('clue')
      cases[i].classList.remove('other')

      if(line[i] != '.'){
        cases[i].innerHTML = line[i]
        cases[i].classList.add('clue')
      }
      else {
        cases[i].innerHTML = ""
        cases[i].classList.add('other')
      }
    }
  }

  js.init()
  init_cells()
  init_button()
  set_line(line)
});
