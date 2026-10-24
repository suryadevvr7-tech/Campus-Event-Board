import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { COOKIE_NAME, sessionCookieOptions, signSession } from '../middleware/auth.js';
import { HttpError } from '../utils/httpError.js';

const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email, role: user.role });

export async function register(req, res) {
  const { name, email, password, role } = req.body;
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, role });
  res.cookie(COOKIE_NAME, signSession(user.id), sessionCookieOptions());
  res.status(201).json({ user: publicUser(user) });
}

export async function login(req, res) {
  const user = await User.findOne({ email: req.body.email }).select('+passwordHash');
  const valid = user && await bcrypt.compare(req.body.password, user.passwordHash);
  if (!valid) throw new HttpError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.');
  res.cookie(COOKIE_NAME, signSession(user.id), sessionCookieOptions());
  res.json({ user: publicUser(user) });
}

export function currentUser(req, res) {
  res.json({ user: publicUser(req.user) });
}

export function logout(_req, res) {
  res.clearCookie(COOKIE_NAME, { ...sessionCookieOptions(), maxAge: undefined });
  res.json({ message: 'You have been signed out.' });
}

