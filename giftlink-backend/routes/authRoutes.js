const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
const logger = require('../logger');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const db = await connectToDatabase();
        const collection = db.collection("users");

        
        const existingEmail = await collection.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({ message: "User already exists" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(password, salt);

        const newUser = await collection.insertOne({
            email,
            firstName,
            lastName,
            password: hash,
            createdAt: new Date(),
        });


        const payload = {
            user: {
                id: newUser.insertedId,
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);

        logger.info(`User registered successfully: ${email}`);
        return res.status(201).json({ authtoken, email });

    } catch (e) {
    logger.error(`Error en registro: ${e.stack}`);

    return res.status(500).json({ error: e.message, stack: e.stack });
}
});

module.exports = router;