import { ReplicatedStorage, RunService } from "@rbxts/services";
import { Creatable } from "./util";

type Container = Folder & Record<string, CreatableInstances[Creatable]>;

let stateFolder: Container;

if (RunService.IsServer() === true) {
	stateFolder = new Instance("Folder") as Container;
	stateFolder.Name = "States";
	stateFolder.Parent = ReplicatedStorage;
} else {
	stateFolder = ReplicatedStorage.WaitForChild("States") as Container;
}

export default {
	Folder: stateFolder,
};
