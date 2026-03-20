namespace HamEvent.Services
{
    public class EmailMessage
    {
        public IList<string> ToAddresses { get; set; } = new List<string>();
        public string Subject { get; set; } = string.Empty;
        public string TemplateName { get; set; } = string.Empty;
        public object? Model { get; set; }
        public bool IsHtml { get; set; } = true;
    }
}