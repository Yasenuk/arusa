import { prisma } from '../db/prisma';

export async function getPayments() {
	return await prisma.payments.findMany({
		where: { status: "SUCCESS" }
	});
}

