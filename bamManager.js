//==================================================================//
//          REQUIREMENTS & CONNECTIONS
//==================================================================//

const inquirer = require('inquirer');
const {makeTable} = require('./tableChalk');

const bamFunc = require('./bamFunc.js')
, pool = bamFunc.pool
, getAll = bamFunc.getAll
, changeQuantityForProduct = bamFunc.changeQuantityForProduct
, queryLowInventory = bamFunc.queryLowInventory
, addNewProductToDB = bamFunc.addNewProductToDB
, setLoader = bamFunc.setLoader
, cancelLoader = bamFunc.cancelLoader;

//==================================================================//
//                  MAIN PROCESSES
//==================================================================//

mainAsync();
// MAIN ASYNC FOR THE MANAGER ALLOWS MANIPULATION OF DATA.
async function  mainAsync(){
    const options = ["Products for Sale", "Low Inventory", "Add Inventory", "Add New Product"];
    let loader;
    const answers = await inquirer
        .prompt([
            {
            message:"What would you like to do?",
            type:"list",
            name:"userChoice",
            choices:options
            }
        ]);
    switch (answers.userChoice){
        case options[0]:
            loader = setLoader("Loading Products...");
            const allProducts = await getAll();
            cancelLoader(loader);

            process.stdout.write('Available Products: \n');
            console.log(makeTable(allProducts));
            break;
        case options[1]:
        // BUG: If there are 0 products with low inventory, it will throw an error.
            loader = setLoader("Loading low inventory...");
            const lowQuantityItems = await queryLowInventory(5);
            cancelLoader(loader);
            
            console.log(makeTable(lowQuantityItems));

            break;
        case options[2]:
            await addMoreInventory();
            break;
        case options[3]:
            await addNewProduct();
            break;
        default:
            break;
    }
    const confirm = await inquirer
        .prompt([
            {
            message:"Would you like to make more changes?",
            type:"confirm",
            name:"more"
            }
        ]);
    if(confirm.more){
        mainAsync();
    }else{
        console.log("Goodbye!");
        pool.end();
    }
}

//==================================================================//
//                  FUNCTIONS
//==================================================================//

// ADD INVENTORY
async function addMoreInventory(){
    const allProducts = await getAll();

    console.log();
    const answers= await inquirer
        .prompt([
            {
            message:"Select Product:",
            type:"list",
            name:"userChoice",
            choices:allProducts.map(item=>"item_id: "+item.item_id+", "+item.product+': '+item.qty)
            },
            {
                message:"Enter quantity:",
                type:"input",
                name:"addQuantity",
                validate: input => {return !isNaN(parseInt(input))}
            }
    ]);
    const item_id = answers.userChoice.slice(9).split(',')[0];
    
    await changeQuantityForProduct (item_id,-parseInt(answers.addQuantity));
    console.log(answers.addQuantity + " Successfully added!")
}

//==================================================================//

// ADD PRODUCT
async function addNewProduct(){
    const answers= await inquirer
        .prompt([
            {
            message:"Enter Product Name:",
            type:"input",
            name:"productName",
            validate: input => {return input.length <= 200}
            },
            {
                message:"Enter Department:",
                type:"input",
                name:"departmentName",
                validate: input => {return input.length <= 100}
            },
            {
                message:"Enter price:",
                type:"input",
                name:"price",
                validate: input => {return input<=999999.99 && input >=0}
            },
            {
                message:"How many would you like to add?",
                type:"input",
                name:"stockQuantity",
                validate: input => {return !isNaN(parseInt(input))}
            }
    ]);
    await addNewProductToDB(answers.productName, answers.departmentName, answers.price, answers.stockQuantity)
    console.log("Added Successfully!")

}
//==================================================================//