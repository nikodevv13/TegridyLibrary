using IdGen;
using TegridyLibrary.API.Application.Contracts;

namespace TegridyLibrary.API.Infrastructure.Services;

internal sealed class SnowflakeIdProvider : ISnowflakeIdProvider
{
    private readonly IdGenerator _generator;
    
    public SnowflakeIdProvider()
    {
        var epoch = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        var structure = new IdStructure(45, 2, 16);
        var options = new IdGeneratorOptions(structure, new DefaultTimeSource(epoch));
        _generator = new IdGenerator(0, options);
    }

    public ulong Generate()
    {
        return (ulong)_generator.CreateId();
    }
}