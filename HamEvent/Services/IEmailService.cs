namespace HamEvent.Services
{
    public interface IEmailService
    {
        Task SendAsync(EmailMessage message, CancellationToken cancellationToken = default);
    }
}