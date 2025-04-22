const express = require('express');
const { body, query, validationResult } = require('express-validator');
const supabase = require('../supabase');
const { getDistance } = require('../utils');
const router = express.Router();

// 1) Add School
router.post(
  '/addSchool',
  [
    body('name').notEmpty(),
    body('address').notEmpty(),
    body('latitude').isFloat({ min: -90, max: 90 }),
    body('longitude').isFloat({ min: -180, max: 180 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, address, latitude, longitude } = req.body;
    const { data, error } = await supabase
      .from('schools')
      .insert({ name, address, latitude, longitude })
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
  }
);

// 2) List Schools by Proximity
router.get(
  '/listSchools',
  [
    query('latitude').isFloat({ min: -90, max: 90 }),
    query('longitude').isFloat({ min: -180, max: 180 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const userLat = +req.query.latitude;
    const userLng = +req.query.longitude;

    const { data: schools, error } = await supabase
      .from('schools')
      .select('*');

    if (error) return res.status(500).json({ error: error.message });

    const withDist = schools.map(s => ({
      ...s,
      distance: getDistance(userLat, userLng, s.latitude, s.longitude)
    }));
    withDist.sort((a, b) => a.distance - b.distance);
    res.json(withDist);
  }
);

module.exports = router;
