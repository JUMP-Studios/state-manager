/* eslint-disable roblox-ts/no-private-identifier */
import { Players, RunService } from "@rbxts/services";
import State from "./Local";
import { Creatable, MapToNone } from "./util";
import Objects from "./Objects";

type ValueInstance = CreatableInstances[Creatable];
type ListenerProps = { name: string; isPersonalized: boolean }

export default class StateListener<S = {}, P = {}> extends State<S, P & ListenerProps> {
	private replicator!: Folder;
	private events = [] as RBXScriptConnection[];

	constructor(props: P) {
		super(props as P & ListenerProps)

		const addState = (child: ValueInstance) => {
			const name = child.Name;

			this.setState({
				[name]: child.Value,
			} as MapToNone<S>);

			child.GetPropertyChangedSignal("Value").Connect(() => {
				this.setState({
					[name]: child.Value,
				} as MapToNone<S>);
			});
		};

		this.replicator = (
			this.props.isPersonalized ? Players.LocalPlayer.WaitForChild("PlayerGui") : Objects.Folder
		).WaitForChild(this.props.name) as Folder;
		this.events = [
			this.replicator.ChildAdded.Connect((child) => addState(child as ValueInstance)),
			this.replicator.ChildRemoved.Connect((child) => addState(child as ValueInstance)),
			this.replicator.Destroying.Connect(() => {
				this.events.forEach((connection) => connection.Disconnect());
				this.events.clear();
			}),
		];

		(this.replicator.GetChildren() as ValueInstance[]).forEach(addState);
	}
	setState(newState: MapToNone<S>) {
		this.update(newState);
	}
}