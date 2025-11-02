# Class: Screen

Defined in: [packages/core/src/widgets/screen.ts:90](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L90)

Screen - The top-level container and rendering engine for terminal UI applications.

## Remarks

Screen manages the terminal, handles rendering, processes input, and serves as the root
container for all widgets. It provides:

- **Terminal management**: Alt screen buffer, cursor control, raw mode
- **Rendering engine**: Efficient screen updates with smart CSR
- **Input handling**: Keyboard and mouse events
- **Widget container**: Root of the widget tree
- **Focus management**: Tracks and manages widget focus

## Examples

```typescript
import { Screen, Box } from "@unblessed/node";

const screen = new Screen({
  smartCSR: true,
  title: "My App",
});

const box = new Box({
  parent: screen,
  top: "center",
  left: "center",
  width: "50%",
  height: "50%",
  content: "Hello World!",
  border: { type: "line" },
});

screen.key(["q", "C-c"], () => {
  screen.destroy();
  process.exit(0);
});

screen.render();
```

```typescript
const screen = new Screen({
  smartCSR: true,
  sendFocus: true,
});

const box = new Box({
  parent: screen,
  mouse: true,
  // ...
});

box.on("click", () => {
  box.setContent("Clicked!");
  screen.render();
});

screen.render();
```

## See

- ScreenOptions for all available configuration options
- [Program](lib.program.Class.Program.md) for low-level terminal control
- Runtime for platform abstraction

## Extends

- [`Node`](widgets.node.Class.Node.md)

## Constructors

### Constructor

> **new Screen**(`options`): `Screen`

Defined in: [packages/core/src/widgets/screen.ts:144](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L144)

#### Parameters

##### options

`ScreenOptions` = `{}`

#### Returns

`Screen`

#### Overrides

