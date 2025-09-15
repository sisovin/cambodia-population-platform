export interface User {
    id: string;
    email: string;
    name: string;
    tenantId: string;
    role: 'admin' | 'registrar' | 'citizen';
}
export interface Citizen {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'M' | 'F';
    address: string;
    tenantId: string;
    createdAt: string;
    updatedAt: string;
}
export interface AuthResponse {
    token: string;
    user: User;
}
export interface APIError {
    message: string;
    code: string;
}
//# sourceMappingURL=index.d.ts.map