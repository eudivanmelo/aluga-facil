using AlugaFacilApi.DTOs.Response;
using AlugaFacilApi.Models;
using AutoMapper;

namespace AlugaFacilApi.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserResponse>();

        CreateMap<Property, PropertySummaryResponse>()
            .ForMember(d => d.FirstPhotoUrl, o => o.MapFrom(s =>
                s.Photos.FirstOrDefault() != null ? s.Photos.First().Url : null));

        CreateMap<Property, PropertyDetailResponse>()
            .ForMember(d => d.PhotoUrls, o => o.MapFrom(s => s.Photos.Select(p => p.Url).ToList()))
            .ForMember(d => d.Owner, o => o.MapFrom(s => s.User))
            .ForMember(d => d.WhatsAppLink, o => o.MapFrom(s =>
                $"https://wa.me/55{s.User.Phone.Replace(" ", "").Replace("-", "").Replace("(", "").Replace(")", "")}"));

        CreateMap<Property, PropertyMapResponse>()
            .ForMember(d => d.FirstPhotoUrl, o => o.MapFrom(s =>
                s.Photos.FirstOrDefault() != null ? s.Photos.First().Url : null));

        CreateMap<Review, ReviewResponse>()
            .ForMember(d => d.Author, o => o.MapFrom(s => s.Author));
    }
}
