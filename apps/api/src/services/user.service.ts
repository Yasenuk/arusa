import { prisma } from '../db/prisma';

export async function createUser(first_name: string, last_name: string, middle_name: string, email: string, password_hash: string) {
	return await prisma.users.create({
		data: {
			first_name,
			last_name,
			middle_name,
			email,
			password_hash
		}
	});
}

export async function getUsers() {
	return await prisma.users.findMany();
}

export async function getUserById(id: number) {
	return await prisma.users.findUnique({
		where: { id }
	});
}
