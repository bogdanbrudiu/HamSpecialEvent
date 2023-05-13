using AutoMapper;
using M0LTE.AdifLib;

namespace HamEvent.MappingProfiles
{
  public class HamEventProfile : Profile
  {
    public HamEventProfile()
    {
            CreateMap<AdifContactRecord, QSO>()
                  .ForMember(dest => dest.Callsign1, act => act.MapFrom(src => src.StationCallsign))
                  .ForMember(dest => dest.Callsign2, act => act.MapFrom(src => src.Call))
                  .ForMember(dest => dest.RST1, act => act.MapFrom(src => src.RstSent))
                  .ForMember(dest => dest.RST2, act => act.MapFrom(src => src.RstReceived))
                  .ForMember(dest => dest.Mode, act => act.MapFrom(src => src.Mode))
                  .ForMember(dest => dest.Band, act => act.MapFrom(src => src.Band))
                  .ForMember(dest => dest.Timestamp, act => act.MapFrom(src => src.QsoStart));
    }
  }
}
