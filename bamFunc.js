const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
    connectionLimit: 1,
    host     : 'localhost',
    port     : 8889,
    user     : 'root',
    password : 'root',
    database : 'bamazon'
});

pool.getConnection = util.promisify(pool.getConnection);
pool.query = util.promisify(pool.query);


function setLoader(input){
    process.stdout.write(input+"..");
    const loader = setInterval(() => {
        process.stdout.write(".")
    }, 500);
    return loader;
}
function cancelLoader(loader){
    clearInterval(loader);
    process.stdout.write("\n")
}

function getAll(){
  
  return new Promise(async(res,rej)=>{
      try{
          const loader = setLoader("Please Wait...")
          results = await pool.query('SELECT * FROM ?? ',"products");
          cancelLoader(loader)
          res(results);
      }catch(err){
          console.error(err);
          rej(err);
      }
      
  })
}
  

function changeQuantityForProduct(item_id,qty){
  return new Promise(async (resolve,reject)=>{
      const connection = await pool.getConnection();
      //TODO promisify
      connection.beginTransaction(function(err) {
          if (err) { reject(err); }
          connection.query('SELECT * FROM ?? WHERE ? LIMIT 1', ["products",{item_id:item_id}], function (error, results, fields) {
              if (error) {
                  resolve (connection.rollback(function() {
                  reject(error);
                  }));
              }
              
              let q = connection.query('UPDATE ?? SET ? WHERE ?', ["products",{qty:results[0].qty - qty},{item_id:item_id}], function (error, results, fields) {
              if (error) {
                  console.log(q.sql);
                  
                  resolve (connection.rollback(function() {
                      reject(error);
                  }));
              }
              
              connection.commit(function(err) {
                  if (err) {
                      resolve (connection.rollback(function() {
                      reject(err);
                      }));
                  }
                  connection.release();
                  resolve(true);
                  
              });
            });
          });
        });
        
  })
}

function queryLowInventory(lowQuantity){
  return new Promise(async(res, rej)=>{
      try{
          results = await pool.query('SELECT * FROM ?? WHERE qty<?',["products", lowQuantity])
          res(results);
      } catch(err){
          console.error(err);
          rej(err);
      }
      
  })
}

function addNewProductToDB(productName,departmentName,price,stockQuantity){
  return new Promise(async(res,rej)=>{
      try{
          results = await pool.query('INSERT INTO ?? SET ?',["products",{
            product:productName,
            dept_id:departmentName,
            price:price,
            qty:stockQuantity
          }])
          res(results);
      }catch(err){
          console.error(err);
          rej(err);
      }
      
  })
}

function changeSalesForProduct(item_id,sales){
    return new Promise(async (resolve,reject)=>{

        const connection = await pool.getConnection();


        //TODO promisify
        connection.beginTransaction(function(err) {
            if (err) { reject(err); }
            connection.query('SELECT * FROM ?? WHERE ? LIMIT 1', ["products",{item_id:item_id}], function (error, results, fields) {
                if (error) {
                    reject(error);
                    };
                let q = connection.query('UPDATE ?? SET ? WHERE ?', ["products",{product_sales:results[0].product_sales + sales},{item_id:item_id}], function (error, results, fields) {
                if (error) {
                    resolve (connection.rollback(function() {
                        reject(error);
                    }));
                }
                
                connection.commit(function(err) {
                    if (err) {
                        resolve (connection.rollback(function() {
                        reject(err);
                        }));
                    }
                    connection.release();
                    resolve(true);
                    
                });
              });
            });
          });
    })
  }

function salesByDepartment(){
    return new Promise(async(res,rej)=>{
        try{
            results = await pool.query(
                `SELECT d.*,sum(p.product_sales) AS product_sales
                ,(sum(p.product_sales) - overhead) AS total_profit
                FROM ?? d
                INNER JOIN ?? p ON d.dept_id = p.dept_id
                group by d.dept_id
                ORDER BY product_sales DESC`,
                ["departments","products"])
            res(results);
        }catch(err){
            console.error(err);
            rej(err);
        }
        
    })
  }




function addNewDepartmentToDB(departmentName,overhead){
    return new Promise(async(res,rej)=>{
        try{
            results = await pool.query(
                `INSERT INTO ?? SET ?`,
                ["departments", {department:departmentName, overhead:overhead}])
            res(results);
        }catch(err){
            console.error(err);
            rej(err);
        }
        
    })
}



module.exports={
    pool : pool,
    getAll : getAll,
    changeQuantityForProduct : changeQuantityForProduct,
    queryLowInventory : queryLowInventory,
    addNewProductToDB : addNewProductToDB,
    setLoader : setLoader,
    cancelLoader : cancelLoader,
    changeSalesForProduct : changeSalesForProduct,
    salesByDepartment : salesByDepartment,
    addNewDepartmentToDB : addNewDepartmentToDB
}