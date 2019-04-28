const {table} =require('table');
const chalk = require('chalk');

config = {
    border: {
        topBody: chalk.blue(`═`),
        topJoin: chalk.blue(`╤`),
        topLeft: chalk.blue(`═`),
        topRight: chalk.blue(`═`),
 
        bottomBody: chalk.blue(`═`),
        bottomJoin: chalk.blue(`╧`),
        bottomLeft: chalk.blue(`═`),
        bottomRight: chalk.blue(`═`),
 
        bodyLeft: chalk.blue(` `),
        bodyRight: chalk.blue(` `),
        bodyJoin: chalk.blue(`│`),
 
        joinBody: chalk.blue(`─`),
        joinLeft: chalk.blue(`─`),
        joinRight: chalk.blue(`─`),
        joinJoin: chalk.blue(`┼`)
    },
    drawHorizontalLine: (index, size) => {
        return index === 0 || index === 1 ||  index === size;
    }
    // columnDefault: {
    //     alignment: 'center'
    // },
};



function makeTable(data){

    tableData = [];
    tableData.push(Object.keys(data[0]));
    tableData = tableData.concat(data.map(ele=>Object.values(ele)));
    

    if(tableData && tableData.length >0){
        tableData[0] = tableData[0].map(x=>chalk.green(x));

        output = table(tableData, config);
        
        return output;
    }
    return null;
}

module.exports.makeTable = makeTable;