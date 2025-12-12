import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Donation from '../models/Donation.js';

const TEST_EMAIL = 'donor@gmail.com'; 
const TEST_PASSWORD = 'donor@123'; 
let donorToken; 
let createdDonationId; 

const TEST_MONGO_URI = process.env.MONGO_URI; 

describe('Donation & Request Endpoints', () => {
    
    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(TEST_MONGO_URI);
        }
        
        await User.deleteOne({ email: TEST_EMAIL });
        
        await User.create({
            name: 'Test Donor',
            email: TEST_EMAIL,
            password: TEST_PASSWORD, 
            role: 'donor',
            phone: '5551234567',
            organization: 'Test Org'
        });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: TEST_EMAIL, password: TEST_PASSWORD });
            
        donorToken = loginRes.body.token;
        if (!donorToken) {
            throw new Error(`Login failed. Status: ${loginRes.statusCode}`);
        }
    });

    afterAll(async () => {
        if (createdDonationId) {
            await Donation.findByIdAndDelete(createdDonationId);
        }
        await User.deleteOne({ email: TEST_EMAIL });
        await mongoose.disconnect();
    });

    it('1. should allow donor to create a new donation (POST /api/donations)', async () => {
        const res = await request(app)
            .post('/api/donations')
            .set('Authorization', `Bearer ${donorToken}`)
            .send({
                title: "Test Meal Kit Donation",
                description: "Freshly prepared meal kits.",
                foodType: "Cooked Meal", 
                quantity: "5 Kits",
                pickupLocation: "Test Donor Location, Nairobi",
                latitude: 1.2921,
                longitude: 36.8219,
                status: "Available"
            });
            
        if (res.statusCode !== 201) {
            console.error("Create Validation Error:", res.body);
        }

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.title).toBe("Test Meal Kit Donation");
        createdDonationId = res.body._id; 
    });

    it('2. should fetch all available donations (GET /api/donations)', async () => {
        const res = await request(app)
            .get('/api/donations')
            .set('Authorization', `Bearer ${donorToken}`);
            
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.some(d => d._id === createdDonationId)).toBe(true);
    });

    it('3. should allow donor to update their donation (PUT /api/donations/:id)', async () => {
        const res = await request(app)
            .put(`/api/donations/${createdDonationId}`)
            .set('Authorization', `Bearer ${donorToken}`)
            .send({
                quantity: "10 Kits (Updated)", 
            });
            
        expect(res.statusCode).toBe(200);
        expect(res.body.quantity).toBe("10 Kits (Updated)");
    });

    it('4. should allow donor to delete the donation (DELETE /api/donations/:id)', async () => {
        const res = await request(app)
            .delete(`/api/donations/${createdDonationId}`)
            .set('Authorization', `Bearer ${donorToken}`);
            
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Donation removed');
    });
});