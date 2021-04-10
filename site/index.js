
import("./node_modules/sudoku/sudoku.js").then((js) => {
  var cells = getElementsByXPath('//li/span')
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
    for (i = 0; i < cells.length; i++) {
      cells[i].innerHTML = i
    } 
  }

  function init_button() {
    solve = getElementsByXPath('//button[@id="solve"]')[0];
    solve.onclick = solve_current;
    new_sudoku = getElementsByXPath('//button[@id="new"]')[0];
    new_sudoku.onclick = generate_new;
  }

  function solve_current(){
    line = ""
    for(i = 0; i < 81; i++){
      var c = cells[i].innerHTML;
      if(c == ''){
        line += '.';
      }
      else{
        line += cells[i].innerHTML;
      }
    }
    var res = js.solve(line)
    for(i = 0; i < 81; i++){
      cells[i].innerHTML = res[i];
    }
  }

  function generate_new() {
    set_line(js.generate())
  }

  function set_line(line){
    for(i = 0; i < 81; i++){
      cells[i].classList.remove('clue')
      cells[i].classList.remove('other')

      if(line[i] != '.'){
        cells[i].innerHTML = line[i]
        cells[i].classList.add('clue')
      }
      else {
        cells[i].innerHTML = ""
        cells[i].classList.add('other')
      }
    }
  }

  js.init()
  init_cells()
  init_button()
  set_line(line)
});
