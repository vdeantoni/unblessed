# Class: Log

Defined in: [packages/core/src/widgets/log.ts:42](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/log.ts#L42)

Log widget for displaying scrolling log messages.

A specialized scrollable text widget optimized for log output with
automatic scrolling, scrollback limits, and optional static header/footer.

## Examples

```typescript
const log = new Log({
  parent: screen,
  scrollback: 1000,
  border: { type: "line" },
});

log.log("Server started");
log.log("User %s connected", username);
```

```typescript
const log = new Log({
  parent: screen,
  scrollback: 1000,
  staticHeader: "=== Application Logs ===",
  staticFooter: "[↑/↓] Scroll | [Q] Quit",
});
```

## Extends

- [`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md)

## Constructors

### Constructor

> **new Log**(`options`): `Log`

Defined in: [packages/core/src/widgets/log.ts:64](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/log.ts#L64)

#### Parameters

##### options

`LogOptions` = `{}`

#### Returns

`Log`

#### Overrides

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`constructor`](widgets.scrollabletext.Class.ScrollableText.md#constructor)

## Properties

### \_events

> **\_events**: `any`

Defined in: [packages/core/src/lib/events.ts:10](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/lib/events.ts#L10)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_events`](widgets.scrollabletext.Class.ScrollableText.md#_events)

---

### \_maxListeners?

> `optional` **\_maxListeners**: `number`

Defined in: [packages/core/src/lib/events.ts:11](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/lib/events.ts#L11)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_maxListeners`](widgets.scrollabletext.Class.ScrollableText.md#_maxlisteners)

---

### options

> **options**: `ElementOptions`

Defined in: [packages/core/src/widgets/element.ts:49](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L49)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`options`](widgets.scrollabletext.Class.ScrollableText.md#options)

---

### name?

> `optional` **name**: `string`

Defined in: [packages/core/src/widgets/element.ts:51](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L51)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`name`](widgets.scrollabletext.Class.ScrollableText.md#name)

---

### position

> **position**: `any`

Defined in: [packages/core/src/widgets/element.ts:56](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L56)

Position specification. Can be relative coordinates or keywords.
Kept as any due to complex internal position calculation system.

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`position`](widgets.scrollabletext.Class.ScrollableText.md#position)

---

### noOverflow?

> `optional` **noOverflow**: `boolean`

Defined in: [packages/core/src/widgets/element.ts:57](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L57)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`noOverflow`](widgets.scrollabletext.Class.ScrollableText.md#nooverflow)

---

### dockBorders?

> `optional` **dockBorders**: `boolean`

Defined in: [packages/core/src/widgets/element.ts:58](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L58)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`dockBorders`](widgets.scrollabletext.Class.ScrollableText.md#dockborders)

---

### shadow?

> `optional` **shadow**: `boolean`

Defined in: [packages/core/src/widgets/element.ts:59](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L59)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`shadow`](widgets.scrollabletext.Class.ScrollableText.md#shadow)

---

### style

> **style**: `Style`

Defined in: [packages/core/src/widgets/element.ts:61](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L61)

Element style configuration (colors, attributes, hover/focus effects)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`style`](widgets.scrollabletext.Class.ScrollableText.md#style)

---

### hidden

> **hidden**: `boolean`

Defined in: [packages/core/src/widgets/element.ts:62](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L62)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`hidden`](widgets.scrollabletext.Class.ScrollableText.md#hidden)

---

### fixed

> **fixed**: `boolean`

Defined in: [packages/core/src/widgets/element.ts:63](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L63)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`fixed`](widgets.scrollabletext.Class.ScrollableText.md#fixed)

---

### align

> **align**: `string`

Defined in: [packages/core/src/widgets/element.ts:64](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L64)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`align`](widgets.scrollabletext.Class.ScrollableText.md#align)

---

### valign

> **valign**: `string`

Defined in: [packages/core/src/widgets/element.ts:65](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L65)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`valign`](widgets.scrollabletext.Class.ScrollableText.md#valign)

---

### wrap

> **wrap**: `boolean`

Defined in: [packages/core/src/widgets/element.ts:66](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L66)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`wrap`](widgets.scrollabletext.Class.ScrollableText.md#wrap)

---

### shrink?

> `optional` **shrink**: `boolean`

Defined in: [packages/core/src/widgets/element.ts:67](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L67)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`shrink`](widgets.scrollabletext.Class.ScrollableText.md#shrink)

---

### ch

> **ch**: `string`

Defined in: [packages/core/src/widgets/element.ts:68](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L68)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`ch`](widgets.scrollabletext.Class.ScrollableText.md#ch)

---

### padding

> **padding**: `Padding`

Defined in: [packages/core/src/widgets/element.ts:70](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L70)

Padding configuration for all sides

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`padding`](widgets.scrollabletext.Class.ScrollableText.md#padding)

---

### border?

> `optional` **border**: `Border`

Defined in: [packages/core/src/widgets/element.ts:72](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L72)

Border configuration

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`border`](widgets.scrollabletext.Class.ScrollableText.md#border)

---

### parseTags?

> `optional` **parseTags**: `boolean`

Defined in: [packages/core/src/widgets/element.ts:73](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L73)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`parseTags`](widgets.scrollabletext.Class.ScrollableText.md#parsetags)

---

### content

> **content**: `string` = `""`

Defined in: [packages/core/src/widgets/element.ts:74](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L74)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`content`](widgets.scrollabletext.Class.ScrollableText.md#content)

---

### lpos?

> `optional` **lpos**: `RenderCoords`

Defined in: [packages/core/src/widgets/element.ts:76](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L76)

Last rendered position coordinates

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`lpos`](widgets.scrollabletext.Class.ScrollableText.md#lpos)

---

### \_clines?

> `optional` **\_clines**: `any`

Defined in: [packages/core/src/widgets/element.ts:77](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L77)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_clines`](widgets.scrollabletext.Class.ScrollableText.md#_clines)

---

### \_pcontent?

> `optional` **\_pcontent**: `string`

Defined in: [packages/core/src/widgets/element.ts:78](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L78)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_pcontent`](widgets.scrollabletext.Class.ScrollableText.md#_pcontent)

---

### \_borderColors?

> `optional` **\_borderColors**: (`string` \| `number`)[]

Defined in: [packages/core/src/widgets/element.ts:79](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L79)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_borderColors`](widgets.scrollabletext.Class.ScrollableText.md#_bordercolors)

---

### \_slisteners?

> `optional` **\_slisteners**: `any`[]

Defined in: [packages/core/src/widgets/element.ts:80](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L80)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_slisteners`](widgets.scrollabletext.Class.ScrollableText.md#_slisteners)

---

### \_label?

> `optional` **\_label**: `any`

Defined in: [packages/core/src/widgets/element.ts:81](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L81)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_label`](widgets.scrollabletext.Class.ScrollableText.md#_label)

---

### \_labelScroll()?

> `optional` **\_labelScroll**: () => `void`

Defined in: [packages/core/src/widgets/element.ts:82](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L82)

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_labelScroll`](widgets.scrollabletext.Class.ScrollableText.md#_labelscroll)

---

### \_labelResize()?

> `optional` **\_labelResize**: () => `void`

Defined in: [packages/core/src/widgets/element.ts:83](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L83)

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_labelResize`](widgets.scrollabletext.Class.ScrollableText.md#_labelresize)

---

### \_hoverOptions?

> `optional` **\_hoverOptions**: `any`

Defined in: [packages/core/src/widgets/element.ts:84](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L84)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_hoverOptions`](widgets.scrollabletext.Class.ScrollableText.md#_hoveroptions)

---

### \_draggable?

> `optional` **\_draggable**: `boolean`

Defined in: [packages/core/src/widgets/element.ts:85](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L85)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_draggable`](widgets.scrollabletext.Class.ScrollableText.md#_draggable)

---

### \_dragMD()?

> `optional` **\_dragMD**: (`data`) => `void`

Defined in: [packages/core/src/widgets/element.ts:86](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L86)

#### Parameters

##### data

`MouseEvent`

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_dragMD`](widgets.scrollabletext.Class.ScrollableText.md#_dragmd)

---

### \_dragM()?

> `optional` **\_dragM**: (`data`) => `void`

Defined in: [packages/core/src/widgets/element.ts:87](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L87)

#### Parameters

##### data

`MouseEvent`

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_dragM`](widgets.scrollabletext.Class.ScrollableText.md#_dragm)

---

### \_drag?

> `optional` **\_drag**: `any`

Defined in: [packages/core/src/widgets/element.ts:88](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L88)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_drag`](widgets.scrollabletext.Class.ScrollableText.md#_drag)

---

### \_noFill?

> `optional` **\_noFill**: `boolean`

Defined in: [packages/core/src/widgets/element.ts:89](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L89)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_noFill`](widgets.scrollabletext.Class.ScrollableText.md#_nofill)

---

### \_isLabel?

> `optional` **\_isLabel**: `boolean`

Defined in: [packages/core/src/widgets/element.ts:90](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L90)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_isLabel`](widgets.scrollabletext.Class.ScrollableText.md#_islabel)

---

### \_isList?

> `optional` **\_isList**: `boolean`

Defined in: [packages/core/src/widgets/element.ts:91](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L91)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_isList`](widgets.scrollabletext.Class.ScrollableText.md#_islist)

---

### childBase?

> `optional` **childBase**: `number`

Defined in: [packages/core/src/widgets/element.ts:92](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L92)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`childBase`](widgets.scrollabletext.Class.ScrollableText.md#childbase)

---

### childOffset?

> `optional` **childOffset**: `number`

Defined in: [packages/core/src/widgets/element.ts:93](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L93)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`childOffset`](widgets.scrollabletext.Class.ScrollableText.md#childoffset)

---

### alwaysScroll?

> `optional` **alwaysScroll**: `boolean`

Defined in: [packages/core/src/widgets/element.ts:94](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L94)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`alwaysScroll`](widgets.scrollabletext.Class.ScrollableText.md#alwaysscroll)

---

### baseLimit?

> `optional` **baseLimit**: `number`

Defined in: [packages/core/src/widgets/element.ts:95](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L95)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`baseLimit`](widgets.scrollabletext.Class.ScrollableText.md#baselimit)

---

### track?

> `optional` **track**: `TrackConfig`

Defined in: [packages/core/src/widgets/element.ts:96](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L96)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`track`](widgets.scrollabletext.Class.ScrollableText.md#track)

---

### scrollbar?

> `optional` **scrollbar**: `ScrollbarConfig`

Defined in: [packages/core/src/widgets/element.ts:97](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L97)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`scrollbar`](widgets.scrollabletext.Class.ScrollableText.md#scrollbar)

---

### items?

> `optional` **items**: `any`[]

Defined in: [packages/core/src/widgets/element.ts:98](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L98)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`items`](widgets.scrollabletext.Class.ScrollableText.md#items)

---

### scrollable?

> `optional` **scrollable**: `boolean`

Defined in: [packages/core/src/widgets/element.ts:101](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L101)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`scrollable`](widgets.scrollabletext.Class.ScrollableText.md#scrollable)

---

### scrollTo()?

> `optional` **scrollTo**: (`offset`, `always?`) => `void`

Defined in: [packages/core/src/widgets/element.ts:105](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L105)

Scroll the content to an absolute index.

#### Parameters

##### offset

`number`

The absolute scroll position (line/item index)

##### always?

`boolean`

Force the scroll operation even if position hasn't changed

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`scrollTo`](widgets.scrollabletext.Class.ScrollableText.md#scrollto)

---

### setScroll()?

> `optional` **setScroll**: (`offset`, `always?`) => `void`

Defined in: [packages/core/src/widgets/element.ts:106](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L106)

Scroll the content to an absolute index (alias for scrollTo).

#### Parameters

##### offset

`number`

The absolute scroll position (line/item index)

##### always?

`boolean`

Force the scroll operation even if position hasn't changed

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`setScroll`](widgets.scrollabletext.Class.ScrollableText.md#setscroll)

---

### getScroll()?

> `optional` **getScroll**: () => `number`

Defined in: [packages/core/src/widgets/element.ts:107](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L107)

Get the current scroll index in lines.

#### Returns

`number`

The current absolute scroll position

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`getScroll`](widgets.scrollabletext.Class.ScrollableText.md#getscroll)

---

### getScrollHeight()?

> `optional` **getScrollHeight**: () => `number`

Defined in: [packages/core/src/widgets/element.ts:108](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L108)

Get the actual height of the scrolling area (total content height).

#### Returns

`number`

The total scrollable content height in lines

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`getScrollHeight`](widgets.scrollabletext.Class.ScrollableText.md#getscrollheight)

---

### getScrollPerc()?

> `optional` **getScrollPerc**: (`s?`) => `number`

Defined in: [packages/core/src/widgets/element.ts:109](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L109)

Get the current scroll index in percentage (0-100).

#### Parameters

##### s?

`boolean`

Internal flag for special return values

#### Returns

`number`

The scroll position as a percentage (0-100), or -1 if not scrollable

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`getScrollPerc`](widgets.scrollabletext.Class.ScrollableText.md#getscrollperc)

---

### setScrollPerc()?

> `optional` **setScrollPerc**: (`i`) => `void`

Defined in: [packages/core/src/widgets/element.ts:110](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L110)

Set the current scroll index in percentage (0-100).

#### Parameters

##### i

`number`

The target scroll percentage (0-100)

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`setScrollPerc`](widgets.scrollabletext.Class.ScrollableText.md#setscrollperc)

---

### resetScroll()?

> `optional` **resetScroll**: () => `any`

Defined in: [packages/core/src/widgets/element.ts:111](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L111)

Reset the scroll index to its initial state (top).

#### Returns

`any`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`resetScroll`](widgets.scrollabletext.Class.ScrollableText.md#resetscroll)

---

### \_scrollBottom()?

> `optional` **\_scrollBottom**: () => `number`

Defined in: [packages/core/src/widgets/element.ts:112](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L112)

#### Returns

`number`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_scrollBottom`](widgets.scrollabletext.Class.ScrollableText.md#_scrollbottom)

---

### \_recalculateIndex()?

> `optional` **\_recalculateIndex**: () => `number`

Defined in: [packages/core/src/widgets/element.ts:113](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L113)

#### Returns

`number`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_recalculateIndex`](widgets.scrollabletext.Class.ScrollableText.md#_recalculateindex)

---

### type

> **type**: `string` = `"log"`

Defined in: [packages/core/src/widgets/log.ts:43](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/log.ts#L43)

Type of the node (e.g. box, list, form, etc.).
Used to identify the widget type at runtime.

#### Overrides

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`type`](widgets.scrollabletext.Class.ScrollableText.md#type)

---

### scrollback

> **scrollback**: `number`

Defined in: [packages/core/src/widgets/log.ts:51](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/log.ts#L51)

Amount of scrollback lines allowed.
When exceeded, oldest lines are removed.

#### Default

```ts
Infinity;
```

---

### scrollOnInput

> **scrollOnInput**: `boolean` \| `undefined`

Defined in: [packages/core/src/widgets/log.ts:58](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/log.ts#L58)

Whether to automatically scroll to bottom on new input.

#### Default

```ts
false;
```

---

### uid

> `static` **uid**: `number` = `0`

Defined in: [packages/core/src/widgets/node.ts:30](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L30)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`uid`](widgets.scrollabletext.Class.ScrollableText.md#uid)

---

### ScreenRegistry

> `static` **ScreenRegistry**: `any`

Defined in: [packages/core/src/widgets/node.ts:31](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L31)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`ScreenRegistry`](widgets.scrollabletext.Class.ScrollableText.md#screenregistry)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`screen`](widgets.scrollabletext.Class.ScrollableText.md#screen)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`parent`](widgets.scrollabletext.Class.ScrollableText.md#parent)

---

### children

> **children**: `any`[]

Defined in: [packages/core/src/widgets/node.ts:63](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L63)

Array of child elements.
Type: Node[] (can contain any Node subclasses)

Kept as any[] to preserve flexibility with mixed widget types.

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`children`](widgets.scrollabletext.Class.ScrollableText.md#children)

---

### $

> **$**: `Record`\<`string`, `unknown`\>

Defined in: [packages/core/src/widgets/node.ts:68](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L68)

An object for any miscellaneous user data.

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`$`](widgets.scrollabletext.Class.ScrollableText.md#)

---

### \_

> **\_**: `Record`\<`string`, `unknown`\>

Defined in: [packages/core/src/widgets/node.ts:73](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L73)

An object for any miscellaneous user data.

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_`](widgets.scrollabletext.Class.ScrollableText.md#_)

---

### data

> **data**: `Record`\<`string`, `unknown`\>

Defined in: [packages/core/src/widgets/node.ts:78](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L78)

An object for any miscellaneous user data.

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`data`](widgets.scrollabletext.Class.ScrollableText.md#data)

---

### uid

> **uid**: `number`

Defined in: [packages/core/src/widgets/node.ts:80](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L80)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`uid`](widgets.scrollabletext.Class.ScrollableText.md#uid-1)

---

### index

> **index**: `number` = `-1`

Defined in: [packages/core/src/widgets/node.ts:86](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L86)

Render index (document order index) of the last render call.
Indicates the order in which this element was rendered relative to others.
Set to -1 initially, updated during rendering.

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`index`](widgets.scrollabletext.Class.ScrollableText.md#index)

---

### detached?

> `optional` **detached**: `boolean`

Defined in: [packages/core/src/widgets/node.ts:87](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L87)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`detached`](widgets.scrollabletext.Class.ScrollableText.md#detached)

---

### destroyed?

> `optional` **destroyed**: `boolean`

Defined in: [packages/core/src/widgets/node.ts:88](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L88)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`destroyed`](widgets.scrollabletext.Class.ScrollableText.md#destroyed)

---

### runtime

> **runtime**: [`Runtime`](runtime.Interface.Runtime.md)

Defined in: [packages/core/src/widgets/node.ts:90](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L90)

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`runtime`](widgets.scrollabletext.Class.ScrollableText.md#runtime)

## Accessors

### focused

#### Get Signature

> **get** **focused**(): `boolean`

Defined in: [packages/core/src/widgets/element.ts:115](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L115)

##### Returns

`boolean`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`focused`](widgets.scrollabletext.Class.ScrollableText.md#focused)

---

### visible

#### Get Signature

> **get** **visible**(): `boolean`

Defined in: [packages/core/src/widgets/element.ts:992](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L992)

##### Returns

`boolean`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`visible`](widgets.scrollabletext.Class.ScrollableText.md#visible)

---

### \_detached

#### Get Signature

> **get** **\_detached**(): `boolean`

Defined in: [packages/core/src/widgets/element.ts:1003](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1003)

##### Returns

`boolean`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_detached`](widgets.scrollabletext.Class.ScrollableText.md#_detached)

---

### draggable

#### Get Signature

> **get** **draggable**(): `boolean`

Defined in: [packages/core/src/widgets/element.ts:1036](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1036)

##### Returns

`boolean`

#### Set Signature

> **set** **draggable**(`draggable`): `void`

Defined in: [packages/core/src/widgets/element.ts:1040](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1040)

##### Parameters

###### draggable

`any`

##### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`draggable`](widgets.scrollabletext.Class.ScrollableText.md#draggable)

---

### width

#### Get Signature

> **get** **width**(): `number`

Defined in: [packages/core/src/widgets/element.ts:1437](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1437)

##### Returns

`number`

#### Set Signature

> **set** **width**(`val`): `void`

Defined in: [packages/core/src/widgets/element.ts:1641](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1641)

Position Setters

##### Parameters

###### val

`any`

##### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`width`](widgets.scrollabletext.Class.ScrollableText.md#width)

---

### height

#### Get Signature

> **get** **height**(): `number`

Defined in: [packages/core/src/widgets/element.ts:1488](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1488)

##### Returns

`number`

#### Set Signature

> **set** **height**(`val`): `void`

Defined in: [packages/core/src/widgets/element.ts:1649](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1649)

##### Parameters

###### val

`any`

##### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`height`](widgets.scrollabletext.Class.ScrollableText.md#height)

---

### aleft

#### Get Signature

> **get** **aleft**(): `number`

Defined in: [packages/core/src/widgets/element.ts:1525](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1525)

##### Returns

`number`

#### Set Signature

> **set** **aleft**(`val`): `void`

Defined in: [packages/core/src/widgets/element.ts:1657](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1657)

##### Parameters

###### val

`any`

##### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`aleft`](widgets.scrollabletext.Class.ScrollableText.md#aleft)

---

### aright

#### Get Signature

> **get** **aright**(): `number`

Defined in: [packages/core/src/widgets/element.ts:1550](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1550)

##### Returns

`number`

#### Set Signature

> **set** **aright**(`val`): `void`

Defined in: [packages/core/src/widgets/element.ts:1678](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1678)

##### Parameters

###### val

`any`

##### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`aright`](widgets.scrollabletext.Class.ScrollableText.md#aright)

---

### atop

#### Get Signature

> **get** **atop**(): `number`

Defined in: [packages/core/src/widgets/element.ts:1587](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1587)

##### Returns

`number`

#### Set Signature

> **set** **atop**(`val`): `void`

Defined in: [packages/core/src/widgets/element.ts:1686](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1686)

##### Parameters

###### val

`any`

##### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`atop`](widgets.scrollabletext.Class.ScrollableText.md#atop)

---

### abottom

#### Get Signature

> **get** **abottom**(): `number`

Defined in: [packages/core/src/widgets/element.ts:1612](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1612)

##### Returns

`number`

#### Set Signature

> **set** **abottom**(`val`): `void`

Defined in: [packages/core/src/widgets/element.ts:1707](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1707)

##### Parameters

###### val

`any`

##### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`abottom`](widgets.scrollabletext.Class.ScrollableText.md#abottom)

---

### rleft

#### Get Signature

> **get** **rleft**(): `number`

Defined in: [packages/core/src/widgets/element.ts:1616](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1616)

##### Returns

`number`

#### Set Signature

> **set** **rleft**(`val`): `void`

Defined in: [packages/core/src/widgets/element.ts:1715](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1715)

##### Parameters

###### val

`any`

##### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`rleft`](widgets.scrollabletext.Class.ScrollableText.md#rleft)

---

### rright

#### Get Signature

> **get** **rright**(): `number`

Defined in: [packages/core/src/widgets/element.ts:1620](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1620)

##### Returns

`number`

#### Set Signature

> **set** **rright**(`val`): `void`

Defined in: [packages/core/src/widgets/element.ts:1723](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1723)

##### Parameters

###### val

`any`

##### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`rright`](widgets.scrollabletext.Class.ScrollableText.md#rright)

---

### rtop

#### Get Signature

> **get** **rtop**(): `number`

Defined in: [packages/core/src/widgets/element.ts:1624](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1624)

##### Returns

`number`

#### Set Signature

> **set** **rtop**(`val`): `void`

Defined in: [packages/core/src/widgets/element.ts:1730](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1730)

##### Parameters

###### val

`any`

##### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`rtop`](widgets.scrollabletext.Class.ScrollableText.md#rtop)

---

### rbottom

#### Get Signature

> **get** **rbottom**(): `number`

Defined in: [packages/core/src/widgets/element.ts:1628](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1628)

##### Returns

`number`

#### Set Signature

> **set** **rbottom**(`val`): `void`

Defined in: [packages/core/src/widgets/element.ts:1738](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1738)

##### Parameters

###### val

`any`

##### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`rbottom`](widgets.scrollabletext.Class.ScrollableText.md#rbottom)

---

### ileft

#### Get Signature

> **get** **ileft**(): `number`

Defined in: [packages/core/src/widgets/element.ts:1745](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1745)

##### Returns

`number`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`ileft`](widgets.scrollabletext.Class.ScrollableText.md#ileft)

---

### itop

#### Get Signature

> **get** **itop**(): `number`

Defined in: [packages/core/src/widgets/element.ts:1750](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1750)

##### Returns

`number`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`itop`](widgets.scrollabletext.Class.ScrollableText.md#itop)

---

### iright

#### Get Signature

> **get** **iright**(): `number`

Defined in: [packages/core/src/widgets/element.ts:1755](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1755)

##### Returns

`number`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`iright`](widgets.scrollabletext.Class.ScrollableText.md#iright)

---

### ibottom

#### Get Signature

> **get** **ibottom**(): `number`

Defined in: [packages/core/src/widgets/element.ts:1760](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1760)

##### Returns

`number`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`ibottom`](widgets.scrollabletext.Class.ScrollableText.md#ibottom)

---

### iwidth

#### Get Signature

> **get** **iwidth**(): `number`

Defined in: [packages/core/src/widgets/element.ts:1765](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1765)

##### Returns

`number`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`iwidth`](widgets.scrollabletext.Class.ScrollableText.md#iwidth)

---

### iheight

#### Get Signature

> **get** **iheight**(): `number`

Defined in: [packages/core/src/widgets/element.ts:1772](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1772)

##### Returns

`number`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`iheight`](widgets.scrollabletext.Class.ScrollableText.md#iheight)

---

### tpadding

#### Get Signature

> **get** **tpadding**(): `number`

Defined in: [packages/core/src/widgets/element.ts:1779](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1779)

##### Returns

`number`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`tpadding`](widgets.scrollabletext.Class.ScrollableText.md#tpadding)

---

### left

#### Get Signature

> **get** **left**(): `number`

Defined in: [packages/core/src/widgets/element.ts:1792](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1792)

Relative coordinates as default properties

##### Returns

`number`

#### Set Signature

> **set** **left**(`val`): `void`

Defined in: [packages/core/src/widgets/element.ts:1808](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1808)

##### Parameters

###### val

`any`

##### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`left`](widgets.scrollabletext.Class.ScrollableText.md#left)

---

### right

#### Get Signature

> **get** **right**(): `number`

Defined in: [packages/core/src/widgets/element.ts:1796](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1796)

##### Returns

`number`

#### Set Signature

> **set** **right**(`val`): `void`

Defined in: [packages/core/src/widgets/element.ts:1812](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1812)

##### Parameters

###### val

`any`

##### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`right`](widgets.scrollabletext.Class.ScrollableText.md#right)

---

### top

#### Get Signature

> **get** **top**(): `number`

Defined in: [packages/core/src/widgets/element.ts:1800](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1800)

##### Returns

`number`

#### Set Signature

> **set** **top**(`val`): `void`

Defined in: [packages/core/src/widgets/element.ts:1816](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1816)

##### Parameters

###### val

`any`

##### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`top`](widgets.scrollabletext.Class.ScrollableText.md#top)

---

### bottom

#### Get Signature

> **get** **bottom**(): `number`

Defined in: [packages/core/src/widgets/element.ts:1804](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1804)

##### Returns

`number`

#### Set Signature

> **set** **bottom**(`val`): `void`

Defined in: [packages/core/src/widgets/element.ts:1820](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1820)

##### Parameters

###### val

`any`

##### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`bottom`](widgets.scrollabletext.Class.ScrollableText.md#bottom)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`setMaxListeners`](widgets.scrollabletext.Class.ScrollableText.md#setmaxlisteners)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`addListener`](widgets.scrollabletext.Class.ScrollableText.md#addlistener)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`on`](widgets.scrollabletext.Class.ScrollableText.md#on)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`removeListener`](widgets.scrollabletext.Class.ScrollableText.md#removelistener)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`off`](widgets.scrollabletext.Class.ScrollableText.md#off)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`removeAllListeners`](widgets.scrollabletext.Class.ScrollableText.md#removealllisteners)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`once`](widgets.scrollabletext.Class.ScrollableText.md#once)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`listeners`](widgets.scrollabletext.Class.ScrollableText.md#listeners)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_emit`](widgets.scrollabletext.Class.ScrollableText.md#_emit)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`emit`](widgets.scrollabletext.Class.ScrollableText.md#emit)

---

### sattr()

> **sattr**(`style`, `fg?`, `bg?`): `number`

Defined in: [packages/core/src/widgets/element.ts:327](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L327)

#### Parameters

##### style

`any`

##### fg?

`any`

##### bg?

`any`

#### Returns

`number`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`sattr`](widgets.scrollabletext.Class.ScrollableText.md#sattr)

---

### onScreenEvent()

> **onScreenEvent**(`type`, `handler`): `void`

Defined in: [packages/core/src/widgets/element.ts:373](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L373)

Same as el.on('screen', ...) except this will automatically keep track of which listeners
are bound to the screen object. For use with removeScreenEvent(), free(), and destroy().

#### Parameters

##### type

`string`

Event type

##### handler

(...`args`) => `void`

Event handler function

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`onScreenEvent`](widgets.scrollabletext.Class.ScrollableText.md#onscreenevent)

---

### onceScreenEvent()

> **onceScreenEvent**(`type`, `handler`): `void`

Defined in: [packages/core/src/widgets/element.ts:384](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L384)

Same as onScreenEvent() but fires only once.

#### Parameters

##### type

`string`

Event type

##### handler

(...`args`) => `void`

Event handler function

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`onceScreenEvent`](widgets.scrollabletext.Class.ScrollableText.md#oncescreenevent)

---

### removeScreenEvent()

> **removeScreenEvent**(`type`, `handler`): `void`

Defined in: [packages/core/src/widgets/element.ts:401](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L401)

Same as el.removeListener('screen', ...) except this will automatically keep track of which
listeners are bound to the screen object. For use with onScreenEvent(), free(), and destroy().

#### Parameters

##### type

`string`

Event type

##### handler

(...`args`) => `void`

Event handler function

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`removeScreenEvent`](widgets.scrollabletext.Class.ScrollableText.md#removescreenevent)

---

### free()

> **free**(): `void`

Defined in: [packages/core/src/widgets/element.ts:421](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L421)

Free up the element. Automatically unbind all events that may have been bound to the screen
object. This prevents memory leaks. For use with onScreenEvent(), removeScreenEvent(),
and destroy().

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`free`](widgets.scrollabletext.Class.ScrollableText.md#free)

---

### hide()

> **hide**(): `void`

Defined in: [packages/core/src/widgets/element.ts:433](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L433)

Hide element.

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`hide`](widgets.scrollabletext.Class.ScrollableText.md#hide)

---

### show()

> **show**(): `void`

Defined in: [packages/core/src/widgets/element.ts:446](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L446)

Show element.

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`show`](widgets.scrollabletext.Class.ScrollableText.md#show)

---

### toggle()

> **toggle**(): `void`

Defined in: [packages/core/src/widgets/element.ts:455](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L455)

Toggle hidden/shown.

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`toggle`](widgets.scrollabletext.Class.ScrollableText.md#toggle)

---

### focus()

> **focus**(): `any`

Defined in: [packages/core/src/widgets/element.ts:462](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L462)

Focus element.

#### Returns

`any`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`focus`](widgets.scrollabletext.Class.ScrollableText.md#focus)

---

### isFocusable()

> **isFocusable**(): `boolean`

Defined in: [packages/core/src/widgets/element.ts:470](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L470)

Check if this element can receive keyboard focus.
Elements are focusable if they have tabIndex >= -1.

#### Returns

`boolean`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`isFocusable`](widgets.scrollabletext.Class.ScrollableText.md#isfocusable)

---

### isInTabOrder()

> **isInTabOrder**(): `boolean`

Defined in: [packages/core/src/widgets/element.ts:478](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L478)

Check if element participates in Tab key navigation.
Elements with tabIndex=-1 are focusable but excluded from Tab order.

#### Returns

`boolean`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`isInTabOrder`](widgets.scrollabletext.Class.ScrollableText.md#isintaborder)

---

### getTabIndex()

> **getTabIndex**(): `number`

Defined in: [packages/core/src/widgets/element.ts:487](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L487)

Get effective tab index for focus navigation ordering.

#### Returns

`number`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`getTabIndex`](widgets.scrollabletext.Class.ScrollableText.md#gettabindex)

---

### setContent()

> **setContent**(`content`, `noClear?`, `noTags?`): `void`

Defined in: [packages/core/src/widgets/element.ts:499](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L499)

Set or get the content. Note: When text is input, it will be stripped of all non-SGR
escape codes, tabs will be replaced with 8 spaces, and tags will be replaced
with SGR codes (if enabled).

#### Parameters

##### content

`string`

##### noClear?

`boolean`

##### noTags?

`boolean`

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`setContent`](widgets.scrollabletext.Class.ScrollableText.md#setcontent)

---

### getContent()

> **getContent**(): `string`

Defined in: [packages/core/src/widgets/element.ts:509](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L509)

Return content, slightly different from el.content. Assume the above formatting.

#### Returns

`string`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`getContent`](widgets.scrollabletext.Class.ScrollableText.md#getcontent)

---

### getBorderLength()

> **getBorderLength**(): `number`

Defined in: [packages/core/src/widgets/element.ts:522](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L522)

Get the border perimeter length (number of border cells).
Useful for creating colors arrays for addressable border animations.

#### Returns

`number`

Number of border cells, or 0 if no border

#### Example

```ts
const box = new Box({ width: 20, height: 10, border: { type: "line" } });
console.log(box.getBorderLength()); // 56 (2 * (20 + 10) - 4)
```

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`getBorderLength`](widgets.scrollabletext.Class.ScrollableText.md#getborderlength)

---

### getBorderColors()

> **getBorderColors**(): (`string` \| `number`)[]

Defined in: [packages/core/src/widgets/element.ts:538](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L538)

Get the current border colors array (for addressable border animations).
Returns a copy to prevent external mutations.

#### Returns

(`string` \| `number`)[]

Copy of colors array, or empty array if not set

#### Example

```ts
const colors = box.getBorderColors();
const rotated = rotateColors(colors, 1);
box.setBorderColors(rotated);
```

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`getBorderColors`](widgets.scrollabletext.Class.ScrollableText.md#getbordercolors)

---

### setBorderColors()

> **setBorderColors**(`colors`): `void`

Defined in: [packages/core/src/widgets/element.ts:560](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L560)

Set border colors array for addressable border animations.
Stores an internal copy to prevent external mutations.
Call screen.render() after to see changes.

#### Parameters

##### colors

(`string` \| `number`)[]

Array of colors (names, hex codes, or numeric codes)

#### Returns

`void`

#### Example

```ts
// Rainbow animation
const colors = generateRainbow(box.getBorderLength());
box.setBorderColors(colors);
screen.render();

// Later, animate
setInterval(() => {
  const rotated = rotateColors(box.getBorderColors(), 1);
  box.setBorderColors(rotated);
  screen.render();
}, 100);
```

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`setBorderColors`](widgets.scrollabletext.Class.ScrollableText.md#setbordercolors)

---

### setText()

> **setText**(`content`, `noClear?`): `void`

Defined in: [packages/core/src/widgets/element.ts:567](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L567)

Similar to setContent, but ignore tags and remove escape codes.

#### Parameters

##### content

`string`

##### noClear?

`boolean`

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`setText`](widgets.scrollabletext.Class.ScrollableText.md#settext)

---

### getText()

> **getText**(): `string`

Defined in: [packages/core/src/widgets/element.ts:576](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L576)

Similar to getContent, but return content with tags and escape codes removed.

#### Returns

`string`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`getText`](widgets.scrollabletext.Class.ScrollableText.md#gettext)

---

### parseContent()

> **parseContent**(`noTags?`): `boolean`

Defined in: [packages/core/src/widgets/element.ts:580](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L580)

#### Parameters

##### noTags?

`boolean`

#### Returns

`boolean`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`parseContent`](widgets.scrollabletext.Class.ScrollableText.md#parsecontent)

---

### \_parseTags()

> **\_parseTags**(`text`): `string`

Defined in: [packages/core/src/widgets/element.ts:656](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L656)

#### Parameters

##### text

`string`

#### Returns

`string`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_parseTags`](widgets.scrollabletext.Class.ScrollableText.md#_parsetags)

---

### \_parseAttr()

> **\_parseAttr**(`lines`): `any`

Defined in: [packages/core/src/widgets/element.ts:761](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L761)

#### Parameters

##### lines

`any`

#### Returns

`any`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_parseAttr`](widgets.scrollabletext.Class.ScrollableText.md#_parseattr)

---

### \_align()

> **\_align**(`line`, `width`, `align?`): `string`

Defined in: [packages/core/src/widgets/element.ts:790](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L790)

#### Parameters

##### line

`string`

##### width

`number`

##### align?

`string`

#### Returns

`string`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_align`](widgets.scrollabletext.Class.ScrollableText.md#_align)

---

### \_wrapContent()

> **\_wrapContent**(`content`, `width`): `WrappedContent`

Defined in: [packages/core/src/widgets/element.ts:822](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L822)

#### Parameters

##### content

`string`

##### width

`number`

#### Returns

`WrappedContent`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_wrapContent`](widgets.scrollabletext.Class.ScrollableText.md#_wrapcontent)

---

### enableMouse()

> **enableMouse**(): `void`

Defined in: [packages/core/src/widgets/element.ts:1016](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1016)

Enable mouse events for the element (automatically called when a form of on('mouse') is bound).
Registers the element as clickable with the screen.

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`enableMouse`](widgets.scrollabletext.Class.ScrollableText.md#enablemouse)

---

### enableKeys()

> **enableKeys**(): `void`

Defined in: [packages/core/src/widgets/element.ts:1024](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1024)

Enable keypress events for the element (automatically called when a form of on('keypress') is bound).
Registers the element as keyable with the screen.

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`enableKeys`](widgets.scrollabletext.Class.ScrollableText.md#enablekeys)

---

### enableInput()

> **enableInput**(): `void`

Defined in: [packages/core/src/widgets/element.ts:1031](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1031)

Enable key and mouse events. Calls both enableMouse() and enableKeys().

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`enableInput`](widgets.scrollabletext.Class.ScrollableText.md#enableinput)

---

### enableDrag()

> **enableDrag**(`verify?`): `boolean`

Defined in: [packages/core/src/widgets/element.ts:1054](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1054)

Enable dragging of the element.
Allows the element to be dragged with the mouse. Automatically calls enableMouse().

#### Parameters

##### verify?

`any`

Optional callback function to verify if dragging should start (receives mouse data)

#### Returns

`boolean`

True if dragging was enabled

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`enableDrag`](widgets.scrollabletext.Class.ScrollableText.md#enabledrag)

---

### disableDrag()

> **disableDrag**(): `boolean`

Defined in: [packages/core/src/widgets/element.ts:1128](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1128)

Disable dragging of the element.
Removes drag event handlers and resets dragging state.

#### Returns

`boolean`

True if dragging was disabled

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`disableDrag`](widgets.scrollabletext.Class.ScrollableText.md#disabledrag)

---

### key()

> **key**(...`args`): `any`

Defined in: [packages/core/src/widgets/element.ts:1142](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1142)

Bind a key event handler.

#### Parameters

##### args

...`any`[]

Arguments to pass to program.key()

#### Returns

`any`

The bound key handler

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`key`](widgets.scrollabletext.Class.ScrollableText.md#key)

---

### onceKey()

> **onceKey**(...`args`): `any`

Defined in: [packages/core/src/widgets/element.ts:1151](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1151)

Bind a key event handler that fires only once.

#### Parameters

##### args

...`any`[]

Arguments to pass to program.onceKey()

#### Returns

`any`

The bound key handler

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`onceKey`](widgets.scrollabletext.Class.ScrollableText.md#oncekey)

---

### unkey()

> **unkey**(...`args`): `any`

Defined in: [packages/core/src/widgets/element.ts:1160](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1160)

Unbind a key event handler.

#### Parameters

##### args

...`any`[]

Arguments to pass to program.unkey()

#### Returns

`any`

Result of unbinding

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`unkey`](widgets.scrollabletext.Class.ScrollableText.md#unkey)

---

### removeKey()

> **removeKey**(...`args`): `any`

Defined in: [packages/core/src/widgets/element.ts:1170](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1170)

Remove a key event handler.
Alias for unkey().

#### Parameters

##### args

...`any`[]

Arguments to pass to program.unkey()

#### Returns

`any`

Result of removing

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`removeKey`](widgets.scrollabletext.Class.ScrollableText.md#removekey)

---

### setIndex()

> **setIndex**(`index`): `void`

Defined in: [packages/core/src/widgets/element.ts:1179](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1179)

Set the z-index of the element (changes rendering order).
Higher indices are rendered later (on top). Negative indices count from the end.

#### Parameters

##### index

`number`

New z-index value

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`setIndex`](widgets.scrollabletext.Class.ScrollableText.md#setindex)

---

### setFront()

> **setFront**(): `void`

Defined in: [packages/core/src/widgets/element.ts:1200](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1200)

Put the element in front of its siblings.
Sets the element's z-index to the highest value (renders last/on top).

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`setFront`](widgets.scrollabletext.Class.ScrollableText.md#setfront)

---

### setBack()

> **setBack**(): `void`

Defined in: [packages/core/src/widgets/element.ts:1208](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1208)

Put the element in back of its siblings.
Sets the element's z-index to the lowest value (renders first/at bottom).

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`setBack`](widgets.scrollabletext.Class.ScrollableText.md#setback)

---

### clearPos()

> **clearPos**(`get?`, `override?`): `void`

Defined in: [packages/core/src/widgets/element.ts:1218](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1218)

Clear the element's position in the screen buffer.
Fills the region with spaces, used when moving or hiding elements.

#### Parameters

##### get?

`boolean`

Whether to use \_getCoords (default: false)

##### override?

`any`

If true, always clear even if cell hasn't changed

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`clearPos`](widgets.scrollabletext.Class.ScrollableText.md#clearpos)

---

### setLabel()

> **setLabel**(`options`): `void`

Defined in: [packages/core/src/widgets/element.ts:1233](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1233)

Set the label text for the top-left (or top-right) corner.
Creates or updates a label that appears on the top border of the element.

#### Parameters

##### options

`any`

Label text (string) or options object with text and side properties

#### Returns

`void`

#### Example

```ts
element.setLabel("My Label");
element.setLabel({ text: "My Label", side: "right" });
```

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`setLabel`](widgets.scrollabletext.Class.ScrollableText.md#setlabel)

---

### removeLabel()

> **removeLabel**(): `void`

Defined in: [packages/core/src/widgets/element.ts:1312](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1312)

Remove the label completely.
Detaches the label element and removes associated event listeners.

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`removeLabel`](widgets.scrollabletext.Class.ScrollableText.md#removelabel)

---

### setHover()

> **setHover**(`options`): `void`

Defined in: [packages/core/src/widgets/element.ts:1329](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1329)

Set a hover text box to follow the cursor. Similar to the "title" DOM attribute in the browser.

#### Parameters

##### options

`any`

Hover text (string) or options object with text property

#### Returns

`void`

#### Example

```ts
element.setHover("Hover text here");
element.setHover({ text: "Hover text here" });
```

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`setHover`](widgets.scrollabletext.Class.ScrollableText.md#sethover)

---

### removeHover()

> **removeHover**(): `void`

Defined in: [packages/core/src/widgets/element.ts:1343](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1343)

Remove the hover label completely.
Detaches the hover text box if it's currently displayed.

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`removeHover`](widgets.scrollabletext.Class.ScrollableText.md#removehover)

---

### \_getPos()

> **\_getPos**(): `any`

Defined in: [packages/core/src/widgets/element.ts:1369](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1369)

Positioning

#### Returns

`any`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_getPos`](widgets.scrollabletext.Class.ScrollableText.md#_getpos)

---

### \_getWidth()

> **\_getWidth**(`get?`): `number`

Defined in: [packages/core/src/widgets/element.ts:1390](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1390)

Position Getters

#### Parameters

##### get?

`boolean`

#### Returns

`number`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_getWidth`](widgets.scrollabletext.Class.ScrollableText.md#_getwidth)

---

### \_getHeight()

> **\_getHeight**(`get?`): `number`

Defined in: [packages/core/src/widgets/element.ts:1441](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1441)

#### Parameters

##### get?

`boolean`

#### Returns

`number`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_getHeight`](widgets.scrollabletext.Class.ScrollableText.md#_getheight)

---

### \_getLeft()

> **\_getLeft**(`get?`): `number`

Defined in: [packages/core/src/widgets/element.ts:1492](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1492)

#### Parameters

##### get?

`boolean`

#### Returns

`number`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_getLeft`](widgets.scrollabletext.Class.ScrollableText.md#_getleft)

---

### \_getRight()

> **\_getRight**(`get?`): `number`

Defined in: [packages/core/src/widgets/element.ts:1529](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1529)

#### Parameters

##### get?

`boolean`

#### Returns

`number`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_getRight`](widgets.scrollabletext.Class.ScrollableText.md#_getright)

---

### \_getTop()

> **\_getTop**(`get?`): `number`

Defined in: [packages/core/src/widgets/element.ts:1554](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1554)

#### Parameters

##### get?

`boolean`

#### Returns

`number`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_getTop`](widgets.scrollabletext.Class.ScrollableText.md#_gettop)

---

### \_getBottom()

> **\_getBottom**(`get?`): `number`

Defined in: [packages/core/src/widgets/element.ts:1591](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1591)

#### Parameters

##### get?

`boolean`

#### Returns

`number`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_getBottom`](widgets.scrollabletext.Class.ScrollableText.md#_getbottom)

---

### \_getShrinkBox()

> **\_getShrinkBox**(`xi`, `xl`, `yi`, `yl`, `get?`): `any`

Defined in: [packages/core/src/widgets/element.ts:1828](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1828)

Rendering - here be dragons

#### Parameters

##### xi

`number`

##### xl

`number`

##### yi

`number`

##### yl

`number`

##### get?

`boolean`

#### Returns

`any`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_getShrinkBox`](widgets.scrollabletext.Class.ScrollableText.md#_getshrinkbox)

---

### \_getShrinkContent()

> **\_getShrinkContent**(`xi`, `xl`, `yi`, `yl`, `_get?`): `any`

Defined in: [packages/core/src/widgets/element.ts:1979](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L1979)

#### Parameters

##### xi

`number`

##### xl

`number`

##### yi

`number`

##### yl

`number`

##### \_get?

`boolean`

#### Returns

`any`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_getShrinkContent`](widgets.scrollabletext.Class.ScrollableText.md#_getshrinkcontent)

---

### \_getShrink()

> **\_getShrink**(`xi`, `xl`, `yi`, `yl`, `get?`): `any`

Defined in: [packages/core/src/widgets/element.ts:2015](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L2015)

#### Parameters

##### xi

`number`

##### xl

`number`

##### yi

`number`

##### yl

`number`

##### get?

`boolean`

#### Returns

`any`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_getShrink`](widgets.scrollabletext.Class.ScrollableText.md#_getshrink)

---

### \_getCoords()

> **\_getCoords**(`get?`, `noscroll?`): `RenderCoords` \| `undefined`

Defined in: [packages/core/src/widgets/element.ts:2060](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L2060)

#### Parameters

##### get?

`boolean`

##### noscroll?

`boolean`

#### Returns

`RenderCoords` \| `undefined`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_getCoords`](widgets.scrollabletext.Class.ScrollableText.md#_getcoords)

---

### render()

> **render**(): `any`

Defined in: [packages/core/src/widgets/element.ts:2233](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L2233)

Write content and children to the screen buffer.
This is the main rendering method that draws the element, its border, scrollbar,
and all child elements to the screen buffer. Returns the rendered coordinates.

#### Returns

`any`

Rendered coordinates object, or undefined if hidden/invalid

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`render`](widgets.scrollabletext.Class.ScrollableText.md#render)

---

### \_render()

> **\_render**(): `any`

Defined in: [packages/core/src/widgets/element.ts:2893](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L2893)

Internal alias for render().

#### Returns

`any`

Rendered coordinates object

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`_render`](widgets.scrollabletext.Class.ScrollableText.md#_render)

---

### insertLine()

> **insertLine**(`i`, `line`): `void`

Defined in: [packages/core/src/widgets/element.ts:2907](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L2907)

Insert a line into the box's content.
Handles wrapped content by inserting at the specified fake line index.

#### Parameters

##### i

`number`

Line index to insert at (fake line number)

##### line

Line or array of lines to insert

`string` | `string`[]

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`insertLine`](widgets.scrollabletext.Class.ScrollableText.md#insertline)

---

### deleteLine()

> **deleteLine**(`i`, `n?`): `void`

Defined in: [packages/core/src/widgets/element.ts:2968](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L2968)

Delete a line from the box's content.
Handles wrapped content by deleting at the specified fake line index.

#### Parameters

##### i

`number`

Line index to delete (fake line number)

##### n?

`number`

Number of lines to delete (default: 1)

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`deleteLine`](widgets.scrollabletext.Class.ScrollableText.md#deleteline)

---

### insertTop()

> **insertTop**(`line`): `void`

Defined in: [packages/core/src/widgets/element.ts:3024](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L3024)

Insert a line at the top of the box.
Inserts at the first visible line based on childBase.

#### Parameters

##### line

Line or array of lines to insert

`string` | `string`[]

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`insertTop`](widgets.scrollabletext.Class.ScrollableText.md#inserttop)

---

### insertBottom()

> **insertBottom**(`line`): `void`

Defined in: [packages/core/src/widgets/element.ts:3034](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L3034)

Insert a line at the bottom of the box.
Inserts after the last visible line based on height and childBase.

#### Parameters

##### line

Line or array of lines to insert

`string` | `string`[]

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`insertBottom`](widgets.scrollabletext.Class.ScrollableText.md#insertbottom)

---

### deleteTop()

> **deleteTop**(`n?`): `void`

Defined in: [packages/core/src/widgets/element.ts:3047](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L3047)

Delete a line at the top of the box.
Deletes from the first visible line based on childBase.

#### Parameters

##### n?

`number`

Number of lines to delete (default: 1)

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`deleteTop`](widgets.scrollabletext.Class.ScrollableText.md#deletetop)

---

### deleteBottom()

> **deleteBottom**(`n?`): `void`

Defined in: [packages/core/src/widgets/element.ts:3057](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L3057)

Delete a line at the bottom of the box.
Deletes from the last visible line based on height and childBase.

#### Parameters

##### n?

`number`

Number of lines to delete (default: 1)

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`deleteBottom`](widgets.scrollabletext.Class.ScrollableText.md#deletebottom)

---

### setLine()

> **setLine**(`i`, `line`): `void`

Defined in: [packages/core/src/widgets/element.ts:3072](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L3072)

Set a line in the box's content.

#### Parameters

##### i

`number`

Line index to set (fake line number)

##### line

`string`

Line content to set

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`setLine`](widgets.scrollabletext.Class.ScrollableText.md#setline)

---

### setBaseLine()

> **setBaseLine**(`i`, `line`): `void`

Defined in: [packages/core/src/widgets/element.ts:3086](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L3086)

Set a line in the box's content from the visible top.

#### Parameters

##### i

`number`

Line offset from visible top

##### line

`string`

Line content to set

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`setBaseLine`](widgets.scrollabletext.Class.ScrollableText.md#setbaseline)

---

### getLine()

> **getLine**(`i`): `string`

Defined in: [packages/core/src/widgets/element.ts:3096](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L3096)

Get a line from the box's content.

#### Parameters

##### i

`number`

Line index to get (fake line number)

#### Returns

`string`

Line content

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`getLine`](widgets.scrollabletext.Class.ScrollableText.md#getline)

---

### getBaseLine()

> **getBaseLine**(`i`): `string`

Defined in: [packages/core/src/widgets/element.ts:3107](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L3107)

Get a line from the box's content from the visible top.

#### Parameters

##### i

`number`

Line offset from visible top

#### Returns

`string`

Line content

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`getBaseLine`](widgets.scrollabletext.Class.ScrollableText.md#getbaseline)

---

### clearLine()

> **clearLine**(`i`): `void`

Defined in: [packages/core/src/widgets/element.ts:3116](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L3116)

Clear a line from the box's content.

#### Parameters

##### i

`number`

Line index to clear (fake line number)

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`clearLine`](widgets.scrollabletext.Class.ScrollableText.md#clearline)

---

### clearBaseLine()

> **clearBaseLine**(`i`): `void`

Defined in: [packages/core/src/widgets/element.ts:3125](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L3125)

Clear a line from the box's content from the visible top.

#### Parameters

##### i

`number`

Line offset from visible top

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`clearBaseLine`](widgets.scrollabletext.Class.ScrollableText.md#clearbaseline)

---

### unshiftLine()

> **unshiftLine**(`line`): `void`

Defined in: [packages/core/src/widgets/element.ts:3134](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L3134)

Unshift a line onto the top of the content.

#### Parameters

##### line

Line or array of lines to insert

`string` | `string`[]

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`unshiftLine`](widgets.scrollabletext.Class.ScrollableText.md#unshiftline)

---

### shiftLine()

> **shiftLine**(`i?`, `n?`): `void`

Defined in: [packages/core/src/widgets/element.ts:3143](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L3143)

Shift a line off the top of the content.

#### Parameters

##### i?

`number`

Line index to remove (default: 0)

##### n?

`number`

Number of lines to remove (default: 1)

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`shiftLine`](widgets.scrollabletext.Class.ScrollableText.md#shiftline)

---

### pushLine()

> **pushLine**(`line`): `void`

Defined in: [packages/core/src/widgets/element.ts:3151](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L3151)

Push a line onto the bottom of the content.

#### Parameters

##### line

Line or array of lines to insert

`string` | `string`[]

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`pushLine`](widgets.scrollabletext.Class.ScrollableText.md#pushline)

---

### popLine()

> **popLine**(`n?`): `void`

Defined in: [packages/core/src/widgets/element.ts:3160](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L3160)

Pop a line off the bottom of the content.

#### Parameters

##### n?

`number`

Number of lines to remove (default: 1)

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`popLine`](widgets.scrollabletext.Class.ScrollableText.md#popline)

---

### getLines()

> **getLines**(): `string`[]

Defined in: [packages/core/src/widgets/element.ts:3168](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L3168)

An array containing the content lines.

#### Returns

`string`[]

Array of fake (unwrapped) lines

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`getLines`](widgets.scrollabletext.Class.ScrollableText.md#getlines)

---

### getScreenLines()

> **getScreenLines**(): `string`[]

Defined in: [packages/core/src/widgets/element.ts:3176](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L3176)

An array containing the lines as they are displayed on the screen.

#### Returns

`string`[]

Array of real (wrapped) lines

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`getScreenLines`](widgets.scrollabletext.Class.ScrollableText.md#getscreenlines)

---

### strWidth()

> **strWidth**(`text`): `number`

Defined in: [packages/core/src/widgets/element.ts:3186](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L3186)

Get a string's displayed width, taking into account double-width, surrogate pairs,
combining characters, tags, and SGR escape codes.

#### Parameters

##### text

`string`

Text to measure

#### Returns

`number`

Displayed width in cells

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`strWidth`](widgets.scrollabletext.Class.ScrollableText.md#strwidth)

---

### screenshot()

> **screenshot**(`xi?`, `xl?`, `yi?`, `yl?`): `string`

Defined in: [packages/core/src/widgets/element.ts:3202](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/element.ts#L3202)

Take an SGR screenshot of the element within the region. Returns a string containing only
characters and SGR codes. Can be displayed by simply echoing it in a terminal.

#### Parameters

##### xi?

`number`

Left X offset from element's inner left (default: 0)

##### xl?

`number`

Right X offset from element's inner left (default: element width)

##### yi?

`number`

Top Y offset from element's inner top (default: 0)

##### yl?

`number`

Bottom Y offset from element's inner top (default: element height)

#### Returns

`string`

SGR-encoded screenshot string

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`screenshot`](widgets.scrollabletext.Class.ScrollableText.md#screenshot)

---

### setStaticHeader()

> **setStaticHeader**(`text`): `void`

Defined in: [packages/core/src/widgets/log.ts:113](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/log.ts#L113)

Set the static header text.

#### Parameters

##### text

`string`

Header text to display

#### Returns

`void`

---

### setStaticFooter()

> **setStaticFooter**(`text`): `void`

Defined in: [packages/core/src/widgets/log.ts:135](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/log.ts#L135)

Set the static footer text.

#### Parameters

##### text

`string`

Footer text to display

#### Returns

`void`

---

### log()

> **log**(...`args`): `any`

Defined in: [packages/core/src/widgets/log.ts:165](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/log.ts#L165)

Add a log line to the log element.
Alias for add().
Automatically scrolls to bottom unless user has scrolled manually.

#### Parameters

##### args

...`any`[]

Content to log (can be multiple arguments, formatted like util.format)

#### Returns

`any`

#### Example

```typescript
log.log("Server started");
log.log("User %s connected", username);
```

---

### add()

> **add**(...`args`): `any`

Defined in: [packages/core/src/widgets/log.ts:183](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/log.ts#L183)

Add a log line to the log element.
Automatically scrolls to bottom unless user has scrolled manually.
Supports formatting like util.format.

#### Parameters

##### args

...`any`[]

Content to add (can be multiple arguments, formatted like util.format)

#### Returns

`any`

Result from pushLine() operation

#### Example

```typescript
log.add("Status: OK");
log.add("Processing %d items", count);
```

---

### scroll()

> **scroll**(`offset`, `always?`): `any`

Defined in: [packages/core/src/widgets/log.ts:197](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/log.ts#L197)

Scroll the content by a relative offset.

#### Parameters

##### offset

`number`

The number of lines/items to scroll (positive = down, negative = up)

##### always?

`any`

Force the scroll operation even if position hasn't changed

#### Returns

`any`

#### Overrides

`ScrollableText.scroll`

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`insert`](widgets.scrollabletext.Class.ScrollableText.md#insert)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`prepend`](widgets.scrollabletext.Class.ScrollableText.md#prepend)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`append`](widgets.scrollabletext.Class.ScrollableText.md#append)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`insertBefore`](widgets.scrollabletext.Class.ScrollableText.md#insertbefore)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`insertAfter`](widgets.scrollabletext.Class.ScrollableText.md#insertafter)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`remove`](widgets.scrollabletext.Class.ScrollableText.md#remove)

---

### detach()

> **detach**(): `void`

Defined in: [packages/core/src/widgets/node.ts:255](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L255)

Remove node from its parent.

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`detach`](widgets.scrollabletext.Class.ScrollableText.md#detach)

---

### destroy()

> **destroy**(): `void`

Defined in: [packages/core/src/widgets/node.ts:271](https://github.com/vdeantoni/unblessed/blob/alpha/packages/core/src/widgets/node.ts#L271)

Same as the detach() method, except this will automatically call free() and unbind any screen
events to prevent memory leaks. For use with onScreenEvent(), removeScreenEvent(), and free().

#### Returns

`void`

#### Inherited from

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`destroy`](widgets.scrollabletext.Class.ScrollableText.md#destroy)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`forDescendants`](widgets.scrollabletext.Class.ScrollableText.md#fordescendants)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`forAncestors`](widgets.scrollabletext.Class.ScrollableText.md#forancestors)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`collectDescendants`](widgets.scrollabletext.Class.ScrollableText.md#collectdescendants)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`collectAncestors`](widgets.scrollabletext.Class.ScrollableText.md#collectancestors)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`emitDescendants`](widgets.scrollabletext.Class.ScrollableText.md#emitdescendants)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`emitAncestors`](widgets.scrollabletext.Class.ScrollableText.md#emitancestors)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`hasDescendant`](widgets.scrollabletext.Class.ScrollableText.md#hasdescendant)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`hasAncestor`](widgets.scrollabletext.Class.ScrollableText.md#hasancestor)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`get`](widgets.scrollabletext.Class.ScrollableText.md#get)

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

[`ScrollableText`](widgets.scrollabletext.Class.ScrollableText.md).[`set`](widgets.scrollabletext.Class.ScrollableText.md#set)
