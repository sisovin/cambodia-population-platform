export declare class APIClient {
    private baseURL;
    private tenantId;
    constructor(baseURL?: string);
    private request;
    login(credentials: {
        email: string;
        password: string;
    }): Promise<any>;
    register(userData: any): Promise<any>;
    searchCitizens(query: string): Promise<any>;
    getCitizen(id: string): Promise<any>;
}
export declare const apiClient: APIClient;
//# sourceMappingURL=index.d.ts.map