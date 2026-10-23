using System.Net;

public class IPWhitelist
{
    public List<string> Whitelist { get; set; } = new List<string>();

    public bool IsAllowed(IPAddress? remote)
    {
        if (remote == null)
        {
            return false;
        }

        remote = Normalize(remote);
        if (IPAddress.IsLoopback(remote))
        {
            return true;
        }

        return Whitelist.Any(ip => IPAddress.TryParse(ip, out var address) && Normalize(address).Equals(remote));
    }

    private static IPAddress Normalize(IPAddress address)
    {
        return address.IsIPv4MappedToIPv6 ? address.MapToIPv4() : address;
    }
}