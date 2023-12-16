// const Razorpay = require('razorpay');

async function addNewExpense(e){
    try
    {
    e.preventDefault()

    const expenseDetails = {
        expenseamount : e.target.expenseamount.value,
        description : e.target.description.value,
        category : e.target.category.value
    }
    console.log(expenseDetails)
    const token = localStorage.getItem('token')
    const response = await axios.post('http://localhost:3000/expense/addexpense', expenseDetails, {headers: {"Authorization": token}})
        addNewExpensetoUI(response.data.expense);
}
catch(err)
{
    // showError(err);
    console.log(err);
}
}

window.addEventListener('DOMContentLoaded', ()=>{
    const token = localStorage.getItem('token')
    axios.get('http://localhost:3000/expense/getexpenses', { headers: {"Authorization": token}})
        .then(response => {
        console.log(response);

        for(var i = 0; i<response.data.allExpenses.length; i++){
            addNewExpensetoUI(response.data.allExpenses[i]);
        }
        }).catch(err => {
            // showError(err);
            console.log(err);
        })
    })


function addNewExpensetoUI(expense)
{
    const parentNode = document.getElementById('listofExpenses');
            const childHTML = `<li id = ${expense.id}> ${expense.expenseamount} - ${expense.category} -> ${expense.description}
                        <button onclick=deleteExpense('${expense.id}')> Delete </button>
                    </li>`

            parentNode.innerHTML = parentNode.innerHTML + childHTML;
}

function deleteExpense(expenseId)
{
    axios.delete(`http://localhost:3000/expense/deleteexpense/${expenseId}`)
        .then((response) => {
            removeExpenseFromScreen(expenseId);
        })
        .catch((err) => {
            // showError(err);
            console.log(err);
        })
}

function removeExpenseFromScreen(expenseId)
{
    const parentNode = document.getElementById('listofExpenses');
    const childNodeToBeDeleted = document.getElementById(expenseId);
    if(childNodeToBeDeleted){
        parentNode.removeChild(childNodeToBeDeleted);
    }

}

document.getElementById('rzp-button1').onclick = async function(e) {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/purchase/premiummembership', {headers: {"Authorization" : token}});
    console.log(response);
    console.log("I am here")
    var options = 
    {
        "key": response.data.key_id, //Enter the key id generated from the Dashboard
        "order_id": response.data.order.id, //For one time payment
        //This handler function will handle the success payment 
        "handler": async function (response) {
            await axios.post('http://localhost:3000/purchase/updateTransactionStatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: {"Authorization" : token}})

            alert('You are a Premium User now')
        },
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function (response){
        console.log(response);
        alert('Something went wrong')
    })
}

// const expenseElemId = `expense-${expenseId}`;
//     document.getElementById(expenseElemId).remove();