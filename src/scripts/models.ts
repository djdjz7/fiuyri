export interface LoginRequest {
    userName: string;
    password: string;
    clientType: number;
}


export interface LoginResponse {
	clientCode: string;
	accessToken: string;
	rongCloudToken: any;
	expireInSeconds: number;
	userId: number;
	roleType: number;
	mobile: any;
	needChangePwd: boolean;
	refreshToken: string;
	refreshExpireInSeconds: number;
	needSmsVerification: boolean;
}

export interface NoteInfo {
    fileId: string;
    fileName: string;
    fileUrl: string;
    parentId: string;
    type: number;
    createTime: string;
    updateTime: string;
    version: number;
    shared: boolean;
}

export interface GetAllNotesResponse
{
    userId: number;
    schoolCode: string;
    totalCount: number;
    noteList: NoteInfo[];
}

export interface StorageCredential {
    strategy: string;
    appId: any;
    bucket: string;
    endpoint: string;
    region: string;
    accessKeyId: string;
    accessKeySecret: string;
    securityToken: string;
    expiration: string;
}

export interface ValidationError {
	message: string;
	members: string[];
}

export interface Error {
	code: number;
	message: string;
	details: string;
	validationErrors: ValidationError[];
}

export interface CommonResponse {
	result: any;
	targetUrl?: any;
	success: boolean;
	error: Error;
	unAuthorizedRequest: boolean;
	__abp: boolean;
}

export interface NoteCommonResponse {
    code: number;
    data: string;
    message: string;
}