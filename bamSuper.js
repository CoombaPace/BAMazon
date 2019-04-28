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


mainAsync();

async function  mainAsync(){
    const options = ["Product Sales by Department", "Add Department"];
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
            loader = setLoader("Loading all department");
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
            message:"Would you like to perform more actions?",
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


async function addDepartment(){


    const answers= await inquirer
        .prompt([
            {
            message:"What is the name of the department would you like to add?",
            type:"input",
            name:"departmentName",
            validate: input => {return input.length <= 100}
            },
            {
                message:"What is the overhead cost of the Department?",
                type:"input",
                name:"overhead",
                validate: input => {return !isNaN(parseFloat(input))}
            }
    ]);
    await addNewDepartmentToDB(answers.departmentName,answers.overhead)
    console.log("Added Successfully!")


}
