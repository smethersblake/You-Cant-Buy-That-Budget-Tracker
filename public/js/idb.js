let db
const request = indexedDB.open("budget_tracker", 1)

const transaction = db.transaction(["new_transaction"], "readwrite")
const store = transaction.objectStore("new_transaction")
const getAll = store.getAll()

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
        uploadBudget()
    }
}
request.onerror = function (event)
{
    console.log("Error Code: " + event.target.errorCode)
}
function uploadBudget ()
{
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
                .then(() =>
                {
                    store.clear()
            })
        }
    }
}
function saveRecord (save)
{
    store.add(save)
}
function deleteTrasaction ()
{
    store.clear()
}
window.addEventListener("online", uploadBudget)