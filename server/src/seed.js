import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDatabase } from './config/database.js';
import { User } from './models/User.js';
import { Event } from './models/Event.js';

const password = process.env.DEMO_ORGANIZER_PASSWORD;
if (!password || password.length < 12 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
  console.error('Set DEMO_ORGANIZER_PASSWORD to a private password of at least 12 characters containing a letter and a number.');
  process.exit(1);
}

try {
  await connectDatabase();
  const email = 'demo.organizer@campus.local';
  let organizer = await User.findOne({ email });
  if (!organizer) organizer = await User.create({ name: 'Campus Organizer', email, passwordHash: await bcrypt.hash(password, 12), role: 'organizer' });
  await Event.deleteMany({ organizer: organizer._id });
  const tomorrow = new Date(); tomorrow.setUTCDate(tomorrow.getUTCDate() + 1); tomorrow.setUTCHours(11, 0, 0, 0);
  const events = [
    { title: 'Open Mic on the Lawn', description: 'Bring a song, a poem, or just your best listening ears. Students from every corner of campus are welcome.', category: 'Arts & Culture', venue: 'South Lawn', startsAt: new Date(tomorrow), endsAt: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000) },
    { title: 'Designing for the Real World', description: 'A practical workshop where students share project work, get feedback, and meet people building useful things.', category: 'Workshop', venue: 'Innovation Hall, Room 204', startsAt: new Date(tomorrow.getTime() + 30 * 60 * 60 * 1000), endsAt: new Date(tomorrow.getTime() + 32 * 60 * 60 * 1000) },
    { title: 'Community Garden Morning', description: 'Spend a relaxed morning planting herbs, learning about campus sustainability, and meeting fellow volunteers.', category: 'Community', venue: 'East Campus Garden', startsAt: new Date(tomorrow.getTime() + 56 * 60 * 60 * 1000), endsAt: new Date(tomorrow.getTime() + 58 * 60 * 60 * 1000) }
  ];
  await Event.insertMany(events.map((event) => ({ ...event, organizer: organizer._id, status: 'published' })));
  console.log('Created 3 demonstration events for demo.organizer@campus.local.');
} catch (error) {
  console.error('Could not seed demonstration events:', error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}

