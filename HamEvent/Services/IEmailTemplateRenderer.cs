namespace HamEvent.Services
{
    public interface IEmailTemplateRenderer
    {
        Task<string> RenderAsync(string templateName, object? model, CancellationToken cancellationToken = default);
    }
}