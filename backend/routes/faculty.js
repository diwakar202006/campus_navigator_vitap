const express = require('express');
const router = express.Router();
const Faculty = require('../models/Faculty');

// create faculty
router.post('/', async (req, res) => {
  try {
    const f = new Faculty(req.body);
    await f.save();
    res.status(201).json(f);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// list all
router.get('/', async (req, res) => {
  const list = await Faculty.find().limit(1000);
  res.json(list);
});

// rank endpoint
router.post('/rank', async (req, res) => {
  try {
    const weights = Object.assign({
      publications: 0.25,
      citations: 0.25,
      teachingScore: 0.35,
      experienceYears: 0.15
    }, req.body.weights || {});

    const all = await Faculty.find().lean();

    const getRange = (arr, key) => {
      const vals = arr.map(a => a[key] || 0);
      return { min: Math.min(...vals), max: Math.max(...vals) };
    };

    const pubsRange = getRange(all, 'publications');
    const citRange = getRange(all, 'citations');
    const teachRange = getRange(all, 'teachingScore');
    const expRange = getRange(all, 'experienceYears');

    const normalize = (val, range) => {
      if (range.max === range.min) return 0.5;
      return (val - range.min) / (range.max - range.min);
    };

    const ranked = all.map(f => {
      const sP = normalize(f.publications || 0, pubsRange);
      const sC = normalize(f.citations || 0, citRange);
      const sT = normalize(f.teachingScore || 0, teachRange);
      const sE = normalize(f.experienceYears || 0, expRange);

      const score = sP * weights.publications
                  + sC * weights.citations
                  + sT * weights.teachingScore
                  + sE * weights.experienceYears;

      return { ...f, score };
    }).sort((a, b) => b.score - a.score);

    res.json(ranked);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
