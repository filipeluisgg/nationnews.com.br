//This file should contain the tests while the server and DB are not working.
import database from "infra/database";
import retry from "async-retry";
import migrator from "models/migrator.js";

async function waitForAllServices() {
	await waitForWebServer();

	async function waitForWebServer() {
		return retry(fetchStatusPage, {
			retries: 100,
			maxTimeout: 1000,
		});

		async function fetchStatusPage() {
			const response = await fetch("http://localhost:3000/api/v1/status");

			if (response.status !== 200) {
				throw Error();
			}
		}
	}
}

async function clearDatabase() {
	await database.query("DROP SCHEMA PUBLIC CASCADE; CREATE SCHEMA PUBLIC;");
}

async function runPendingMigrations() {
	await migrator.runPendingMigrations();
}

const orchestrator = {
	waitForAllServices,
	clearDatabase,
	runPendingMigrations,
};
export default orchestrator;
