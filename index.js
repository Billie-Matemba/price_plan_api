import express from 'express';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import { totalPhoneBill } from './totalPhoneBill.js';
const app = express();
app.use(express.static('public'));
app.use(express.json())
app.use(cors());
const db = await sqlite.open({
    filename: './data_plan.db',
    driver: sqlite3.Database
});

await db.migrate();

//Return a list of all the available price plans
app.get('/api/price_plans/', async (req, res) => {
    const plan = await db.all('select * from price_plan');
    res.json(plan);
});

//Calculate the phone bill total using the specified price plan data

app.post('/api/phonebill/', async (req, res) => {
    const { price_plan, actions } = req.body;
    const planData = await db.get('select * from price_plan where plan_name = ?', [price_plan]);
    const { call_price, sms_price } = planData;
    const total = totalPhoneBill(actions, call_price, sms_price);
    return res.json({ total });

});

// create a new price plan
app.post('/api/price_plan/create', async (req, res) => {
    const { name, sms_cost, call_cost } = req.body
    const result = await db.run('INSERT INTO price_plan (plan_name, call_price, sms_price) VALUES (?, ?, ?)',
        [name, call_cost, sms_cost]);
    return res.status(201).json({ message: 'Price plan created successfully'});

});

//Update a price plan
app.post('/api/price_plan/update', async (req, res) => {
    const { name, sms_cost, call_cost } = req.body
    const result = await db.run('update price_plan set call_price = ?, sms_price = ? where plan_name = ?',
        [call_cost, sms_cost, name]);
    return res.status(201).json({ message: 'Price plan updated successfully'});

});


//delete a price plan
app.post('/api/price_plan/delete', async (req,res) =>{
    const {id} = req.body
    const remove = await db.run('delete from price_plan where id = ?',[id]);
    return res.status(201).json({message:'price plan successfully deleted'});
});



const PORT = process.env.PORT || 4011;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));