import StateListener from "./Listener";
import State from "./Local";
import None from "./None";
import StateReplicator from "./Replicator";
import createState from "./create";
import unmount from "./unmount";

const StateManager = {
	Listener: StateListener,
	Replicator: StateReplicator,
	State: State,

	None: None,
	
	createState: createState,
	unmount: unmount
};

export = StateManager;
