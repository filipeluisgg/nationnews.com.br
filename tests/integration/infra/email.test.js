import orchestrator from "tests/orchestrator.js";
import email from "infra/email.js";

beforeAll(async () => {
	await orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
	test("send()", async () => {
		await orchestrator.deleteAllEmails();

		await email.send({
			from: "NationNews <origem@nationnews.com.br>",
			to: "destino@nationnews.com.br",
			subject: "Teste de assunto",
			text: "Teste de corpo.",
		});

		await email.send({
			from: "NationNews <origem@nationnews.com.br>",
			to: "destino@nationnews.com.br",
			subject: "Último email enviado",
			text: "Corpo do último email.",
		});

		const lastEmail = await orchestrator.getLastEmail();

		expect(lastEmail.sender).toBe("<origem@nationnews.com.br>");
		expect(lastEmail.recipients[0]).toBe("<destino@nationnews.com.br>");
		expect(lastEmail.subject).toBe("Último email enviado");
		expect(lastEmail.text).toBe("Corpo do último email.\r\n");
	});
});
