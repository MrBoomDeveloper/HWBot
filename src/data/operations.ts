import { CommandRequestAuthor } from "./commands";

export enum UserOperationType {
	PUBLISH_HOMEWORK, PUBLISH_SCHEDULE, SETUP, SUBSCRIBE
}

export interface OperationAs {
	school?: string,
	clazz?: string,
	clazzSection?: string,
	role?: "student" | "teacher" | "guest"
}

export interface PublishMessageOperation extends OperationAs {
	photos?: string[],
	text?: string
}

export interface UserOperation<T> {
	type: UserOperationType,
	data: T
}

const currentOperations: Record<number, UserOperation<any>> = {};

export async function getCurrentUserOperation<T>(user: CommandRequestAuthor): Promise<UserOperation<T> | null> {
	return currentOperations[user.id];
}

export async function setCurrentUserOperation<T>(user: CommandRequestAuthor, operation: UserOperation<T>) {
	currentOperations[user.id] = operation;
}

export async function removeCurrentUserOperation(user: CommandRequestAuthor) {
	delete currentOperations[user.id];
}