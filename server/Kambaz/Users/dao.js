/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    USER DAO - Data Access Object                          ║
 * ║                         Created by Alara                                  ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * The DAO pattern keeps my database logic separate from my routes.
 * All MongoDB queries for users live here - clean and organized!
 */

import bcrypt from "bcryptjs";
import UserModel from "./model.js";

// ═══════════════════════════════════════════════════════════════════════════
// PASSWORDS - stored as bcrypt hashes, never as plain text
// ═══════════════════════════════════════════════════════════════════════════

const SALT_ROUNDS = 10;
const isHashed = (value) => typeof value === "string" && /^\$2[aby]\$\d{2}\$/.test(value);
const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

// ═══════════════════════════════════════════════════════════════════════════
// CRUD OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════

export const findAllUsers = () => UserModel.find();

export const findUserById = (userId) => UserModel.findOne({ _id: userId });

export const findUserByUsername = (username) => UserModel.findOne({ username });

export const findUserByCredentials = async (username, password) => {
  if (typeof password !== "string" || !password) return null;
  const user = await UserModel.findOne({ username });
  if (!user) return null;
  if (isHashed(user.password)) {
    return (await bcrypt.compare(password, user.password)) ? user : null;
  }
  // Accounts created before passwords were hashed: check the old plain-text
  // value once, then replace it with a hash so it is never stored in the clear again.
  if (user.password !== password) return null;
  user.password = await hashPassword(password);
  await user.save();
  return user;
};

export const createUser = async (user) => {
  const newUser = { ...user, _id: user._id || new Date().getTime().toString() };
  if (typeof newUser.password === "string" && newUser.password) {
    newUser.password = await hashPassword(newUser.password);
  }
  return UserModel.create(newUser);
};

export const updateUser = async (userId, user) => {
  const changes = { ...user };
  if ("password" in changes) {
    if (typeof changes.password === "string" && changes.password) {
      changes.password = await hashPassword(changes.password);
    } else {
      delete changes.password;   // a blank password field never overwrites the real one
    }
  }
  return UserModel.findOneAndUpdate({ _id: userId }, { $set: changes }, { new: true });
};

export const deleteUser = (userId) => UserModel.findOneAndDelete({ _id: userId });

export const findUsersByRole = (role) => UserModel.find({ role });