[`Node`](widgets.node.Class.Node.md).[`constructor`](widgets.node.Class.Node.md#constructor)

## Properties

### \_events

> **\_events**: `any`

Defined in: [packages/core/src/lib/events.ts:10](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/lib/events.ts#L10)

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`_events`](widgets.node.Class.Node.md#_events)

---

### \_maxListeners?

> `optional` **\_maxListeners**: `number`

Defined in: [packages/core/src/lib/events.ts:11](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/lib/events.ts#L11)

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`_maxListeners`](widgets.node.Class.Node.md#_maxlisteners)

---

### uid

> `static` **uid**: `number` = `0`

Defined in: [packages/core/src/widgets/node.ts:30](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L30)

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`uid`](widgets.node.Class.Node.md#uid)

---

### ScreenRegistry

> `static` **ScreenRegistry**: `any`

Defined in: [packages/core/src/widgets/node.ts:31](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L31)

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`ScreenRegistry`](widgets.node.Class.Node.md#screenregistry)

---

### screen

> **screen**: `any`

Defined in: [packages/core/src/widgets/node.ts:47](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L47)

Reference to the parent Screen instance.
Type: Screen (subclass of Node)

Kept as any due to circular dependency between Node and Screen,
and to preserve access to Screen-specific methods like clearRegion(),
render(), and the program property without complex generic typing.

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`screen`](widgets.node.Class.Node.md#screen)

---

### parent

> **parent**: `any`

Defined in: [packages/core/src/widgets/node.ts:56](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L56)

Reference to the parent element in the widget tree.
Type: Node (can be any Element/Box/List/etc subclass)

Kept as any to avoid complex generic typing and preserve access
to subclass-specific methods. Attempting to type as Node loses
methods from subclasses like Box, List, Form, etc.

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`parent`](widgets.node.Class.Node.md#parent)

---

### children

> **children**: `any`[]

Defined in: [packages/core/src/widgets/node.ts:63](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L63)

Array of child elements.
Type: Node[] (can contain any Node subclasses)

Kept as any[] to preserve flexibility with mixed widget types.

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`children`](widgets.node.Class.Node.md#children)

---

### $

> **$**: `Record`\<`string`, `unknown`\>

Defined in: [packages/core/src/widgets/node.ts:68](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L68)

An object for any miscellaneous user data.

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`$`](widgets.node.Class.Node.md#)

---

### \_

> **\_**: `Record`\<`string`, `unknown`\>

Defined in: [packages/core/src/widgets/node.ts:73](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L73)

An object for any miscellaneous user data.

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`_`](widgets.node.Class.Node.md#_)

---

### data

> **data**: `Record`\<`string`, `unknown`\>

Defined in: [packages/core/src/widgets/node.ts:78](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L78)

An object for any miscellaneous user data.

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`data`](widgets.node.Class.Node.md#data)

---

### uid

> **uid**: `number`

Defined in: [packages/core/src/widgets/node.ts:80](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L80)

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`uid`](widgets.node.Class.Node.md#uid-1)

---

### index

> **index**: `number` = `-1`

Defined in: [packages/core/src/widgets/node.ts:86](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L86)

Render index (document order index) of the last render call.
Indicates the order in which this element was rendered relative to others.
Set to -1 initially, updated during rendering.

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`index`](widgets.node.Class.Node.md#index)

---

### detached?

> `optional` **detached**: `boolean`

Defined in: [packages/core/src/widgets/node.ts:87](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L87)

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`detached`](widgets.node.Class.Node.md#detached)

---

### destroyed?

> `optional` **destroyed**: `boolean`

Defined in: [packages/core/src/widgets/node.ts:88](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L88)

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`destroyed`](widgets.node.Class.Node.md#destroyed)

---

### runtime

> **runtime**: [`Runtime`](runtime.Interface.Runtime.md)

Defined in: [packages/core/src/widgets/node.ts:90](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L90)

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`runtime`](widgets.node.Class.Node.md#runtime)

---

### options

> **options**: `ScreenOptions`

Defined in: [packages/core/src/widgets/screen.ts:91](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L91)

#### Overrides

[`Node`](widgets.node.Class.Node.md).[`options`](widgets.node.Class.Node.md#options)

---

### program

> **program**: `any`

Defined in: [packages/core/src/widgets/screen.ts:92](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L92)

---

### tput

> **tput**: `any`

Defined in: [packages/core/src/widgets/screen.ts:93](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L93)

---

### autoPadding

> **autoPadding**: `boolean`

Defined in: [packages/core/src/widgets/screen.ts:94](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L94)

---

### tabc

> **tabc**: `string`

Defined in: [packages/core/src/widgets/screen.ts:95](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L95)

---

### dockBorders

> **dockBorders**: `any`

Defined in: [packages/core/src/widgets/screen.ts:96](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L96)

---

### ignoreLocked

> **ignoreLocked**: `any`[]

Defined in: [packages/core/src/widgets/screen.ts:97](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L97)

---

### \_unicode

> **\_unicode**: `boolean`

Defined in: [packages/core/src/widgets/screen.ts:98](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L98)

---

### fullUnicode

> **fullUnicode**: `boolean`

Defined in: [packages/core/src/widgets/screen.ts:99](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L99)

---

### dattr

> **dattr**: `number`

Defined in: [packages/core/src/widgets/screen.ts:100](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L100)

---

### renders

> **renders**: `number`

Defined in: [packages/core/src/widgets/screen.ts:101](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L101)

---

### position

> **position**: `any`

Defined in: [packages/core/src/widgets/screen.ts:102](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L102)

---

### left

> **left**: `number`

Defined in: [packages/core/src/widgets/screen.ts:103](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L103)

---

### aleft

> **aleft**: `number`

Defined in: [packages/core/src/widgets/screen.ts:104](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L104)

---

### rleft

> **rleft**: `number`

Defined in: [packages/core/src/widgets/screen.ts:105](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L105)

---

### right

> **right**: `number`

Defined in: [packages/core/src/widgets/screen.ts:106](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L106)

---

### aright

> **aright**: `number`

Defined in: [packages/core/src/widgets/screen.ts:107](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L107)

---

### rright

> **rright**: `number`

Defined in: [packages/core/src/widgets/screen.ts:108](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L108)

---

### top

> **top**: `number`

Defined in: [packages/core/src/widgets/screen.ts:109](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L109)

---

### atop

> **atop**: `number`

Defined in: [packages/core/src/widgets/screen.ts:110](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L110)

---

### rtop

> **rtop**: `number`

Defined in: [packages/core/src/widgets/screen.ts:111](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L111)

---

### bottom

> **bottom**: `number`

Defined in: [packages/core/src/widgets/screen.ts:112](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L112)

---

### abottom

> **abottom**: `number`

Defined in: [packages/core/src/widgets/screen.ts:113](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L113)

---

### rbottom

> **rbottom**: `number`

Defined in: [packages/core/src/widgets/screen.ts:114](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L114)

---

### ileft

> **ileft**: `number`

Defined in: [packages/core/src/widgets/screen.ts:115](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L115)

---

### itop

> **itop**: `number`

Defined in: [packages/core/src/widgets/screen.ts:116](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L116)

---

### iright

> **iright**: `number`

Defined in: [packages/core/src/widgets/screen.ts:117](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L117)

---

### ibottom

> **ibottom**: `number`

Defined in: [packages/core/src/widgets/screen.ts:118](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L118)

---

### iheight

> **iheight**: `number`

Defined in: [packages/core/src/widgets/screen.ts:119](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L119)

---

### iwidth

> **iwidth**: `number`

Defined in: [packages/core/src/widgets/screen.ts:120](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L120)

---

### padding

> **padding**: `any`

Defined in: [packages/core/src/widgets/screen.ts:121](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L121)

---

### hover

> **hover**: `any`

Defined in: [packages/core/src/widgets/screen.ts:122](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L122)

---

### history

> **history**: `any`[]

Defined in: [packages/core/src/widgets/screen.ts:123](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L123)

---

### clickable

> **clickable**: `any`[]

Defined in: [packages/core/src/widgets/screen.ts:124](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L124)

---

### keyable

> **keyable**: `any`[]

Defined in: [packages/core/src/widgets/screen.ts:125](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L125)

---

### grabKeys

> **grabKeys**: `boolean`

Defined in: [packages/core/src/widgets/screen.ts:126](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L126)

---

### lockKeys

> **lockKeys**: `boolean`

Defined in: [packages/core/src/widgets/screen.ts:127](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L127)

---

### \_buf

> **\_buf**: `string`

Defined in: [packages/core/src/widgets/screen.ts:128](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L128)

---

### \_ci

> **\_ci**: `number`

Defined in: [packages/core/src/widgets/screen.ts:129](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L129)

---

### cursor

> **cursor**: `any`

Defined in: [packages/core/src/widgets/screen.ts:130](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L130)

---

### \_listenedMouse?

> `optional` **\_listenedMouse**: `boolean`

Defined in: [packages/core/src/widgets/screen.ts:131](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L131)

---

### \_listenedKeys?

> `optional` **\_listenedKeys**: `boolean`

Defined in: [packages/core/src/widgets/screen.ts:132](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L132)

---

### \_needsClickableSort?

> `optional` **\_needsClickableSort**: `boolean`

Defined in: [packages/core/src/widgets/screen.ts:133](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L133)

---

### mouseDown?

> `optional` **mouseDown**: `any`

Defined in: [packages/core/src/widgets/screen.ts:134](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L134)

---

### lines

> **lines**: `any`[] = `[]`

Defined in: [packages/core/src/widgets/screen.ts:135](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L135)

---

### olines

> **olines**: `any`[] = `[]`

Defined in: [packages/core/src/widgets/screen.ts:136](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L136)

---

### \_borderStops?

> `optional` **\_borderStops**: `any`

Defined in: [packages/core/src/widgets/screen.ts:137](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L137)

---

### debugLog?

> `optional` **debugLog**: `any`

Defined in: [packages/core/src/widgets/screen.ts:138](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L138)

---

### \_hoverText?

> `optional` **\_hoverText**: `any`

Defined in: [packages/core/src/widgets/screen.ts:139](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L139)

---

### \_savedFocus?

> `optional` **\_savedFocus**: `any`

Defined in: [packages/core/src/widgets/screen.ts:140](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L140)

---

### \_cursorBlink?

> `optional` **\_cursorBlink**: `any`

Defined in: [packages/core/src/widgets/screen.ts:141](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L141)

---

### type

> **type**: `string` = `"screen"`

Defined in: [packages/core/src/widgets/screen.ts:142](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L142)

Type of the node (e.g. box, list, form, etc.).
Used to identify the widget type at runtime.

#### Overrides

[`Node`](widgets.node.Class.Node.md).[`type`](widgets.node.Class.Node.md#type)

---

### resetCursor

> `static` **resetCursor**: `any`

Defined in: [packages/core/src/widgets/screen.ts:2788](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2788)

---

### \_exceptionHandler

> `static` **\_exceptionHandler**: `any`

Defined in: [packages/core/src/widgets/screen.ts:2789](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2789)

---

### \_sigtermHandler

> `static` **\_sigtermHandler**: `any`

Defined in: [packages/core/src/widgets/screen.ts:2790](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2790)

---

### \_sigintHandler

> `static` **\_sigintHandler**: `any`

Defined in: [packages/core/src/widgets/screen.ts:2791](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2791)

---

### \_sigquitHandler

> `static` **\_sigquitHandler**: `any`

Defined in: [packages/core/src/widgets/screen.ts:2792](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2792)

---

### \_exitHandler

> `static` **\_exitHandler**: `any`

Defined in: [packages/core/src/widgets/screen.ts:2793](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2793)

---

### \_bound

> `static` **\_bound**: `any`

Defined in: [packages/core/src/widgets/screen.ts:2794](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2794)

---

### bind()

> `static` **bind**: (`screen`) => `void`

Defined in: [packages/core/src/widgets/screen.ts:2795](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2795)

For a given function, creates a bound function that has the same body as the original function.
The this object of the bound function is associated with the specified object, and has the specified initial parameters.

#### Parameters

##### screen

`any`

#### Returns

`void`

## Accessors

### title

#### Get Signature

> **get** **title**(): `string`

Defined in: [packages/core/src/widgets/screen.ts:318](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L318)

Set or get window title.

##### Returns

`string`

#### Set Signature

> **set** **title**(`title`): `void`

Defined in: [packages/core/src/widgets/screen.ts:322](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L322)

##### Parameters

###### title

`string`

##### Returns

`void`

---

### terminal

#### Get Signature

> **get** **terminal**(): `string`

Defined in: [packages/core/src/widgets/screen.ts:329](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L329)

Set or get terminal name. Set calls screen.setTerminal() internally.

##### Returns

`string`

#### Set Signature

> **set** **terminal**(`terminal`): `void`

Defined in: [packages/core/src/widgets/screen.ts:333](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L333)

##### Parameters

###### terminal

`string`

##### Returns

`void`

---

### cols

#### Get Signature

> **get** **cols**(): `number`

Defined in: [packages/core/src/widgets/screen.ts:340](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L340)

Same as screen.width.

##### Returns

`number`

---

### rows

#### Get Signature

> **get** **rows**(): `number`

Defined in: [packages/core/src/widgets/screen.ts:347](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L347)

Same as screen.height.

##### Returns

`number`

---

### width

#### Get Signature

> **get** **width**(): `number`

Defined in: [packages/core/src/widgets/screen.ts:354](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L354)

Width of the screen (same as program.cols).

##### Returns

`number`

---

### height

#### Get Signature

> **get** **height**(): `number`

Defined in: [packages/core/src/widgets/screen.ts:361](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L361)

Height of the screen (same as program.rows).

##### Returns

`number`

---

### focused

#### Get Signature

> **get** **focused**(): `any`

Defined in: [packages/core/src/widgets/screen.ts:368](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L368)

Top of the focus history stack.

##### Returns

`any`

#### Set Signature

> **set** **focused**(`el`): `void`

Defined in: [packages/core/src/widgets/screen.ts:372](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L372)

##### Parameters

###### el

`any`

##### Returns

`void`

## Methods

### setMaxListeners()

> **setMaxListeners**(`n`): `void`

Defined in: [packages/core/src/lib/events.ts:19](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/lib/events.ts#L19)

#### Parameters

##### n

`number`

#### Returns

`void`

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`setMaxListeners`](widgets.node.Class.Node.md#setmaxlisteners)

---

### addListener()

> **addListener**(`type`, `listener`): `void`

Defined in: [packages/core/src/lib/events.ts:23](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/lib/events.ts#L23)

#### Parameters

##### type

`string`

##### listener

`Function`

#### Returns

`void`

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`addListener`](widgets.node.Class.Node.md#addlistener)

---

### on()

> **on**(`type`, `listener`): `any`

Defined in: [packages/core/src/lib/events.ts:34](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/lib/events.ts#L34)

#### Parameters

##### type

`string`

##### listener

`Function`

#### Returns

`any`

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`on`](widgets.node.Class.Node.md#on)

---

### removeListener()

> **removeListener**(`type`, `listener`): `void`

Defined in: [packages/core/src/lib/events.ts:38](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/lib/events.ts#L38)

#### Parameters

##### type

`string`

##### listener

`Function`

#### Returns

`void`

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`removeListener`](widgets.node.Class.Node.md#removelistener)

---

### off()

> **off**(`type`, `listener`): `any`

Defined in: [packages/core/src/lib/events.ts:57](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/lib/events.ts#L57)

#### Parameters

##### type

`string`

##### listener

`Function`

#### Returns

`any`

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`off`](widgets.node.Class.Node.md#off)

---

### removeAllListeners()

> **removeAllListeners**(`type?`): `void`

Defined in: [packages/core/src/lib/events.ts:61](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/lib/events.ts#L61)

#### Parameters

##### type?

`string`

#### Returns

`void`

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`removeAllListeners`](widgets.node.Class.Node.md#removealllisteners)

---

### once()

> **once**(`type`, `listener`): `any`

Defined in: [packages/core/src/lib/events.ts:69](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/lib/events.ts#L69)

#### Parameters

##### type

`string`

##### listener

`Function`

#### Returns

`any`

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`once`](widgets.node.Class.Node.md#once)

---

### listeners()

> **listeners**(`type`): `Function`[]

Defined in: [packages/core/src/lib/events.ts:79](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/lib/events.ts#L79)

#### Parameters

##### type

`string`

#### Returns

`Function`[]

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`listeners`](widgets.node.Class.Node.md#listeners)

---

### \_emit()

> **\_emit**(`type`, `args`): `any`

Defined in: [packages/core/src/lib/events.ts:85](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/lib/events.ts#L85)

#### Parameters

##### type

`string`

##### args

`any`[]

#### Returns

`any`

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`_emit`](widgets.node.Class.Node.md#_emit)

---

### emit()

> **emit**(`type`, ...`rest`): `boolean`

Defined in: [packages/core/src/lib/events.ts:113](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/lib/events.ts#L113)

#### Parameters

##### type

`string`

##### rest

...`any`[]

#### Returns

`boolean`

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`emit`](widgets.node.Class.Node.md#emit)

---

### insert()

> **insert**(`element`, `i`): `void`

Defined in: [packages/core/src/widgets/node.ts:154](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L154)

Insert a node to this node's children at index i.

#### Parameters

##### element

`any`

##### i

`number`

#### Returns

`void`

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`insert`](widgets.node.Class.Node.md#insert)

---

### prepend()

> **prepend**(`element`): `void`

Defined in: [packages/core/src/widgets/node.ts:191](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L191)

Prepend a node to this node's children.

#### Parameters

##### element

`any`

#### Returns

`void`

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`prepend`](widgets.node.Class.Node.md#prepend)

---

### append()

> **append**(`element`): `void`

Defined in: [packages/core/src/widgets/node.ts:198](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L198)

Append a node to this node's children.

#### Parameters

##### element

`any`

#### Returns

`void`

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`append`](widgets.node.Class.Node.md#append)

---

### insertBefore()

> **insertBefore**(`element`, `other`): `void`

Defined in: [packages/core/src/widgets/node.ts:205](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L205)

Insert a node to this node's children before the reference node.

#### Parameters

##### element

`any`

##### other

`any`

#### Returns

`void`

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`insertBefore`](widgets.node.Class.Node.md#insertbefore)

---

### insertAfter()

> **insertAfter**(`element`, `other`): `void`

Defined in: [packages/core/src/widgets/node.ts:213](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L213)

Insert a node from node after the reference node.

#### Parameters

##### element

`any`

##### other

`any`

#### Returns

`void`

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`insertAfter`](widgets.node.Class.Node.md#insertafter)

---

### remove()

> **remove**(`element`): `void`

Defined in: [packages/core/src/widgets/node.ts:221](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L221)

Remove child node from node.

#### Parameters

##### element

`any`

#### Returns

`void`

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`remove`](widgets.node.Class.Node.md#remove)

---

### detach()

> **detach**(): `void`

Defined in: [packages/core/src/widgets/node.ts:255](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L255)

Remove node from its parent.

#### Returns

`void`

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`detach`](widgets.node.Class.Node.md#detach)

---

### free()

> **free**(): `void`

Defined in: [packages/core/src/widgets/node.ts:263](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L263)

Free up the element. Automatically unbind all events that may have been bound
to the screen object. This prevents memory leaks.

#### Returns

`void`

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`free`](widgets.node.Class.Node.md#free)

---

### forDescendants()

> **forDescendants**(`iter`, `s?`): `void`

Defined in: [packages/core/src/widgets/node.ts:283](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L283)

Iterate over all descendants, calling iter(el) for each.

#### Parameters

##### iter

(`el`) => `void`

##### s?

`any`

#### Returns

`void`

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`forDescendants`](widgets.node.Class.Node.md#fordescendants)

---

### forAncestors()

> **forAncestors**(`iter`, `s?`): `void`

Defined in: [packages/core/src/widgets/node.ts:294](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L294)

Iterate over all ancestors, calling iter(el) for each.

#### Parameters

##### iter

(`el`) => `void`

##### s?

`any`

#### Returns

`void`

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`forAncestors`](widgets.node.Class.Node.md#forancestors)

---

### collectDescendants()

> **collectDescendants**(`s?`): `any`[]

Defined in: [packages/core/src/widgets/node.ts:305](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L305)

Collect all descendants into an array.

#### Parameters

##### s?

`any`

#### Returns

`any`[]

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`collectDescendants`](widgets.node.Class.Node.md#collectdescendants)

---

### collectAncestors()

> **collectAncestors**(`s?`): `any`[]

Defined in: [packages/core/src/widgets/node.ts:316](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L316)

Collect all ancestors into an array.

#### Parameters

##### s?

`any`

#### Returns

`any`[]

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`collectAncestors`](widgets.node.Class.Node.md#collectancestors)

---

### emitDescendants()

> **emitDescendants**(...`args`): `void`

Defined in: [packages/core/src/widgets/node.ts:327](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L327)

Emit event for element, and recursively emit same event for all descendants.

#### Parameters

##### args

...`any`[]

#### Returns

`void`

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`emitDescendants`](widgets.node.Class.Node.md#emitdescendants)

---

### emitAncestors()

> **emitAncestors**(...`args`): `void`

Defined in: [packages/core/src/widgets/node.ts:343](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L343)

Emit event for element, and recursively emit same event for all ancestors.

#### Parameters

##### args

...`any`[]

#### Returns

`void`

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`emitAncestors`](widgets.node.Class.Node.md#emitancestors)

---

### hasDescendant()

> **hasDescendant**(`target`): `boolean`

Defined in: [packages/core/src/widgets/node.ts:359](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L359)

Check if target is a descendant of this node.

#### Parameters

##### target

`any`

#### Returns

`boolean`

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`hasDescendant`](widgets.node.Class.Node.md#hasdescendant)

---

### hasAncestor()

> **hasAncestor**(`target`): `boolean`

Defined in: [packages/core/src/widgets/node.ts:377](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L377)

Check if target is an ancestor of this node.

#### Parameters

##### target

`any`

#### Returns

`boolean`

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`hasAncestor`](widgets.node.Class.Node.md#hasancestor)

---

### get()

> **get**(`name`, `value?`): `any`

Defined in: [packages/core/src/widgets/node.ts:388](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L388)

Get user property with a potential default value.

#### Parameters

##### name

`string`

##### value?

`any`

#### Returns

`any`

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`get`](widgets.node.Class.Node.md#get)

---

### set()

> **set**(`name`, `value`): `any`

Defined in: [packages/core/src/widgets/node.ts:398](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L398)

Set user property to value.

#### Parameters

##### name

`string`

##### value

`any`

#### Returns

`any`

#### Inherited from

[`Node`](widgets.node.Class.Node.md).[`set`](widgets.node.Class.Node.md#set)

---

### setTerminal()

> **setTerminal**(`terminal`): `void`

Defined in: [packages/core/src/widgets/screen.ts:379](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L379)

Reset the terminal to term. Reloads terminfo.

#### Parameters

##### terminal

`string`

#### Returns

`void`

---

### enter()

> **enter**(): `void`

Defined in: [packages/core/src/widgets/screen.ts:397](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L397)

Enter the alternate screen buffer and initialize the screen.
Automatically called when the screen is created.

#### Returns

`void`

---

### leave()

> **leave**(): `void`

Defined in: [packages/core/src/widgets/screen.ts:431](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L431)

Leave the alternate screen buffer and restore the terminal to its original state.
Automatically called when the screen is destroyed.

#### Returns

`void`

---

### postEnter()

> **postEnter**(): `void`

Defined in: [packages/core/src/widgets/screen.ts:464](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L464)

Perform post-enter initialization. Sets up debug log and warnings if enabled.
Automatically called after enter().

#### Returns

`void`

---

### destroy()

> **destroy**(): `void`

Defined in: [packages/core/src/widgets/screen.ts:543](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L543)

Destroy the screen object and remove it from the global list. Also remove all global events relevant
to the screen object. If all screen objects are destroyed, the node process is essentially reset
to its initial state.

#### Returns

`void`

#### Overrides

[`Node`](widgets.node.Class.Node.md).[`destroy`](widgets.node.Class.Node.md#destroy)

---

### log()

> **log**(...`args`): `any`

Defined in: [packages/core/src/widgets/screen.ts:585](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L585)

Write string to the log file if one was created.

#### Parameters

##### args

...`any`[]

#### Returns

`any`

---

### debug()

> **debug**(...`args`): `any`

Defined in: [packages/core/src/widgets/screen.ts:592](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L592)

Same as the log method, but only gets called if the debug option was set.

#### Parameters

##### args

...`any`[]

#### Returns

`any`

---

### \_listenMouse()

> **\_listenMouse**(`el?`): `void`

Defined in: [packages/core/src/widgets/screen.ts:603](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L603)

Internal method to set up mouse event handling for the screen and optionally an element.

#### Parameters

##### el?

`any`

Element to register as clickable (optional)

#### Returns

`void`

---

### enableMouse()

> **enableMouse**(`el?`): `void`

Defined in: [packages/core/src/widgets/screen.ts:716](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L716)

Enable mouse events for the screen and optionally an element (automatically called when a form of
on('mouse') is bound).

#### Parameters

##### el?

`any`

#### Returns

`void`

---

### \_listenKeys()

> **\_listenKeys**(`el?`): `void`

Defined in: [packages/core/src/widgets/screen.ts:724](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L724)

Internal method to set up keypress event handling for the screen and optionally an element.

#### Parameters

##### el?

`any`

Element to register as keyable (optional)

#### Returns

`void`

---

### enableKeys()

> **enableKeys**(`el?`): `void`

Defined in: [packages/core/src/widgets/screen.ts:780](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L780)

Enable keypress events for the screen and optionally an element (automatically called when a form of
on('keypress') is bound).

#### Parameters

##### el?

`any`

Element to enable keys for (optional)

#### Returns

`void`

---

### enableInput()

> **enableInput**(`el?`): `void`

Defined in: [packages/core/src/widgets/screen.ts:788](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L788)

Enable key and mouse events. Calls both enableMouse() and enableKeys().

#### Parameters

##### el?

`any`

Element to enable input for (optional)

#### Returns

`void`

---

### \_initHover()

> **\_initHover**(): `void`

Defined in: [packages/core/src/widgets/screen.ts:797](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L797)

Internal method to initialize the hover text box used by element.setHover().
Creates a floating box that follows the mouse cursor.

#### Returns

`void`

---

### alloc()

> **alloc**(`dirty?`): `void`

Defined in: [packages/core/src/widgets/screen.ts:856](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L856)

Allocate a new pending screen buffer and a new output screen buffer.

#### Parameters

##### dirty?

`boolean`

#### Returns

`void`

---

### realloc()

> **realloc**(): `void`

Defined in: [packages/core/src/widgets/screen.ts:882](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L882)

Reallocate the screen buffers and clear the screen.

#### Returns

`void`

---

### render()

> **render**(): `void`

Defined in: [packages/core/src/widgets/screen.ts:889](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L889)

Render all child elements, writing all data to the screen buffer and drawing the screen.

#### Returns

`void`

---

### blankLine()

> **blankLine**(`ch?`, `dirty?`): `any`[]

Defined in: [packages/core/src/widgets/screen.ts:935](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L935)

Create a blank line array for the screen buffer.

#### Parameters

##### ch?

`string`

Character to fill the line with (default: space)

##### dirty?

`boolean`

Whether to mark the line as dirty (requires redraw)

#### Returns

`any`[]

Array representing a blank line in the screen buffer

---

### insertLine()

> **insertLine**(`n`, `y`, `top`, `bottom`): `void`

Defined in: [packages/core/src/widgets/screen.ts:952](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L952)

Insert a line into the screen (using CSR: this bypasses the output buffer).
Uses change_scroll_region to optimize scrolling for elements with uniform sides.

#### Parameters

##### n

`number`

Number of lines to insert

##### y

`number`

Y position to insert at

##### top

`number`

Top of scroll region

##### bottom

`number`

Bottom of scroll region

#### Returns

`void`

---

### deleteLine()

> **deleteLine**(`n`, `y`, `top`, `bottom`): `void`

Defined in: [packages/core/src/widgets/screen.ts:985](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L985)

Delete a line from the screen (using CSR: this bypasses the output buffer).
Uses change_scroll_region to optimize scrolling for elements with uniform sides.

#### Parameters

##### n

`number`

Number of lines to delete

##### y

`number`

Y position to delete from

##### top

`number`

Top of scroll region

##### bottom

`number`

Bottom of scroll region

#### Returns

`void`

---

### insertLineNC()

> **insertLineNC**(`n`, `y`, `top`, `bottom`): `void`

Defined in: [packages/core/src/widgets/screen.ts:1018](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L1018)

Insert lines using ncurses method (scroll down, up cursor-wise).
This will only work for top line deletion as opposed to arbitrary lines.

#### Parameters

##### n

`number`

Number of lines to insert

##### y

`number`

Y position to insert at

##### top

`number`

Top of scroll region

##### bottom

`number`

Bottom of scroll region

#### Returns

`void`

---

### deleteLineNC()

> **deleteLineNC**(`n`, `y`, `top`, `bottom`): `void`

Defined in: [packages/core/src/widgets/screen.ts:1048](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L1048)

Delete lines using ncurses method (scroll up, down cursor-wise).
This will only work for bottom line deletion as opposed to arbitrary lines.

#### Parameters

##### n

`number`

Number of lines to delete

##### y

`number`

Y position to delete from

##### top

`number`

Top of scroll region

##### bottom

`number`

Bottom of scroll region

#### Returns

`void`

---

### insertBottom()

> **insertBottom**(`top`, `bottom`): `void`

Defined in: [packages/core/src/widgets/screen.ts:1075](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L1075)

Insert a line at the bottom of the screen.

#### Parameters

##### top

`number`

Top of scroll region

##### bottom

`number`

Bottom of scroll region

#### Returns

`void`

---

### insertTop()

> **insertTop**(`top`, `bottom`): `void`

Defined in: [packages/core/src/widgets/screen.ts:1084](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L1084)

Insert a line at the top of the screen.

#### Parameters

##### top

`number`

Top of scroll region

##### bottom

`number`

Bottom of scroll region

#### Returns

`void`

---

### deleteBottom()

> **deleteBottom**(`_top`, `bottom`): `void`

Defined in: [packages/core/src/widgets/screen.ts:1093](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L1093)

Delete a line at the bottom of the screen.

#### Parameters

##### \_top

`number`

Top of scroll region (unused)

##### bottom

`number`

Bottom of scroll region

#### Returns

`void`

---

### deleteTop()

> **deleteTop**(`top`, `bottom`): `void`

Defined in: [packages/core/src/widgets/screen.ts:1102](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L1102)

Delete a line at the top of the screen.

#### Parameters

##### top

`number`

Top of scroll region

##### bottom

`number`

Bottom of scroll region

#### Returns

`void`

---

### cleanSides()

> **cleanSides**(`el`): `boolean`

Defined in: [packages/core/src/widgets/screen.ts:1115](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L1115)

Parse the sides of an element to determine whether an element has uniform cells on both sides.
If it does, we can use CSR to optimize scrolling on a scrollable element.
Checks if cells to the left and right of the element are all identical, allowing for
optimized scrolling using change_scroll_region (CSR).

#### Parameters

##### el

`any`

Element to check

#### Returns

`boolean`

True if the element has clean sides (uniform cells on both sides)

---

### \_dockBorders()

> **\_dockBorders**(): `void`

Defined in: [packages/core/src/widgets/screen.ts:1200](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L1200)

Internal method to dock borders with adjacent elements.
Processes border stops to determine which border characters should connect with adjacent borders,
replacing corner and T-junction characters as appropriate.

#### Returns

`void`

---

### \_getAngle()

> **\_getAngle**(`lines`, `x`, `y`): `string`

Defined in: [packages/core/src/widgets/screen.ts:1246](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L1246)

Internal method to determine the correct border angle character for a given position.
Examines adjacent cells to determine which directions have borders, then returns
the appropriate Unicode box-drawing character.

#### Parameters

##### lines

`any`[]

Screen buffer lines

##### x

`number`

X coordinate

##### y

`number`

Y coordinate

#### Returns

`string`

Unicode box-drawing character for this position

---

### draw()

> **draw**(`start`, `end`): `void`

Defined in: [packages/core/src/widgets/screen.ts:1307](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L1307)

Draw the screen based on the contents of the screen buffer.
Compares the pending buffer (lines) with the output buffer (olines) and writes only
the changes to minimize terminal output. Handles SGR codes, cursor positioning,
double-width characters, and terminal-specific optimizations.

#### Parameters

##### start

`number`

Starting line number

##### end

`number`

Ending line number

#### Returns

`void`

---

### \_reduceColor()

> **\_reduceColor**(`color`): `number`

Defined in: [packages/core/src/widgets/screen.ts:1676](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L1676)

Internal method to reduce color values to the number of colors supported by the terminal.

#### Parameters

##### color

`number`

Color value to reduce

#### Returns

`number`

Reduced color value

---

### attrCode()

> **attrCode**(`code`, `cur`, `def`): `number`

Defined in: [packages/core/src/widgets/screen.ts:1689](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L1689)

Convert an SGR escape code string to blessed's internal attribute format.
Parses SGR sequences like "\x1b[1;31m" and returns a packed integer containing
flags (bold, underline, etc.), foreground color, and background color.

#### Parameters

##### code

`string`

SGR escape code string

##### cur

`number`

Current attribute value

##### def

`number`

Default attribute value

#### Returns

`number`

Packed attribute integer

---

### codeAttr()

> **codeAttr**(`code`): `string`

Defined in: [packages/core/src/widgets/screen.ts:1815](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L1815)

Convert blessed's internal attribute format to an SGR escape code string.
Unpacks the attribute integer and generates the appropriate SGR sequence
for terminal output.

#### Parameters

##### code

`number`

Packed attribute integer

#### Returns

`string`

SGR escape code string

---

### focusOffset()

> **focusOffset**(`offset`): `any`

Defined in: [packages/core/src/widgets/screen.ts:1925](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L1925)

Focus element by offset of focusable elements.
Moves focus forward or backward through the list of focusable elements in tab order,
skipping detached or hidden elements.

#### Parameters

##### offset

`number`

Number of elements to move (positive for forward, negative for backward)

#### Returns

`any`

The newly focused element, or undefined if no element was found

---

### focusPrev()

> **focusPrev**(): `any`

Defined in: [packages/core/src/widgets/screen.ts:1973](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L1973)

Focus previous element in the index.
Shorthand for focusOffset(-1).

#### Returns

`any`

The newly focused element

---

### focusPrevious()

> **focusPrevious**(): `any`

Defined in: [packages/core/src/widgets/screen.ts:1982](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L1982)

Focus previous element in the index.
Alias for focusPrev().

#### Returns

`any`

The newly focused element

---

### focusNext()

> **focusNext**(): `any`

Defined in: [packages/core/src/widgets/screen.ts:1991](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L1991)

Focus next element in the index.
Shorthand for focusOffset(1).

#### Returns

`any`

The newly focused element

---

### focusPush()

> **focusPush**(`el`): `void`

Defined in: [packages/core/src/widgets/screen.ts:2000](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2000)

Push element on the focus stack (equivalent to screen.focused = el).
Maintains a history of up to 10 focused elements for focus management.

#### Parameters

##### el

`any`

Element to focus

#### Returns

`void`

---

### focusPop()

> **focusPop**(): `any`

Defined in: [packages/core/src/widgets/screen.ts:2015](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2015)

Pop element off the focus stack.
Removes the current element from focus and returns focus to the previous element.

#### Returns

`any`

The element that was popped from the focus stack

---

### saveFocus()

> **saveFocus**(): `any`

Defined in: [packages/core/src/widgets/screen.ts:2028](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2028)

Save the focused element.
Stores the currently focused element for later restoration via restoreFocus().

#### Returns

`any`

The saved focused element

---

### restoreFocus()

> **restoreFocus**(): `any`

Defined in: [packages/core/src/widgets/screen.ts:2037](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2037)

Restore the saved focused element.
Returns focus to the element saved by saveFocus().

#### Returns

`any`

The newly focused element

---

### rewindFocus()

> **rewindFocus**(): `any`

Defined in: [packages/core/src/widgets/screen.ts:2050](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2050)

"Rewind" focus to the last visible and attached element.
Walks backward through the focus history to find an element that is still
visible and attached to the screen.

#### Returns

`any`

The element that received focus, or undefined if none found

---

### \_focus()

> **\_focus**(`self`, `old`): `void`

Defined in: [packages/core/src/widgets/screen.ts:2075](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2075)

Internal method to handle focus changes.
Automatically scrolls scrollable ancestors to bring the focused element into view,
and emits focus/blur events.

#### Parameters

##### self

`any`

Element receiving focus

##### old

`any`

Element losing focus

#### Returns

`void`

---

### clearRegion()

> **clearRegion**(`xi`, `xl`, `yi`, `yl`, `override?`): `void`

Defined in: [packages/core/src/widgets/screen.ts:2121](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2121)

Clear any region on the screen.
Fills the region with spaces using the default attribute.

#### Parameters

##### xi

`number`

Left X coordinate

##### xl

`number`

Right X coordinate

##### yi

`number`

Top Y coordinate

##### yl

`number`

Bottom Y coordinate

##### override?

`boolean`

If true, always write even if cell hasn't changed

#### Returns

`void`

---

### fillRegion()

> **fillRegion**(`attr`, `ch`, `xi`, `xl`, `yi`, `yl`, `override?`): `void`

Defined in: [packages/core/src/widgets/screen.ts:2142](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2142)

Fill any region with a character of a certain attribute.
Used for clearing regions, drawing backgrounds, etc.

#### Parameters

##### attr

`number`

Attribute to fill with

##### ch

`string`

Character to fill with

##### xi

`number`

Left X coordinate

##### xl

`number`

Right X coordinate

##### yi

`number`

Top Y coordinate

##### yl

`number`

Bottom Y coordinate

##### override?

`boolean`

If true, always write even if cell hasn't changed

#### Returns

`void`

---

### key()

> **key**(...`args`): `any`

Defined in: [packages/core/src/widgets/screen.ts:2177](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2177)

Bind a key event handler.

#### Parameters

##### args

...`any`[]

Arguments to pass to program.key()

#### Returns

`any`

The bound key handler

---

### onceKey()

> **onceKey**(...`args`): `any`

Defined in: [packages/core/src/widgets/screen.ts:2186](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2186)

Bind a key event handler that fires only once.

#### Parameters

##### args

...`any`[]

Arguments to pass to program.onceKey()

#### Returns

`any`

The bound key handler

---

### unkey()

> **unkey**(...`args`): `any`

Defined in: [packages/core/src/widgets/screen.ts:2195](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2195)

Unbind a key event handler.

#### Parameters

##### args

...`any`[]

Arguments to pass to program.unkey()

#### Returns

`any`

Result of unbinding

---

### removeKey()

> **removeKey**(...`args`): `any`

Defined in: [packages/core/src/widgets/screen.ts:2205](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2205)

Remove a key event handler.
Alias for unkey().

#### Parameters

##### args

...`any`[]

Arguments to pass to program.removeKey()

#### Returns

`any`

Result of removing

---

### spawn()

> **spawn**(`file`, `args?`, `options?`): `any`

Defined in: [packages/core/src/widgets/screen.ts:2217](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2217)

Spawn a process in the foreground, return to blessed app after exit.
Temporarily leaves the alternate screen buffer and restores it after the process exits.

#### Parameters

##### file

`string`

Command to execute

##### args?

`any`

Arguments to pass to the command

##### options?

`any`

Options to pass to child_process.spawn

#### Returns

`any`

ChildProcess instance

---

### exec()

> **exec**(`file`, `args?`, `options?`, `callback?`): `any`

Defined in: [packages/core/src/widgets/screen.ts:2288](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2288)

Spawn a process in the foreground, return to blessed app after exit. Executes callback on error or exit.

#### Parameters

##### file

`string`

Command to execute

##### args?

`any`

Arguments to pass to the command

##### options?

`any`

Options to pass to child_process.spawn

##### callback?

`any`

Callback function (err, success)

#### Returns

`any`

ChildProcess instance

---

### readEditor()

> **readEditor**(`options`, `callback?`): `any`

Defined in: [packages/core/src/widgets/screen.ts:2311](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2311)

Read data from text editor.
Spawns the user's $EDITOR (or vi) to edit a temporary file, then returns the contents.

#### Parameters

##### options

`any`

Options object or callback function

##### callback?

`any`

Callback function (err, data)

#### Returns

`any`

Result of the editor operation

---

### displayImage()

> **displayImage**(`file`, `callback?`): `any`

Defined in: [packages/core/src/widgets/screen.ts:2367](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2367)

Display an image in the terminal using w3m.
Experimental feature that spawns w3m to render images.

#### Parameters

##### file

`string`

Path to image file

##### callback?

`any`

Callback function (err, success)

#### Returns

`any`

Result of the display operation

---

### setEffects()

> **setEffects**(`el`, `fel`, `over`, `out`, `effects`, `temp?`): `void`

Defined in: [packages/core/src/widgets/screen.ts:2421](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2421)

Set effects based on two events and attributes.
Used to apply hover and focus effects to elements. When the 'over' event fires,
the effects are applied; when the 'out' event fires, the effects are removed.

#### Parameters

##### el

`any`

Element to apply effects to (or function returning element)

##### fel

`any`

Element to listen for events on

##### over

`any`

Event name to trigger effects (e.g., 'mouseover')

##### out

`any`

Event name to remove effects (e.g., 'mouseout')

##### effects

`any`

Style object with effects to apply

##### temp?

`any`

Property name to store temporary state in

#### Returns

`void`

---

### sigtstp()

> **sigtstp**(`callback?`): `void`

Defined in: [packages/core/src/widgets/screen.ts:2488](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2488)

Handle SIGTSTP signal (Ctrl+Z).
Sets up a handler to properly restore the screen after the process is resumed.

#### Parameters

##### callback?

`any`

Optional callback to execute after resume

#### Returns

`void`

---

### copyToClipboard()

> **copyToClipboard**(`text`): `boolean`

Defined in: [packages/core/src/widgets/screen.ts:2503](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2503)

Attempt to copy text to clipboard using iTerm2's proprietary sequence. Returns true if successful.
Only works in iTerm2 with the proper terminal sequences enabled.

#### Parameters

##### text

`string`

Text to copy to clipboard

#### Returns

`boolean`

True if successful

---

### cursorShape()

> **cursorShape**(`shape?`, `blink?`): `boolean`

Defined in: [packages/core/src/widgets/screen.ts:2514](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2514)

Attempt to change cursor shape. Will not work in all terminals (see artificial cursors for a solution
to this). Returns true if successful.

#### Parameters

##### shape?

`string`

Cursor shape ('block', 'underline', 'line', or style object)

##### blink?

`boolean`

Whether the cursor should blink

#### Returns

`boolean`

True if successful

---

### cursorColor()

> **cursorColor**(`color`): `boolean`

Defined in: [packages/core/src/widgets/screen.ts:2560](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2560)

Attempt to change cursor color. Returns true if successful.
Only works in terminals that support the cursor color escape sequence.

#### Parameters

##### color

`any`

Color name or code

#### Returns

`boolean`

True if successful

---

### cursorReset()

> **cursorReset**(): `boolean`

Defined in: [packages/core/src/widgets/screen.ts:2576](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2576)

Attempt to reset cursor. Returns true if successful.
Restores cursor to default shape, color, and blink state.

#### Returns

`boolean`

True if successful

---

### resetCursor()

> **resetCursor**(): `boolean`

Defined in: [packages/core/src/widgets/screen.ts:2606](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2606)

Reset cursor (alias for cursorReset() for backward compatibility).

#### Returns

`boolean`

True if successful

---

### \_cursorAttr()

> **\_cursorAttr**(`cursor`, `dattr?`): `any`

Defined in: [packages/core/src/widgets/screen.ts:2617](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2617)

Internal method to calculate cursor attribute for artificial cursor rendering.
Determines the correct attribute and character for rendering the cursor at a given position.

#### Parameters

##### cursor

`any`

Cursor configuration object

##### dattr?

`number`

Default attribute (optional)

#### Returns

`any`

Object with 'ch' (character) and 'attr' (attribute) properties

---

### screenshot()

> **screenshot**(`xi?`, `xl?`, `yi?`, `yl?`, `term?`): `string`

Defined in: [packages/core/src/widgets/screen.ts:2684](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2684)

Take an SGR screenshot of the screen within the region. Returns a string containing only
characters and SGR codes. Can be displayed by simply echoing it in a terminal.

#### Parameters

##### xi?

`number`

Left X coordinate (default: 0)

##### xl?

`number`

Right X coordinate (default: screen width)

##### yi?

`number`

Top Y coordinate (default: 0)

##### yl?

`number`

Bottom Y coordinate (default: screen height)

##### term?

`any`

Terminal object to screenshot from (default: this screen)

#### Returns

`string`

SGR-encoded screenshot string

---

### \_getPos()

> **\_getPos**(): `any`

Defined in: [packages/core/src/widgets/screen.ts:2784](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/screen.ts#L2784)

Internal method to get position coordinates.
For Screen, this always returns itself since Screen is the root container.

#### Returns

`any`

This screen instance
