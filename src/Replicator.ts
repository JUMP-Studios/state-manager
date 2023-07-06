import Object from "@rbxts/object-utils";
import State from "./Local";
import { Creatable, AllowedValues, StateInstances, MapToNone } from "./util";
import Objects from "./Objects";

const instanceTypes = {
	string: "StringValue",
	number: "NumberValue",
	boolean: "BoolValue",
	vector: "Vector3Value",
	table: "StringValue",
	userdata: "ObjectValue",
} as Record<ReturnType<typeof type>, Creatable>;

function determineValueType(value: AllowedValues): Creatable {
	return instanceTypes[type(value)];
}

export default class StateReplicator<T = {}> extends State<T> {
	private instances: StateInstances<T> & Record<string, Instance>;
	private doNotReplicate?: string[];

	protected setState(stateUpdate: MapToNone<T>) {
		for (const [state, value] of Object.entries(stateUpdate)) {
			if (!this.doNotReplicate?.includes(state as string)) {
				if (this.instances[state as string] === undefined) {
					const stateInstance = new Instance(determineValueType(value as AllowedValues));
					stateInstance.Name = state as string;
					stateInstance.Parent = this.instances.main;

					(this.instances[state as string] as StringValue) = stateInstance as StringValue;
				}

				(this.instances[state as string] as StringValue).Value = value as string;
			}
		}

		this.update(stateUpdate);
	}
	constructor(name: string, states: T, doNotReplicate?: (keyof T)[], personalized?: Player) {
		super();

		const mainInstance = new Instance("Folder");
		mainInstance.Name = name;
		mainInstance.Parent = personalized ? personalized.FindFirstChild("PlayerGui") : Objects.Folder;

		this.instances = { main: mainInstance } as Record<string, Instance> & StateInstances<T>;
		this.doNotReplicate = doNotReplicate as string[];

		for (const [state, value] of Object.entries(states as Record<string, AllowedValues>)) {
			if (this.doNotReplicate?.includes(state)) continue;

			const stateInstance = new Instance(determineValueType(value));
			stateInstance.Value = value;
			stateInstance.Name = state;
			stateInstance.Parent = this.instances.main;

			(this.instances[state] as StringValue) = stateInstance as StringValue;
		}
	}
}
