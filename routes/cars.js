import express from 'express';
import Car from '../models/Car.js';

const router = express.Router();

// Create a new car
// cars.js
router.post('/', async (req, res) => {
    console.log('Received POST request with body:', req.body); // Log the request body
    try {
        const car = new Car(req.body);
        await car.save();
        res.status(201).send(car);
    } catch (error) {
        console.error('Error saving car:', error); // Log errors
        res.status(400).send(error);
    }
});


// Get all cars
router.get('/', async (req, res) => {
    try {
        const cars = await Car.find();
        res.send(cars);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a car by ID
router.get('/:id', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).send('Car not found');
        res.send(car);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a car by ID
router.patch('/:id', async (req, res) => {
    try {
        const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!car) return res.status(404).send('Car not found');
        res.send(car);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a car by ID
router.delete('/:id', async (req, res) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id);
        if (!car) return res.status(404).send('Car not found');
        res.send(car);
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;
