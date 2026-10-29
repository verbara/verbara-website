# Licence parity tools

The licence validator re-serializes a licence payload with System.Text.Json (STJ) and its default
options, then checks the ECDSA signature over those UTF-8 bytes. The issuer in
`functions/api/developer-license/` must therefore sign exactly what STJ writes. The tools here pin
that.

## StjVectors: the golden vectors

`StjVectors/` is a small .NET console that uses only the System.Text.Json library in the shared
framework (no package references). It writes `tests/fixtures/stj-canonical-vectors.json`:

- `metadata`: the .NET runtime and System.Text.Json version it ran on, and the generation date.
- `strings`: one entry per input string, with the input as an array of UTF-16 code units (so lone
  surrogates survive the file) and `stj`, the exact output of `JsonSerializer.Serialize(string)`.
  It covers every code point from U+0000 to U+007F, Latin-1, CJK and right-to-left samples,
  U+2028 and U+2029, a character outside the BMP, lone high and low surrogates, and realistic
  licensees.
- `payloads`: complete payloads serialized from a record with the same property names, order and
  .NET types as the licence payload (two strings, an int-backed enum, a `DateTimeOffset`, a flags
  enum and two ints), through a source-generated `JsonSerializerContext` with default options.
  `fields` holds the values (with `Licensee` as UTF-16 code units) and `stj` the exact bytes.

The vitest suite (`tests/unit/canonical-json.test.ts`) checks the issuer's canonical serializer
against every vector, so CI needs no .NET.

### Regenerating

Requires the .NET 10 SDK. From the repository root:

```bash
dotnet run --project scripts/licence-parity/StjVectors -- tests/fixtures/stj-canonical-vectors.json
```

Regenerate only with this generator, never by hand. Re-run it when the validator moves to a new
.NET version: if the default encoder changed, the diff shows it and the unit tests go red. Apart
from `metadata`, the output is deterministic.
