// Mock user database
const TEST_USERS = [
  {
    id: '1',
    email: 'test@tribes.com',
    username: 'testuser',
    password: 'test123', // In a real app, this would be hashed
  },
  {
    id: '2',
    email: 'admin@tribes.com',
    username: 'admin',
    password: 'admin123',
  },
];

interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    username: string;
  };
  error?: string;
}

export const mockAuthService = {
  login: async (identifier: string, password: string): Promise<AuthResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find user by either email or username
    const user = TEST_USERS.find(
      u => (u.email === identifier || u.username === identifier) && u.password === password
    );

    if (user) {
      // Don't include password in the response
      const { password: _, ...safeUser } = user;
      return {
        success: true,
        user: safeUser,
      };
    }

    return {
      success: false,
      error: 'Invalid email/username or password',
    };
  },

  register: async (email: string, username: string, password: string): Promise<AuthResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if email or username already exists
    const existingUser = TEST_USERS.find(
      u => u.email === email || u.username === username
    );

    if (existingUser) {
      return {
        success: false,
        error: 'Email or username already in use',
      };
    }

    // Create new user
    const newUser = {
      id: (TEST_USERS.length + 1).toString(),
      email,
      username,
      password, // In a real app, this would be hashed
    };

    TEST_USERS.push(newUser);

    // Don't include password in the response
    const { password: _, ...safeUser } = newUser;
    return {
      success: true,
      user: safeUser,
    };
  },
};
