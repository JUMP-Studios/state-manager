import { StateComponent } from "./util";

function unmount(manager: StateComponent) {
	if (manager["willBeDestroyed"] !== undefined) {
		manager.willBeDestroyed();
	}
}

export = unmount;
