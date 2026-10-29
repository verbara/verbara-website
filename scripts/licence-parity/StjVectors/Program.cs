// Writes the System.Text.Json golden vectors the licence issuer's canonical
// serializer is tested against (tests/fixtures/stj-canonical-vectors.json).
//
// Every `stj` value is the exact output of System.Text.Json with its DEFAULT
// options (JavaScriptEncoder.Default), through a source-generated context.
// Inputs are stored as UTF-16 code-unit arrays so lone surrogates survive the
// round trip through the fixture file.
//
// Usage: dotnet run --project scripts/licence-parity/StjVectors -- <output.json>

using System.Globalization;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;

if (args.Length != 1)
{
    Console.Error.WriteLine("usage: StjVectors <output.json>");
    return 2;
}

var strings = new List<(string Label, string Value)>();

for (var c = 0; c <= 0x7F; c++)
{
    strings.Add(($"U+{c:X4}", ((char)c).ToString()));
}

(string Label, string Value)[] samples =
[
    ("latin1 U+0080", "\u0080"),
    ("latin1 U+009F", "\u009F"),
    ("latin1 NBSP U+00A0", "\u00A0"),
    ("latin1 inverted exclamation U+00A1", "\u00A1"),
    ("latin1 copyright U+00A9", "\u00A9"),
    ("latin1 soft hyphen U+00AD", "\u00AD"),
    ("latin1 inverted question U+00BF", "\u00BF"),
    ("latin1 A grave U+00C0", "\u00C0"),
    ("latin1 c cedilla U+00E7", "\u00E7"),
    ("latin1 e acute U+00E9", "\u00E9"),
    ("latin1 n tilde U+00F1", "\u00F1"),
    ("latin1 o stroke U+00F8", "\u00F8"),
    ("latin1 u diaeresis U+00FC", "\u00FC"),
    ("latin1 sharp s U+00DF", "\u00DF"),
    ("latin1 y diaeresis U+00FF", "\u00FF"),
    ("latin ext S caron U+0160", "\u0160"),
    ("cjk zhongwen", "\u4E2D\u6587"),
    ("cjk nihon", "\u65E5\u672C"),
    ("hiragana a U+3042", "\u3042"),
    ("hangul han U+D55C", "\uD55C"),
    ("hebrew shalom", "\u05E9\u05DC\u05D5\u05DD"),
    ("arabic marhaban", "\u0645\u0631\u062D\u0628\u0627"),
    ("right-to-left mark U+200F", "\u200F"),
    ("zero width joiner U+200D", "\u200D"),
    ("line separator U+2028", "\u2028"),
    ("paragraph separator U+2029", "\u2029"),
    ("euro sign U+20AC", "\u20AC"),
    ("byte order mark U+FEFF", "\uFEFF"),
    ("replacement character U+FFFD", "\uFFFD"),
    ("noncharacter U+FFFF", "\uFFFF"),
    ("emoji U+1F600 (surrogate pair)", "\U0001F600"),
    ("emoji U+1F680 in text", "Rocket \U0001F680 Labs"),
    ("lone high surrogate U+D83D", "\uD83D"),
    ("lone low surrogate U+DE00", "\uDE00"),
    ("lone high surrogate between ASCII", "a\uD800b"),
    ("lone low surrogate between ASCII", "a\uDC00b"),
    ("reversed surrogate pair", "\uDE00\uD83D"),
    ("high surrogate at end after text", "Acme \uD83D"),
    ("licensee plus tag", "dev+trial@example.com"),
    ("licensee plus tag with company", "dev+trial@example.com (Caf\u00E9 & S\u00F8n's <Ltd>)"),
    ("licensee quotes and backslash", "o'neil@example.com (A&B \"Quotes\" \\ back)"),
    ("licensee plain ascii", "dev@example.com (Analytical Engines)"),
];
strings.AddRange(samples);

const string FixedId = "00000000-0000-4000-8000-000000000001";
const string Expiry = "2026-11-27T23:59:59+00:00";
const int Developer = 1;
const int All = 4095;

var payloads = new List<(string Label, string LicenseId, string Licensee, int Tier, string ExpiresAt, int Features, int MaxAgents, int MaxNodes)>
{
    ("ascii", FixedId, "dev@example.com (Analytical Engines)", Developer, Expiry, All, 5, 1),
    ("ascii email only", FixedId, "dev@example.com", Developer, Expiry, All, 5, 1),
    ("plus tag", FixedId, "dev+trial@example.com", Developer, Expiry, All, 5, 1),
    ("plus tag with company", FixedId, "dev+trial@example.com (Caf\u00E9 & S\u00F8n's <Ltd>)", Developer, Expiry, All, 5, 1),
    ("quotes and backslash", FixedId, "o'neil@example.com (A&B \"Quotes\" \\ back)", Developer, Expiry, All, 5, 1),
    ("emoji company", FixedId, "dev@example.com (Rocket \U0001F680 Labs)", Developer, Expiry, All, 5, 1),
    ("company truncated before a surrogate pair", FixedId, "dev@example.com (" + new string('A', 199) + ")", Developer, Expiry, All, 5, 1),
    ("lone surrogates sanitized to U+FFFD", FixedId, "Dev\uFFFD@Example.com (Acme \uFFFD Ltd)", Developer, Expiry, All, 5, 1),
    ("lone surrogates unsanitized", FixedId, "Dev\uDC00@Example.com (Acme \uD800 Ltd)", Developer, Expiry, All, 5, 1),
    ("other integer values", "11111111-2222-4333-8444-555555555555", "ops+billing@example.org", 3, "2027-01-31T23:59:59+00:00", 1, 250, 12),
};

