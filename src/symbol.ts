const SymbolObject = (name: string) => {
	name = name ?? "";

	return setmetatable(
		{},
		{
			__tostring: () => {
				return `sym(${name})`;
			},
		},
	) as symbol;
};

export = SymbolObject;
