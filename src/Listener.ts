/* eslint-disable roblox-ts/no-private-identifier */
import { Players } from "@rbxts/services";
import State from "./Local";
import { Creatable, MapToNone } from "./util";
import Objects from "./Objects";

type ValueInstance = CreatableInstances[Creatable];

export default class StateListener<S = {}, P = {}> extends State<S, P> {
	private replicator: Folder;
	private events: RBXScriptConnection[];

	constructor(name: string, isPersonalized?: boolean) {
		super();

		const addState = (child: ValueInstance) => {
			const name = child.Name;

			this.setState({
				[name]: child.Value as S[keyof S],
			} as MapToNone<S>);

			child.GetPropertyChangedSignal("Value").Connect(() => {
				this.setState({
					[name]: child.Value as unknown,
				} as MapToNone<S>);
			});
		};

		this.replicator = (
			isPersonalized ? Players.LocalPlayer.WaitForChild("PlayerGui") : Objects.Folder
		).WaitForChild(name) as Folder;
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
