const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
const logger = require('../logger');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator')


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


router.post('/login', async (req, res) => {
    try {
        const { email, password} = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const db = await connectToDatabase();
        const collection = db.collection("users");

        const existingUser = await collection.findOne({email: email})

        if (!existingUser) {
            return res.status(401).json({error: "This user has not been registered"})
        }

        const pass = await bcryptjs.compare(password, existingUser.password)

        if (pass) {
            const userName = existingUser.firstName
            const userEmail = existingUser.lastName

            let payload = {
                user: {
                    id: existingUser._id.toString(),
                },
            }
            const authtoken = jwt.sign(payload, JWT_SECRET)
            return res.status(200).json({ authtoken, userName, userEmail });

        } else {
            logger.error('User not found');
		    return res.status(401).json({ error: 'User not found' });
        }

    } catch (error) {
        logger.error(error)
        return res.status(500).json({ error: 'Server problem' });
    }
})

router.put('/update', async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        logger.error('Validation errors in update request', errors.array())
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email } = req.headers
        if (!email) {
            logger.error('Email not found in the request headers');
            return res.status(400).json({error:"Email not found in the request headers"})
        }

        const db = await connectToDatabase();
        const collection = db.collection("users");
		const user = await collection.findOne({ email })

        if (!user) {
            logger.error('User not found');
            return res.status(404).json({ error: "User not found" });
        }

    

       const userData = {
        updatedAt: new Date(),
        firstName: req.body.name
        }

        
       const updateUser = await collection.findOneAndUpdate(
            {email}, { $set: userData }, { returnDocument: 'after' }
        )
		let payload = {
                user: {
                    id: updateUser._id.toString(),
                },
            }
        const authtoken = jwt.sign(payload, JWT_SECRET)
        logger.info('User updated successfully')
        res.status(200).json({ authtoken });
    } catch (e) {
         return res.status(500).send('Internal server error' + e);

    }
})

module.exports = router;