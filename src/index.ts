const StateManager = {
	Listener: import("./Listener").expect().default,
	Replicator: import("./Replicator").expect().default,
	State: import("./Local").expect().default,

	None: import("./None").expect().default,
	
	createState: import("./create").expect().default,
	unmount: import("./unmount").expect().default
};

export = StateManager;
