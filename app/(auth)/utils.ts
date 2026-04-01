import * as SecureStore from "expo-secure-store";

export const validateEmail = (email: string): boolean => {
  return Boolean(
    email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  );
};

export const validatePassword = (password: string): boolean => {
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
};

export type StoredUser = {
  fullName: string;
  email: string;
  password: string;
};

const STORAGE_KEYS = {
  user: "auth_user",
  session: "auth_session",
} as const;

const safeGetItem = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
};

const safeSetItem = async (key: string, value: string): Promise<boolean> => {
  try {
    await SecureStore.setItemAsync(key, value);
    return true;
  } catch {
    return false;
  }
};

const safeRemoveItem = async (key: string): Promise<boolean> => {
  try {
    await SecureStore.deleteItemAsync(key);
    return true;
  } catch {
    return false;
  }
};

export const registerLocalUser = async (user: StoredUser): Promise<void> => {
  await safeSetItem(STORAGE_KEYS.user, JSON.stringify(user));
};

export const getRegisteredUser = async (): Promise<StoredUser | null> => {
  const raw = await safeGetItem(STORAGE_KEYS.user);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
};

export const loginLocalSession = async (): Promise<void> => {
  await safeSetItem(STORAGE_KEYS.session, "true");
};

export const logoutLocalSession = async (): Promise<void> => {
  await safeRemoveItem(STORAGE_KEYS.session);
};

export const isLocalSessionActive = async (): Promise<boolean> => {
  const raw = await safeGetItem(STORAGE_KEYS.session);
  return raw === "true";
};
