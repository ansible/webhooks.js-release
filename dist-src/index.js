import { createLogger } from "./createLogger";
import { createEventHandler } from "./event-handler/index";
import { sign, verify } from "@octokit/webhooks-methods";
import { verifyAndReceive } from "./verify-and-receive";
import { createNodeMiddleware } from "./middleware/node/index";
import { emitterEventNames } from "./generated/webhook-names";
class Webhooks {
  constructor(options) {
    if (!options || !options.secret) {
      throw new Error("[@octokit/webhooks] options.secret required");
    }
    const state = {
      eventHandler: createEventHandler(options),
      secret: options.secret,
      hooks: {},
      log: createLogger(options.log)
    };
    this.sign = sign.bind(null, options.secret);
    this.verify = verify.bind(null, options.secret);
    this.on = state.eventHandler.on;
    this.onAny = state.eventHandler.onAny;
    this.onError = state.eventHandler.onError;
    this.removeListener = state.eventHandler.removeListener;
    this.receive = state.eventHandler.receive;
    this.verifyAndReceive = verifyAndReceive.bind(null, state);
  }
}
export {
  Webhooks,
  createEventHandler,
  createNodeMiddleware,
  emitterEventNames
};
