const { response } = require("express")

let db
const request = indexedDB.open("budget_tracker", 1)

request.onupgradeneeded = function (event)
{
    const db = event.target.result
    db.createObjectStore("new_transaction", { autoIncrement: true })
}
request.onsuccess = function (event)
{
    db = event.target.result
    if (navigator.onLine)
    {
        // TODO: upload transaction
    }
}
request.onerror = function (event)
{
    console.log("Error Code: " + event.target.errorCode)
}
function uploadBudget ()
{
    const transaction = db.transaction(["new_transaction"], "readwrite")
    const store = transaction.objectStore("new_transaction")
    const getAll = store.getAll()

    getAll.onsuccess = function ()
    {
        if (getAll.result.length > 0)
        {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, teaxt/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
                .then(response =>
                {
                const transaction = db.transaction(["new_transaction"], "readwrite")
                    const store = transaction.objectStore("new_transaction")
                    store.clear()
            })
        }
    }
}
