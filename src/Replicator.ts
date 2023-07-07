import Object from "@rbxts/object-utils";
import State from "./Local";
import { Creatable, AllowedValues, StateInstances, MapToNone } from "./util";
import Objects from "./Objects";

type ReplicatorProps<S> = {
	name: string, 
	doNotReplicate?: (keyof S)[], 
	personalized?: Player
}

export default class StateReplicator<S = {}, P = {}> extends State<S, P & ReplicatorProps<S>> {
	private instances = {} as StateInstances<S> & Record<string, Instance>

	constructor(props: P & ReplicatorProps<S>) {
		super(props)

		const { personalized } = this.props
		const mainInstance = new Instance("Folder");
		mainInstance.Name = this.props.name;
		mainInstance.Parent = personalized ? personalized.FindFirstChild("PlayerGui") : Objects.Folder;

		this.instances = { main: mainInstance } as Record<string, Instance> & StateInstances<S>;

		for (const [state, value] of Object.entries(this.state as Record<string, string>)) {
			if (this.props.doNotReplicate?.includes(state as keyof S)) continue;

			const stateInstance = new Instance(determineValueType(value));
			stateInstance.Value = value;
			stateInstance.Name = state;
			stateInstance.Parent = this.instances.main;

			(this.instances[state] as StringValue) = stateInstance as StringValue;
		}
	}
	protected setState(stateUpdate: MapToNone<S>) {
		for (const [state, value] of Object.entries(stateUpdate)) {
			if (!this.props.doNotReplicate?.includes(state as keyof S)) {
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
}

function determineValueType(value: AllowedValues): Creatable {
	return instanceTypes[type(value)];
}

const instanceTypes = {
	string: "StringValue",
	number: "NumberValue",
	boolean: "BoolValue",
	vector: "Vector3Value",
	table: "StringValue",
	userdata: "ObjectValue",
} as Record<ReturnType<typeof type>, Creatable>;