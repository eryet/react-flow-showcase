# React Flow Showcase - AI Coding Instructions

## Project Overview

This is a React Flow v12 showcase demonstrating dynamic pricing calculations through a node-based editor. Users drag product, extra charge, and total price nodes onto a canvas, connect them, and watch real-time calculations propagate through the graph.

**Tech Stack**: React 18, TypeScript, @xyflow/react v12, Zustand, Immer, Tailwind CSS, Vite

## Architecture & Data Flow

### Core Pattern: Edge-Driven Calculations

Calculations trigger when nodes connect/disconnect, NOT on user input. This is the defining pattern of the app:

1. **ProductInfoNode** → calculates `subTotal` locally from user inputs
2. **Connections to TotalPriceNode** → `useProductInfoConnections` hook subscribes to connected ProductInfo nodes' `subTotal` changes
3. **ExtraChargeNode** → when connected to TotalPriceNode, applies fees/discounts via `useExtraChargeConnections`

**Key Files**:

- `src/hooks/useProductInfoConnections.ts` - Uses `useHandleConnections` + store subscription for reactive edge updates
- `src/hooks/useExtraChargeConnections.ts` - Similar pattern for final amount calculations
- `src/helper/` - Pure calculation functions (calculateSubtotal, calculateTotalSubtotal, calculateFinalAmount)

### State Management

- **React Flow internal state**: Manages nodes/edges via `useNodesState` and `useEdgesState`
- **Immer for immutability**: All node data updates use `produce()` - see `updateNodeData` patterns in node components
- **No global store**: Zustand is listed as dependency but NOT used - state lives in React Flow's store
- **LocalStorage persistence**: `useLocalNodesHandlers` hook saves/restores entire flow state (nodes + edges + viewport)

### Custom Hooks Pattern

Each hook follows a consistent structure:

```typescript
// 1. Use useHandleConnections for reactive edge tracking
const connections = useHandleConnections({ type: "target", id: `tp-${id}` });

// 2. Subscribe to React Flow store for state changes
const { subscribe } = useStoreApi();
useEffect(() => {
  const unsubscribe = subscribe((state, prevState) => {
    // Compare relevant node data and trigger updates
  });
  return () => unsubscribe();
}, [connections]);
```

See `useProductInfoConnections.ts` lines 40-62 for the canonical example.

### Type System Conventions

- **Node data types**: Each node exports its data type (e.g., `ProductInfo`, `TotalPrice`, `ExtraCharge`) AND a typed node variant (e.g., `NodeProductInfo = Node<ProductInfo>`)
- **Union type for all node data**: `src/types/nodeInterfaces.ts` defines `NodeData` union - used for generic node operations
- **Handle validation**: Use `isValidConnection` callbacks on `<Handle>` components to enforce connection rules (see ProductInfoNode line 116)

## Development Workflows

### Running the App

```bash
pnpm install    # First time setup
pnpm dev        # Start dev server (Vite)
pnpm build      # TypeScript compile + Vite build
pnpm lint       # ESLint check
```

### Adding a New Node Type

1. Create component in `src/nodes/` exporting data type and typed node type
2. Register in `src/nodes/index.ts` nodeTypes object
3. Add creation logic in `src/utils/createNodeData.ts`
4. Update `NodeData` union in `src/types/nodeInterfaces.ts`
5. Add drag handler in `Sidebar.tsx` if node should be user-creatable

### Debugging React Flow Issues

- **Connection validation**: Check `isValidConnection` callbacks on `<Handle>` components
- **State updates not triggering**: Verify Immer `produce()` wraps all mutations
- **Edge calculations wrong**: Console.log in `subscribe()` callbacks to see state diffs
- **LocalStorage corruption**: Use browser DevTools → Application → LocalStorage to inspect/clear saved flows

## Project-Specific Patterns

### Immutable Updates with Immer

ALWAYS use `produce()` when updating node data:

```typescript
setNodes((nodes) =>
  produce(nodes as NodeProductInfo[], (draft) => {
    const node = draft.find((node) => node.id === id);
    if (node?.data?.productInfo) {
      node.data.productInfo.field = value;
    }
  })
);
```

### Manual Storage Events for Same-Tab Updates

LocalStorage events don't fire in the same tab by default. `useLocalNodesHandlers.ts` manually dispatches `StorageEvent` (see lines 46-47, 85-86) to trigger `useStorageEventListener` hook.

### Custom Node Change Handler

React Flow's default `applyNodeChanges` doesn't handle dimension changes properly. `useCustomNodesChanges.ts` implements a custom change handler with special dimension/measured property handling (lines 17-31).

### Connection Mode

App uses `ConnectionMode.Strict` (flow.tsx line 96) - edges must start from source handle and end at target handle. This enforces the directional calculation flow.

### Chinese UI Text

All user-facing text is in Traditional Chinese (商品, 金額小計, etc.). Keep this convention when adding new UI elements.

## Critical Files Reference

- `src/flow.tsx` - Main canvas, drag-and-drop handling, storage hooks initialization
- `src/nodes/ProductInfoNode.tsx` - Product input fields, local subtotal calculation
- `src/nodes/TotalPriceNode.tsx` - Aggregates connected products, applies extra charges (dual handle pattern)
- `src/hooks/useLocalNodesHandlers.ts` - Save/restore/delete flows to/from LocalStorage
- `src/helper/calculateSubtotal.ts` - Pricing logic: (effectivePrice × amount) - (refunds × effectivePrice) - cancellationFee

## Common Tasks

**To modify calculation logic**: Edit pure functions in `src/helper/` and ensure they return string values (nodes store numbers as strings)

**To add validation**: Implement in `createOnChangeHandlerWithValidation` pattern (see ExtraChargeNode.tsx lines 53-67 for percentage validation example)

**To debug edge connections**: Log `connections` array from `useHandleConnections` - it contains `{ source, target, sourceHandle, targetHandle }`

**To change node appearance**: Edit Tailwind classes in node components (all use consistent `bg-white shadow-xl rounded-lg` base)
