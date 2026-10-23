using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace HamEvent.Services
{
    public class SmtpEmailService : IEmailService
    {
        private readonly IEmailTemplateRenderer _templateRenderer;
        private readonly MailerSettings _settings;

        public SmtpEmailService(IEmailTemplateRenderer templateRenderer, Microsoft.Extensions.Options.IOptions<MailerSettings> settings)
        {
            _templateRenderer = templateRenderer;
            _settings = settings.Value;
        }

        public async Task SendAsync(EmailMessage message, CancellationToken cancellationToken = default)
        {
            ArgumentNullException.ThrowIfNull(message);

            if (string.IsNullOrWhiteSpace(message.TemplateName))
            {
                throw new InvalidOperationException("TemplateName is required.");
            }

            if (string.IsNullOrWhiteSpace(_settings.From))
            {
                throw new InvalidOperationException("MailerSettings.From is required.");
            }

            if (string.IsNullOrWhiteSpace(_settings.Host))
            {
                throw new InvalidOperationException("MailerSettings.Host is required.");
            }

            if (_settings.Port <= 0)
            {
                throw new InvalidOperationException("MailerSettings.Port must be greater than 0.");
            }

            var recipients = message.ToAddresses
                .Where(a => !string.IsNullOrWhiteSpace(a))
                .Select(a => a.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            if (recipients.Count == 0)
            {
                throw new InvalidOperationException("At least one recipient is required.");
            }

            var body = await _templateRenderer.RenderAsync(message.TemplateName, message.Model, cancellationToken);
            var mimeMessage = new MimeMessage();
            mimeMessage.From.Add(MailboxAddress.Parse(_settings.From));
            mimeMessage.To.AddRange(recipients.Select(MailboxAddress.Parse));
            mimeMessage.Subject = message.Subject;

            var bodyBuilder = new BodyBuilder();
            if (message.IsHtml)
            {
                bodyBuilder.HtmlBody = body;
            }
            else
            {
                bodyBuilder.TextBody = body;
            }

            mimeMessage.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            var socketOptions = _settings.EnableSSL ? SecureSocketOptions.StartTls : SecureSocketOptions.None;
            await client.ConnectAsync(_settings.Host, _settings.Port, socketOptions, cancellationToken);

            if (!string.IsNullOrWhiteSpace(_settings.Username))
            {
                await client.AuthenticateAsync(_settings.Username, _settings.Password, cancellationToken);
            }

            await client.SendAsync(mimeMessage, cancellationToken);
            await client.DisconnectAsync(true, cancellationToken);
        }
    }
}