class JeopardyTable {
    constructor(){
        this.categories = ["Category 1", "Category 2", "Category 3", "Category 4", "Category 5", "Category 6"]
        this.values = [
            ["?", "?", "?", "?", "?", "?"],
            ["?", "?", "?", "?", "?", "?"],
            ["?", "?", "?", "?", "?", "?"],
            ["?", "?", "?", "?", "?", "?"],
            ["?", "?", "?", "?", "?", "?"]
          ];

   this.tableContainer = document.getElementById("jeopardyTable");

  this.resetButton = document.createElement("button");
  this.resetButton.textContent = "Reset Game";
  this.resetButton.addEventListener("click", () => this.resetGame());
  document.body.appendChild(this.resetButton);
    }

resetGame() {
    this.tableContainer.innerHTML = ""; // Clear the existing table
    setupGame(); // Call the setupGame function to start a new game
}    

generateTable(categoryTitles, categories) {
  const tableContainer = document.getElementById("jeopardyTable");
  const table = document.createElement("TABLE");
  const headerRow = this.createHeaderRow(categoryTitles);
  table.appendChild(headerRow);

  for (let rowIndex = 0; rowIndex < this.values.length; rowIndex++) {
    const tr = this.createTableRow(rowIndex, categories);
    table.appendChild(tr);
  }

  tableContainer.appendChild(table);
}

createHeaderRow(categoryTitles) {
  const headerRow = document.createElement("TR");
  for (let i = 0; i < this.categories.length; i++) {
    const th = document.createElement("TH");
    th.textContent = categoryTitles[i].toUpperCase();
    headerRow.appendChild(th);
  }
  return headerRow;
}

createTableRow(rowIndex, categories) {
  const tr = document.createElement("TR");
  for (let colIndex = 0; colIndex < this.values[rowIndex].length; colIndex++) {
    const td = document.createElement("TD");
    const cellValue = this.values[rowIndex][colIndex];
    if (cellValue === "?") {
      td.textContent = '?';
      td.addEventListener('click', () => {
        if(td.textContent === '?'){
          const question = this.getQuestion(colIndex, rowIndex, categories);
          td.textContent = question;
        } else {
          const answer = this.getAnswer(colIndex, rowIndex, categories);
          td.textContent = answer;
          td.classList.add("revealed-answer"); // Add the CSS class to the cell
        }
        
      });
    } else {
      td.textContent = cellValue;
    }
    tr.appendChild(td);
  }
  return tr;
}

getAnswer(colIndex, rowIndex, categories){
  const categoryIndex = colIndex;
  const clueIndex = rowIndex;
  const answer = categories[categoryIndex]?.clues[clueIndex]?.answer || '';
  return answer
}


getQuestion(colIndex, rowIndex, categories) {
  const categoryIndex = colIndex;
  const clueIndex = rowIndex;
  const question =
    categories[categoryIndex]?.clues[clueIndex]?.question || "";
  return question;
}
// createResetButton() {
//   const resetButton = document.createElement("button");
//   resetButton.textContent = "Reset Game";
//   resetButton.addEventListener("click", setupGame);
//   document.body.appendChild(resetButton);
// }


}

  
const newGame = new JeopardyTable();
newGame.createResetButton();

async function setupGame() {
    const categories = await getCategoryIds();
    const categoryTitles = categories.map(category => category.title);
    newGame.generateTable(categoryTitles, categories);
    playJeopardy(categories);
  }

async function getCategoryIds(){
    const NUM_CATEGORIES = 6;
    const NUM_QUESTIONS_PER_CAT = 5;

    const res = await axios.get('http://jservice.io/api/categories', {
        params: { count: 100}
});
console.log(res.data);

  const categoryIds = res.data.map(category => category.id);
  const randomCategoryIds = getRandomCategory(categoryIds, NUM_CATEGORIES);
  
  const categories = [];
  for (let categoryId of randomCategoryIds) {
    const category = await getCategory(categoryId, NUM_QUESTIONS_PER_CAT);
    categories.push(category);
  }

  return categories;
}

function getRandomCategory(array, numElements){
    // const shuffledArray = array.sort(() => Math.random() - 0.5);
    // return shuffledArray.slice(0, numElements);
    const newArray = [];

  for (let i = 0; i < numElements; i++) {
    const randomIndex = Math.floor(Math.random() * array.length);
    const selectedElement = array.splice(randomIndex, 1)[0];
    newArray.push(selectedElement);
  }
  return newArray;
}

async function getCategory(catId, numQuestions) {
    const res = await axios.get(`http://jservice.io/api/category?id=${catId}`);
    const category = {
      title: res.data.title,
      clues: getRandomQuestions(res.data.clues, numQuestions)
    };
    console.log(category);
    return category;
  }

  function getRandomQuestions(clues, numQuestions) {
    const filteredClues = clues.filter(clue => clue.question !== '');
    const shuffledClues = getRandomElements(filteredClues, numQuestions);
    return shuffledClues.map(clue => ({
      question: clue.question,
      answer: clue.answer,
      showing: null
    }));
  }

  function getRandomElements(array, numElements) {
    const shuffledArray = array.slice().sort(() => Math.random() - 0.5);
    return shuffledArray.slice(0, numElements);
  }

  async function playJeopardy(categories) {
    for (let category of categories) {
      console.log(`Category: ${category.title}`);
      for (let clue of category.clues) {
        console.log(`Question: ${clue.question}`);
        console.log(`Answer: ${clue.answer}`);
        console.log('---');
      }
    }
  }
  // setupGame();
 


