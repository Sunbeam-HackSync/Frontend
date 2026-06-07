// src/features/auth/services/authService.js

import { mockUsers } from "../../../mock/mockUsers";

import { platformRoles } from "../../../mock/platformRoles";

const USERS_KEY = "hackforge_users";

const AUTH_KEY = "hackforge_auth";

function initializeUsers() {
  const existingUsers = localStorage.getItem(USERS_KEY);

  if (!existingUsers) {
    localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
    return;
  }

  const users = JSON.parse(existingUsers);
  const userIds = new Set(users.map((user) => user.id));
  const mergedUsers = [
    ...users,
    ...mockUsers.filter((user) => !userIds.has(user.id)),
  ];

  localStorage.setItem(USERS_KEY, JSON.stringify(mergedUsers));
}

initializeUsers();

export function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function registerUser(userData) {
  const users = getUsers();

  const existingUser = users.find((user) => user.email === userData.email);

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const newUser = {
    id: crypto.randomUUID(),

    fullName: userData.fullName,

    email: userData.email,

    password: userData.password,

    avatarUrl: "",

    bio: "New HackForge member ready to join hackathons.",

    githubUrl: "",

    linkedinUrl: "",

    portfolioUrl: "",

    techStack: [],
  };

  users.push(newUser);

  saveUsers(users);

  return newUser;
}

export async function loginUser(email, password) {
  const users = getUsers();

  const user = users.find(
    (user) => user.email === email && user.password === password,
  );

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const userPlatformRoles = platformRoles
    .filter((item) => item.userId === user.id)
    .map((item) => item.role);

  const authData = {
    user: {
      id: user.id,

      fullName: user.fullName,

      email: user.email,

      bio: user.bio,

      githubUrl: user.githubUrl,

      linkedinUrl: user.linkedinUrl,

      portfolioUrl: user.portfolioUrl,

      techStack: user.techStack || [],
    },

    platformRoles: userPlatformRoles,

    token: crypto.randomUUID(),
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(authData));

  return authData;
}

export function logoutUser() {
  localStorage.removeItem(AUTH_KEY);
}

export function getCurrentAuth() {
  return JSON.parse(localStorage.getItem(AUTH_KEY));
}
