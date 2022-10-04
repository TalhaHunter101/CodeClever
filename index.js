const express = require("express");
const app = express();
const PORT = 9000;
const sequelize = require("./DB/connect");

// rendering routes

// app.use("/user/bankaccount/transaction", require("./Router/transactionRoutes"));


// app.use("/", (req, res) => {
//     res.send("Hi Talha")
// })

app.use("/", require("./routes/routes"));



// Listening on this port

app.listen(PORT, () => {
    console.log(`Server is starting at : ${PORT} `);
});