var options = new JsonWriterOptions
{
    Indented = true,
    // The fixture file itself only needs to be valid JSON; relaxed escaping keeps it readable.
    // The `stj` values inside it are what the default encoder produced.
    Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
};

using var stream = new MemoryStream();
using (var w = new Utf8JsonWriter(stream, options))
{
    w.WriteStartObject();

    w.WriteStartObject("metadata");
    w.WriteString("generator", "scripts/licence-parity/StjVectors");
    w.WriteString("runtime", RuntimeInformation.FrameworkDescription);
    w.WriteString(
        "systemTextJson",
        typeof(JsonSerializer).Assembly.GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion ?? "unknown");
    w.WriteString("generatedOn", DateTime.UtcNow.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture));
    w.WriteString(
        "serializer",
        "JsonSerializer.Serialize through a source-generated JsonSerializerContext with default options (JavaScriptEncoder.Default)");
    w.WriteString(
        "encoding",
        "`input` and `fields.Licensee` are arrays of UTF-16 code units; `stj` is the exact serializer output");
    w.WriteEndObject();

    w.WriteStartArray("strings");
    foreach (var (label, value) in strings)
    {
        w.WriteStartObject();
        w.WriteString("label", label);
        WriteUnits(w, "input", value);
        w.WriteString("stj", JsonSerializer.Serialize(value, VectorsContext.Default.String));
        w.WriteEndObject();
    }
    w.WriteEndArray();

    w.WriteStartArray("payloads");
    foreach (var p in payloads)
    {
        var payload = new LicencePayload(
            p.LicenseId,
            p.Licensee,
            (VectorTier)p.Tier,
            DateTimeOffset.ParseExact(p.ExpiresAt, "yyyy-MM-dd'T'HH:mm:sszzz", CultureInfo.InvariantCulture),
            (VectorFeatures)p.Features,
            p.MaxAgents,
            p.MaxNodes);
        var stj = JsonSerializer.Serialize(payload, VectorsContext.Default.LicencePayload);
        if (!stj.Contains($"\"ExpiresAt\":\"{p.ExpiresAt}\"", StringComparison.Ordinal))
        {
            Console.Error.WriteLine($"unexpected ExpiresAt form in '{p.Label}': {stj}");
            return 1;
        }

        w.WriteStartObject();
        w.WriteString("label", p.Label);
        w.WriteStartObject("fields");
        w.WriteString("LicenseId", p.LicenseId);
        WriteUnits(w, "Licensee", p.Licensee);
        w.WriteNumber("Tier", p.Tier);
        w.WriteString("ExpiresAt", p.ExpiresAt);
        w.WriteNumber("Features", p.Features);
        w.WriteNumber("MaxAgents", p.MaxAgents);
        w.WriteNumber("MaxNodes", p.MaxNodes);
        w.WriteEndObject();
        w.WriteString("stj", stj);
        w.WriteEndObject();
    }
    w.WriteEndArray();

    w.WriteEndObject();
}

var text = Encoding.UTF8.GetString(stream.ToArray()).Replace("\r\n", "\n", StringComparison.Ordinal) + "\n";
File.WriteAllText(args[0], text, new UTF8Encoding(encoderShouldEmitUTF8Identifier: false));
Console.WriteLine($"wrote {strings.Count} string vectors and {payloads.Count} payload vectors to {args[0]} ({RuntimeInformation.FrameworkDescription})");
return 0;

static void WriteUnits(Utf8JsonWriter w, string name, string value)
{
    w.WriteStartArray(name);
    foreach (var unit in value)
    {
        w.WriteNumberValue((int)unit);
    }
    w.WriteEndArray();
}

/// <summary>Shaped like the licence payload: same property names, order and .NET types.</summary>
internal sealed record LicencePayload(
    string LicenseId,
    string Licensee,
    VectorTier Tier,
    DateTimeOffset ExpiresAt,
    VectorFeatures Features,
    int MaxAgents,
    int MaxNodes);

/// <summary>An int-backed enum, as the payload's tier is.</summary>
internal enum VectorTier
{
    Free = 0,
    Developer = 1,
    Standard = 2,
    Enterprise = 3,
}

/// <summary>A [Flags] int enum, as the payload's feature set is.</summary>
[Flags]
internal enum VectorFeatures
{
    None = 0,
    F0 = 1 << 0,
    F1 = 1 << 1,
    F2 = 1 << 2,
    F3 = 1 << 3,
    F4 = 1 << 4,
    F5 = 1 << 5,
    F6 = 1 << 6,
    F7 = 1 << 7,
    F8 = 1 << 8,
    F9 = 1 << 9,
    F10 = 1 << 10,
    F11 = 1 << 11,
    All = (1 << 12) - 1,
}

[JsonSerializable(typeof(LicencePayload))]
[JsonSerializable(typeof(string))]
internal sealed partial class VectorsContext : JsonSerializerContext;
