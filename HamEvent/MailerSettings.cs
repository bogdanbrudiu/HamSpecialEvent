namespace HamEvent
{
    public class MailerSettings
    {
        public string From { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Host { get; set; } = string.Empty;
        public short Port { get; set; }
        public bool EnableSSL { get; set; }
    }
}
