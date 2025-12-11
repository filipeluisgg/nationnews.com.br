import { createRouter } from "next-connect";
import activation from "models/activation.js";
import controller from "infra/controller.js";

const router = createRouter();

router.use(controller.injectAnonymousOrAuthenticatedUser);
router.patch(controller.canRequest("read:activation_token"), patchHandler);
router.patch(patchHandler);

export default router.handler(controller.errorHandlers);

async function patchHandler(request, response) {
	const activationTokenId = request.query.token_id;

	const validActivationToken = await activation.findOneValidById(activationTokenId);
	await activation.activateUserByUserId(validActivationToken.user_id);
	const usedActivationToken = await activation.markTokenAsUsed(activationTokenId);

	return response.status(200).json(usedActivationToken);
}
