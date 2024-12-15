// Mock authentication service for development
export class MockAuthService {
  private static instance: MockAuthService;
  private userInfo: any = null;

  private constructor() {}

  static getInstance() {
    if (!MockAuthService.instance) {
      MockAuthService.instance = new MockAuthService();
    }
    return MockAuthService.instance;
  }

  async login() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.userInfo = {
      id: 'mock-user-' + Math.random().toString(36).substr(2, 9),
      email: 'demo@example.com',
      wallet: '0x' + Math.random().toString(36).substr(2, 40)
    };
    
    return this.userInfo;
  }

  async logout() {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.userInfo = null;
  }

  getUser() {
    return this.userInfo;
  }
}

export const mockAuth = MockAuthService.getInstance();