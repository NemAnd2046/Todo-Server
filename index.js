import express from "express";
import mysql from "mysql2/promise";
import { myConfig } from "./configDatabase.js";

const app = express();
app.use(express.json());

let connection;

try {
	connection = mysql.createPool(myConfig);

	//teszt
	await connection.execute("select 1");

	console.log("Sikeres kapcsolódás");
} catch (error) {
	console.log(error);
	process.exit(1);
}

app.get("/todos", async (request, response) => {
	try {
		const sql = `SELECT * FROM todolist ORDER BY timestamp`;
		const [rows, fields] = await connection.execute(sql);
		response.status(200).send(rows);
	} catch (error) {
		console.log(error);
	}
});

app.post("/todos", async (request, response) => {
	try {
		const { task } = request.body;
		const sql = `INSERT INTO todolist (task) VALUES (?)`;
		await connection.execute(sql, [task]);
		response.status(200).json({ msg: "Sikeres hozzáadás" });
	} catch (error) {
		console.log(error);
	}
});

app.patch("/todos/:reqId", async (request, response) => {
	try {
		const { reqId } = request.params;
		const sql = `UPDATE todolist SET complete = NOT complete WHERE id = ?`;
		await connection.execute(sql, [reqId]);
		response.status(200).json({ msg: "Sikeres változtatás" });
	} catch (error) {
		console.log(error);
	}
});

app.delete("/todos/:reqId", async (request, response) => {
	try {
		const { reqId } = request.params;
		const sql = `DELETE FROM todolist WHERE id = ?`;
		await connection.execute(sql, [reqId]);
		response.status(200).json({ msg: "Sikeres törlés" });
	} catch (error) {
		console.log(error);
	}
});

const port = process.env.PORT || 8000;

app.listen(port, () => console.log("Server: ", port));
