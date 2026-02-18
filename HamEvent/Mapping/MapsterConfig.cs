using HamEvent.Data.Model;
using Mapster;
using M0LTE.AdifLib;

namespace HamEvent.Mapping;

public static class MapsterConfig
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<AdifContactRecord, QSO>()
            .Map(dest => dest.Callsign1, src => !string.IsNullOrEmpty(src.Operator) ? src.Operator : src.StationCallsign)
            .Map(dest => dest.Callsign2, src => src.Call)
            .Map(dest => dest.RST1, src => src.RstSent)
            .Map(dest => dest.RST2, src => src.RstReceived)
            .Map(dest => dest.Mode, src => src.Mode)
            .Map(dest => dest.Band, src => src.Band)
            .Map(dest => dest.Freq, src => src.FreqMHz)
            .Map(dest => dest.Timestamp, src => src.QsoStart);
    }
}
