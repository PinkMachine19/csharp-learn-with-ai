# Mental Models Visual Audit

This inventory covers every primary session. Each row records the concrete visual metaphor selected before implementation. Every session uses four moments of its own metaphor so the cards show behavior rather than four unrelated definitions.

| Session | Visual concept |
|---|---|
| 00 | A technician’s tool roll opens into a working multi-language workshop: choose, combine, ship. |
| 00.5 | A punch clock turns an open shift card into a completed hours receipt. |
| 00.6 | Requirement notes are sorted into labeled model drawers, behavior levers, and project shelves. |
| 01 | Loose project folders are clipped into one solution binder and protected by a Git ignore screen. |
| 02 | One-way power cords run from App, Web, and Infrastructure into Domain, which has no cord back. |
| 03 | Values move through labeled measuring cups: store, calculate, convert. |
| 03.5 | A market scale selects whole-number weights, measurement weights, or money weights by purpose. |
| 04 | A railway switch sends one arriving value down exactly one track toward its result. |
| 05 | A mailroom sends arguments through a method slot and receives one return parcel while locals stay inside. |
| 06 | A blueprint stamp produces separate houses whose constructors install required parts before handoff. |
| 07 | A two-position locker shows open/null and completed/value, with a guard blocking impossible access. |
| 08 | Two remote controls point to one television while copied paper readings change independently. |
| 09 | Three service windows show out filling a tray, ref reaching into caller storage, and in behind glass. |
| 10 | Fingerprints distinguish class identity while matching wax seals demonstrate record value equality. |
| 11 | A growing shelf accepts entries, a sieve exposes matches, and a turnstile releases one item at a time. |
| 12 | A numbered claim ticket opens one exact locker while a guest list rejects duplicate names. |
| 13 | The same storage room is viewed through progressively narrower access windows. |
| 14 | One adjustable workshop jig accepts different shapes and performs the same comparison operation. |
| 15 | A safety gate admits only shapes carrying the capability badge required by the generic machine. |
| 16 | A loading dock safely widens outgoing boxes and narrows incoming boxes according to variance direction. |
| 17 | A museum display case exposes viewing glass while its curator alone can add approved artifacts. |
| 18 | Different repository cartridges click into the same standardized service socket. |
| 19 | A family tree shares one inherited toolkit while each descendant supplies its own formatter head. |
| 20 | Program.cs acts as a wiring bench, plugging a repository contract into a service without hiding the cable. |
| 21 | Clock entries ride a sorting belt through filter, projection, and newest-first gates. |
| 22 | Entry cards fall into employee buckets, are weighed into summaries, then matched to name tags. |
| 23 | A live security monitor changes with the room while a camera photograph remains frozen. |
| 24 | A venue entrance uses a normal “not admitted” turnstile for expected rejection and an emergency barrier for invalid state. |
| 25 | A road closure propagates backward until a detour catches it, while a cleanup crew always closes the site. |
| 26 | A restaurant order ticket lets the worker leave and return when the pickup bell rings. |
| 27 | Two checkout lanes show sequential customers in one lane versus concurrent customers served together. |
| 28 | A relay baton must be awaited before the next runner starts, while a red stop token must be actively observed. |
| 29 | A laboratory bench moves one specimen through Arrange, Act, and Assert stations. |
| 30 | A theater uses stand-in actors and colored admission wristbands to demonstrate transient, scoped, and singleton lifetimes. |
| 31 | A warehouse clipboard tracks an entity as Added before a forklift commits it to a durable shelf. |
| 32 | A restaurant order slip is translated by the kitchen provider, executed there, and returned as plated rows. |
| 33 | A postal route maps one addressed HTTP envelope to a controller desk and returns a deliberate response envelope. |
| 34 | An airport checkpoint separates invalid tickets, known conflicts, and system failures while recording structured event tags. |
| 35 | A sealed package crosses Web, service, domain, repository, and database checkpoints in one end-to-end inspection. |
| 01B | A VS Code control console moves from navigation instruments to workspace controls, a deliberate launch selector, and a reset lever. |
| 03B | A label-printing ribbon carries a value through interpolation and formatting until different syntax produces the same readable receipt. |
| 04C | A mechanical selector contrasts a Boolean fork, a case dial, and a value-returning output chute. |
| 05B | A guarded mailbox separates hidden storage from getter/setter access while keeping one simple public slot. |
| 19B | A building divides its lobby, staff workshop, family stairway, and sealed room into distinct access zones. |
| 24B | A triage desk classifies an outcome, translates it across a boundary, and stamps the resulting contract for verification. |
| R0 | A source-to-runtime conveyor separates C# text, compiler output, managed assembly, CLR execution, reusable libraries, and SDK controls. |
| R1 | Geological strata accumulate newer C# features over a stable foundation while a version marker identifies availability. |
| R2 | A typed assembly line passes known shapes through capability, lambda, and LINQ stations without losing type information. |
| R3 | A baggage claim ticket represents eventual completion while work continues, cancellation is observed, and multiple belts remain distinct from parallel machinery. |
| R4 | A shape sorter narrows an unknown input through ordered patterns and reveals whether a nullable capsule contains a value. |
| R5 | A modular construction kit molds record values, locks initialization, feeds primary-constructor parts, and fills a collection basket. |

## Inventory findings

- Primary sessions inspected: 39.
- Optional side labs inspected: 6.
- C# refresher/bonus labs inspected: 5.
- Total lesson pages inspected: 50.
- Existing visual cards inspected: 200.
- Primary-session diagram keys before redesign: 65.
- Main duplicate families: `pipeline`, `call`, `branch`, `return`, `invariant`, `instances`, `tests`, and `feedback`.
- Decision: replace all 200 diagram assignments. Several existing ideas were directionally correct, but none were preserved unchanged because their shared rendering made them visually interchangeable.
