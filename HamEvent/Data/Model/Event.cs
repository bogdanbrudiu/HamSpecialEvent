using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace HamEvent.Data.Model
{
    public class Event
    {
        public Guid Id { get; set; }
        public string SecretKey { get; set; } = string.Empty;
        public required string Name { get; set; }
        [JsonConverter(typeof(LocalizedDictionaryJsonConverter))]
        public Dictionary<string, string> Description { get; set; } = new(StringComparer.OrdinalIgnoreCase);
        public required string Diploma { get; set; }
        public required string Email { get; set; }
        [JsonConverter(typeof(LocalizedDictionaryJsonConverter))]
        public Dictionary<string, string> Rules { get; set; } = new(StringComparer.OrdinalIgnoreCase);
        [JsonIgnore]
        public ICollection<QSO> QSOs { get; } = new List<QSO>();
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string ExcludeCallsigns { get; set; } = string.Empty;
        public bool HasTop { get; set; }
        [NotMapped]
        public int? Days
        {
            get
            {
                if (StartDate.HasValue && EndDate.HasValue) { return (EndDate.Value - StartDate.Value).Days+1; }
                return null;
            }
        }

        [NotMapped]
        public String[] ExcludeCallsignsList { get { return string.IsNullOrEmpty(ExcludeCallsigns)?new String[0] :ExcludeCallsigns.Split(','); } }

        [NotMapped]
        public string? Last
        {
            get
            {
                return QSOs.OrderByDescending(q=>q.Timestamp).FirstOrDefault()?.Timestamp.ToString();
            }
        }

        [NotMapped]
        public string? First
        {
            get
            {
                return QSOs.OrderBy(q => q.Timestamp).FirstOrDefault()?.Timestamp.ToString();
            }
        }

        [NotMapped]
        public int Count
        {
            get
            {
                return QSOs.Count;
            }
        }

        [NotMapped]
        public int Unique
        {
            get
            {
                return QSOs.DistinctBy(q => q.Callsign2).Count();
            }
        }

        public string GetDescription(string? lang = null, string fallbackLang = "en") => GetLocalizedValue(Description, lang, fallbackLang);
        public string GetRules(string? lang = null, string fallbackLang = "en") => GetLocalizedValue(Rules, lang, fallbackLang);

        public static string GetLocalizedValue(Dictionary<string, string> values, string? lang = null, string fallbackLang = "en")
        {
            if (values == null || values.Count == 0) return string.Empty;
            if (!string.IsNullOrWhiteSpace(lang) && values.TryGetValue(lang, out var langValue) && !string.IsNullOrWhiteSpace(langValue))
            {
                return langValue;
            }
            if (!string.IsNullOrWhiteSpace(fallbackLang) && values.TryGetValue(fallbackLang, out var fallbackValue) && !string.IsNullOrWhiteSpace(fallbackValue))
            {
                return fallbackValue;
            }
            return values.Values.FirstOrDefault(v => !string.IsNullOrWhiteSpace(v)) ?? string.Empty;
        }

        public static Dictionary<string, string> CopyLocalizedValues(Dictionary<string, string> source)
        {
            return source == null ? new(StringComparer.OrdinalIgnoreCase) : new Dictionary<string, string>(source, StringComparer.OrdinalIgnoreCase);
        }
    }

    public class LocalizedDictionaryJsonConverter : JsonConverter<Dictionary<string, string>>
    {
        public override Dictionary<string, string> Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.String)
            {
                var value = reader.GetString() ?? string.Empty;
                return new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", value } };
            }

            if (reader.TokenType == JsonTokenType.StartObject)
            {
                var dict = JsonSerializer.Deserialize<Dictionary<string, string>>(ref reader, options);
                return dict == null ? new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) : new Dictionary<string, string>(dict, StringComparer.OrdinalIgnoreCase);
            }

            reader.Skip();
            return new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        }

        public override void Write(Utf8JsonWriter writer, Dictionary<string, string> value, JsonSerializerOptions options)
        {
            JsonSerializer.Serialize(writer, value ?? new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase), options);
        }
    }
}