// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const Faculty = require('./models/Faculty');

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI missing in .env');
    process.exit(1);
  }

  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('✅ Connected to MongoDB Atlas');

  // --- Load both files ---
  const files = [
    path.resolve(__dirname, '..', 'data', 'faculty.json'),
    path.resolve(__dirname, '..', 'data', 'faculty_yellow_tag.json')
  ];

  let docs = [];
  for (const file of files) {
    if (!fs.existsSync(file)) {
      console.warn(`⚠️ File not found: ${file} — skipping`);
      continue;
    }

    const raw = fs.readFileSync(file, 'utf8');
    try {
      const arr = JSON.parse(raw);

      // If this is the yellow-tag file, add a flag/tag to each record
      const isYellow = file.includes('yellow_tag');
      if (Array.isArray(arr)) {
        const tagged = arr.map(d =>
          isYellow ? { ...d, tag: 'yellow' } : { ...d, tag: 'normal' }
        );
        docs = docs.concat(tagged);
      }
    } catch (e) {
      console.error(`❌ Invalid JSON in ${file}:`, e.message);
    }
  }

  console.log(`📦 Loaded ${docs.length} total records from all files`);

  // --- Optional: clear old data first ---
  // await Faculty.deleteMany({});
  // console.log('🧹 Cleared existing Faculty collection');

  // --- Insert into MongoDB ---
  const BATCH = 500;
  for (let i = 0; i < docs.length; i += BATCH) {
    const batch = docs.slice(i, i + BATCH).map(d => ({
      name: d.name || d.fullName || d.facultyName || 'Unknown',
      publications: Number(d.publications || d.pubs || 0),
      citations: Number(d.citations || d.cites || 0),
      teachingScore: Number(d.teachingScore || d.teaching || 0),
      experienceYears: Number(d.experienceYears || d.exp || 0),
      otherMetrics: d.otherMetrics || d.metrics || {},
      tag: d.tag // will be 'normal' or 'yellow'
    }));

    try {
      await Faculty.insertMany(batch, { ordered: false });
      console.log(`✅ Inserted ${Math.min(i + BATCH, docs.length)} / ${docs.length}`);
    } catch (err) {
      console.error('⚠️ Batch insert error (continuing):', err.message || err);
    }
  }

  console.log('🎉 Seeding complete!');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
