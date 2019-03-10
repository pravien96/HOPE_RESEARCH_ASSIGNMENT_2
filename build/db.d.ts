export declare function createDB(): void;
export declare function createCollection(name: string): void;
export declare function saveAll(collectionName: any, data: any): void;
export declare function truncateCollection(name: string): void;
export declare function updateUser(userid: string, field: string, value: string, response: any): void;
export declare function getUser(userid: any, response: any): void;
export declare function getAllUsers(response: any): void;
export declare function getAllUsersWithPost(userid: string, response: any): void;
