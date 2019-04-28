const inquirer = require('inquirer');

const bamFunc = require('./bamFunc.js')
, pool = bamFunc.pool
, getAll = bamFunc.getAll
, changeQuantityForProduct = bamFunc.changeQuantityForProduct
, setLoader = bamFunc.setLoader
, cancelLoader = bamFunc.cancelLoader


mainAsync();


async function  mainAsync(){
    let loader
    loader = setLoader("Loading products...");
    const allProducts = await getAll();
    cancelLoader(loader);
    
    if(allProducts){
        process.stdout.write('Available products: \n');
        console.table(allProducts);

        const answers = await inquirer
            .prompt([
                // {
                // type: "list",
                // message: "[BUY] or [EXIT]?",
                // choices: ["BUY", "EXIT"],
                // name: "BAMazon",
                // },
                {
                message:"Enter the item_id of the product you would like to buy.",
                type:"input",
                name:"userChoice",
                validate: input => {
                        if( parseInt(input) && parseInt(input)<=allProducts.length){
                            return true;
                        }else{
                            return "Please enter a number between 1 and "+allProducts.length;
                        }
                    }
                },
                {
                message:"How many would you like to buy?",
                type:"input",
                name:"howMany",
                validate: input => {return !isNaN(parseInt(input))}
                }
            ])
        const selectedProduct = allProducts.find(element => element.item_id == answers.userChoice);
        const purchaseAmount = parseInt(answers.howMany);
        if(selectedProduct.qty >= purchaseAmount){
            loader = setLoader("Purchasing");
            await changeQuantityForProduct(answers.userChoice,purchaseAmount);
            cancelLoader(loader);
            console.log("\nTotal cost of purchase: $",selectedProduct.price * purchaseAmount);
        }else{
            console.error("Insufficient quantity!")
        }
    }else{
        console.error ("0 Product found!");
    }
    const confirm = await inquirer
        .prompt([
            {
            message:"Would you like to buy more stuff?",
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

// ==============================================================================================
// const mysql = require("mysql");
// const inquirer = require("inquirer");

// const connection = mysql.createConnection({
//     host: "localhost",
//     port: 8889,
//     user: "root",
//     password: "root",
//     database: "bamazon"
// })

// function start() {
// connection.connect(function(err) {
//     if (err) throw err;
//     console.log("===============================");
//     console.log("Connected as ID " + connection.threadId);
//     console.log("===============================");
//     start();
//     // getAll();
//     // addItem();
//     // getRock();
//     // updateGenre();
//     // delSong();
// });

// function start() {
//     inquirer.prompt([
//     {
//         type: "list",
//         message: "[BUY] or [EXIT]?",
//         choices: ["BUY", "EXIT"],
//         name: "BAMazon"
//     },
//     {
//         name: "item_id",
//         type: "input",
//         message: "Please enter Item ID."
//       },
//     {
//         name: "qty",
//         type: "input",
//         message: "How Many?"
//       },
 
//  ]).then(function(res) {
//     console.log(res);
//     if (res.BAMazon === "BUY") {
//         buying();
//     } else if (res.postOrBid === "EXIT") {
//         console.log("Good-Bye!");
//         connection.end();
//     }
 
//  }).catch(function(err){
//     if(err) throw err;
//  });
// }
// }

// start();
