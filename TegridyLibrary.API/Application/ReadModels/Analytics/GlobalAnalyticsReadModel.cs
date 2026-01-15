namespace TegridyLibrary.API.Application.ReadModels.Analytics;

internal sealed class GlobalAnalyticsReadModel
{
    public required int TotalBooks { get; set; }
    public required int TotalCopies { get; set; }
    public required int TotalActiveBookLoans { get; set; }
    public required int TotalBookLoans { get; set; }
    public required int TotalReaders { get; set; }
}