type UserOperationType = "submit_hw" | "submit_schedule" | "setup";

export interface UserOperation<T> {
	type: UserOperationType,
	data: T,
	currentStep: number
}

const currentOperations: Record<number, UserOperation<any>> = {};

export async function getCurrentUserOperation<T>(userId: number): Promise<UserOperation<T> | null> {
	return currentOperations[userId];
}

export async function setCurrentUserOperation<T>(userId: number, operation: UserOperation<T>) {
	currentOperations[userId] = operation;
}

export async function removeCurrentUserOperation(userId: number) {
	delete currentOperations[userId];
}