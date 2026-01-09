using TegridyLibrary.API.Application.Entities.Users;
using TegridyLibrary.API.Application.ValueObjects;

namespace TegridyLibrary.API.Application.Contracts;

internal interface IAccessTokenTokenProvider
{
    public AccessToken Generate(Librarian librarian, DateTime generationDateTime);
    public AccessToken Generate(Reader reader, DateTime generationDateTime);
}