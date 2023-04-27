# Model building configuration

This file outlines KG-related structure of a model building configuration.

```
[E] ModelBuildingConfig
├── [E] CellCompositionConfig
│   └── [F:json] CellCompositionConfigPayload
├── [E] CellPositionConfig
│   └── [F:json] CellPositionConfigPayload
├── [E] EModelAssignmentConfig
│   └── [F:json] EModelAssignmentConfigPayload
├── [E] MorphologyAssignmentConfig
│   └── [F:json] MorphologyAssignmentConfigPayload
├── [E] MacroConnectomeConfig
│   └── [F:json] MacroConnectomeConfigPayload
│       ├── [E] WholeBrainConnectomeStrength (initial)
│       │   └── [F:arrow] WholeBrainConnectomeStrengthTable
│       └── [E] WholeBrainConnectomeStrength (overrides)
│           └── [F:arrow] WholeBrainConnectomeStrengthTable
└── [E] MicroConnectomeConfig
    └── [F:json] MicroConnectomeConfigPayload


Legend:
* [E] KG Entity.
* [F:<type>] KG file of a specific type.

```
