const Expense = require('../models/expenses');

function isstringnotvalid(string) {         //This function will return true if string not valid
    if (string == undefined || string.length === 0) {
        return true;
    }
    else {
        return false;
    }
}

function isintegernotvalid(int) {         //This function will return true if string not valid
    if (int == undefined || int.length === 0) {
        return true;
    }
    else {
        return false;
    }
}

const addexpense = async(req, res) => {
    try{
    const {expenseamount, category, description} = req.body;

    if (isintegernotvalid(expenseamount) || isstringnotvalid(category) || isstringnotvalid(description)) {
        return res.status(400).json({ err: "Bad parameters - Something is missing" })
    }

    const expense = await Expense.create({expenseamount, category, description, userId: req.user.id})
        return res.status(201).json({expense, success: true});
    
}catch(err){
        return res.status(500).json({success: false, error: err})
}
}

const getexpenses = async(req, res, next)=> {
    try{
    const expenses = await Expense.findAll({where: {userId: req.user.id}});
    res.status(200).json({allExpenses: expenses});
    }
    catch(error){
        console.log('Get Expenses is failing', JSON.stringify(error));
        res.status(500).json({error: error});
    }
}

const deleteexpense = (req, res) => {
    
        const expenseid = req.params.expenseid;
        if(expenseid == undefined || expenseid.length === 0)
        {
            res.status(400).json({success: false})
        }
        Expense.destroy({where: {id: expenseid}}).then(() => {
            return res.status(200).json({success: true, message: 'Deleted successfuly'})
        }).catch(err =>{
            console.log(err);
            return res.status(500).json({ success: false, message: 'Failed'})
        })

        

}


module.exports = {
    addexpense,
    getexpenses,
    deleteexpense
}