namespace TegridyLibrary.API.Application.ValueObjects.Ids;

internal sealed record BookLoanId(ulong Value)
{
    public static implicit operator BookLoanId(ulong id) => new(id);
    public static implicit operator ulong(BookLoanId id) => id.Value;
}
