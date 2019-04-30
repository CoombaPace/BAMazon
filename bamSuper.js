//==================================================================//
//          REQUIREMENTS & CONNECTIONS
//==================================================================//

const inquirer = require('inquirer');
const {makeTable} = require('./tableChalk');

const bamFunc = require('./bamFunc.js')
, pool = bamFunc.pool
, getAll = bamFunc.getAll
, changeQuantityForProduct = bamFunc.changeQuantityForProduct
, setLoader = bamFunc.setLoader
, cancelLoader = bamFunc.cancelLoader
, changeSalesForProduct = bamFunc.changeSalesForProduct
, salesByDepartment = bamFunc.salesByDepartment
, addNewDepartmentToDB = bamFunc.addNewDepartmentToDB;

//==================================================================//
//          MAIN PROCESSES
//==================================================================//

mainAsync();
// MAIN ASYNC FOR A SUPERVISOR ALLOWS FURTHER CHANGES AND QUERIES THAT MANAGERS
// CAN'T ACCESS.

async function  mainAsync(){
    const options = ["Product Sales by Dept.", "Add Department"];
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
            loader = setLoader("Loading departments...");
            const allProducts = await salesByDepartment();
            cancelLoader(loader);
            
        if(allProducts && allProducts.length>0){
            console.log(makeTable(allProducts));
        }
            break;
        case options[1]:
            await addDepartment();
        default:
            break;
    }
    const confirm = await inquirer
        .prompt([
            {
            message:"Would you like to do anything else?",
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
//              FUNCTIONS
//==================================================================//

// ADD A NEW DEPT. TO THE DB.
async function addDepartment(){
    const answers= await inquirer
        .prompt([
            {
            message:"Enter the department name.",
            type:"input",
            name:"departmentName",
            validate: input => {return input.length <= 100}
            },
            {
                message:"What is this deptartment's overhead?",
                type:"input",
                name:"overhead",
                validate: input => {return !isNaN(parseFloat(input))}
            }
    ]);
    await addNewDepartmentToDB(answers.departmentName, answers.overhead)
    console.log("Success!")
}
//==================================================================//