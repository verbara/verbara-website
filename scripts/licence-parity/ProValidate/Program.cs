// Loads each .lic with the licence reader and checks it with the licence
// validator against one public key, printing one line per file:
//
//   <file name><TAB><result>
//
// where <result> is a LicenseValidationResult name (Valid, Invalid, ...) or
// LoadFailed when the reader rejects the file. Exit code: 0 when every file is
// Valid, 1 when any is not, 2 on a usage error.
//
// Usage: ProValidate <public-key.der> <file.lic>...
//   public-key.der: the DER SubjectPublicKeyInfo of the signing key pair.
//
// Maintainer-only; run it through ../pro-parity.ts (see ../README.md).

using Verbara.Sdk.Pro.Licensing;

if (args.Length < 2)
{
    Console.Error.WriteLine("usage: ProValidate <public-key.der> <file.lic>...");
    return 2;
}

var publicKey = File.ReadAllBytes(args[0]);
var allValid = true;

foreach (var path in args.Skip(1))
{
    string result;
    try
    {
        var key = LicenseReader.Load(path);
        result = LicenseValidator.Validate(key, publicKey, TimeSpan.Zero).ToString();
    }
    catch (LicenseException ex)
    {
        var cause = ex.InnerException is null ? string.Empty : $" ({ex.InnerException.GetType().Name})";
        result = $"LoadFailed{cause}";
    }

    if (result != nameof(LicenseValidationResult.Valid))
    {
        allValid = false;
    }

    Console.WriteLine($"{Path.GetFileName(path)}\t{result}");
}

return allValid ? 0 : 1;
