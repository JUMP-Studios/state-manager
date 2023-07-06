import StateListener from "./Listener";
import State from "./Local";
import StateReplicator from "./Replicator";

function unmount(manager: StateListener | State | StateReplicator) {
	if (manager["willBeDestroyed"] !== undefined) {
		manager.willBeDestroyed();
	}
}

export = unmount;
