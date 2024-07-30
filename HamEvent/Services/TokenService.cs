using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace HamEvent.Services
{
    public class TokenService
    {
        private readonly string _secret;

        public TokenService(string secret)
        {
            _secret = secret ?? throw new ArgumentNullException(nameof(secret));
        }

        public string GenerateToken(string email)
        {
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_secret));
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(email));
            return Base32Encode(hash).Substring(0, 8).ToUpper(); // Truncate to 8 chars
        }

        public bool VerifyToken(string token, string email)
        {
            var generatedToken = GenerateToken(email);
            return generatedToken.Equals(token, StringComparison.OrdinalIgnoreCase);
        }

        private static string Base32Encode(byte[] data)
        {
            const string Base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
            var result = new StringBuilder((data.Length + 4) / 5 * 8);

            for (int i = 0; i < data.Length; i += 5)
            {
                byte[] buffer = new byte[8];

                int byteCount = Math.Min(5, data.Length - i);
                Array.Copy(data, i, buffer, 0, byteCount);

                result.Append(Base32Chars[buffer[0] >> 3]);
                result.Append(Base32Chars[((buffer[0] & 0x07) << 2) | (buffer[1] >> 6)]);
                result.Append(Base32Chars[(buffer[1] >> 1) & 0x1F]);
                result.Append(Base32Chars[((buffer[1] & 0x01) << 4) | (buffer[2] >> 4)]);
                result.Append(Base32Chars[((buffer[2] & 0x0F) << 1) | (buffer[3] >> 7)]);
                result.Append(Base32Chars[(buffer[3] >> 2) & 0x1F]);
                result.Append(Base32Chars[((buffer[3] & 0x03) << 3) | (buffer[4] >> 5)]);
                result.Append(Base32Chars[buffer[4] & 0x1F]);
            }

            return result.ToString();
        }
    }
}
