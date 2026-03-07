const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { addVehicle, getMyVehicles, deleteVehicle } = require('../controllers/vehicleController');

router.post('/', protect, addVehicle);
router.get('/my', protect, getMyVehicles);
router.delete('/:id', protect, deleteVehicle);

module.exports = router;


