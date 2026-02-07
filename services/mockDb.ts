
import { User, Job, AssessmentAttempt, UserRole } from "../types";

const DB_KEYS = {
  USERS: 'assesspro_users',
  JOBS: 'assesspro_jobs',
  ATTEMPTS: 'assesspro_attempts',
  CURRENT_USER: 'assesspro_current_user'
};

const getFromStorage = <T,>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const mockDb = {
  getUsers: (): User[] => getFromStorage(DB_KEYS.USERS, []),
  
  addUser: (user: User) => {
    const users = mockDb.getUsers();
    saveToStorage(DB_KEYS.USERS, [...users, user]);
  },

  getJobs: (): Job[] => {
    return getFromStorage(DB_KEYS.JOBS, []);
  },

  addJob: (job: Job) => {
    const jobs = getFromStorage(DB_KEYS.JOBS, []);
    saveToStorage(DB_KEYS.JOBS, [...jobs, job]);
  },

  updateJob: (updatedJob: Job) => {
    const jobs = getFromStorage(DB_KEYS.JOBS, []);
    saveToStorage(DB_KEYS.JOBS, jobs.map(j => j.id === updatedJob.id ? updatedJob : j));
  },

  getAttempts: (): AssessmentAttempt[] => getFromStorage(DB_KEYS.ATTEMPTS, []),

  addAttempt: (attempt: AssessmentAttempt) => {
    const attempts = mockDb.getAttempts();
    saveToStorage(DB_KEYS.ATTEMPTS, [...attempts, attempt]);
  },

  getCurrentUser: (): User | null => getFromStorage(DB_KEYS.CURRENT_USER, null),
  setCurrentUser: (user: User | null) => saveToStorage(DB_KEYS.CURRENT_USER, user),
  
  logout: () => {
    localStorage.removeItem(DB_KEYS.CURRENT_USER);
  }
};
