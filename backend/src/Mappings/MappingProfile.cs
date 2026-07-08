using AlugaFacilApi.DTOs.Response;
using AlugaFacilApi.Models;
using AutoMapper;

namespace AlugaFacilApi.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserResponse>();

        // Records só têm construtor posicional, então os campos calculados precisam ser
        // resolvidos via ForCtorParam — ForMember pressupõe "constrói e depois seta a
        // propriedade", o que não existe em tipos sem construtor sem parâmetros.
        CreateMap<Property, PropertySummaryResponse>()
            .ForCtorParam(nameof(PropertySummaryResponse.FirstPhotoUrl), o => o.MapFrom(s =>
                s.Photos.FirstOrDefault() != null ? s.Photos.First().Url : null));

        CreateMap<Property, PropertyDetailResponse>()
            .ForCtorParam(nameof(PropertyDetailResponse.PhotoUrls), o => o.MapFrom(s => s.Photos.Select(p => p.Url).ToList()))
            .ForCtorParam(nameof(PropertyDetailResponse.Owner), o => o.MapFrom(s => s.User))
            .ForCtorParam(nameof(PropertyDetailResponse.WhatsAppLink), o => o.MapFrom(s =>
                $"https://wa.me/55{s.User.Phone.Replace(" ", "").Replace("-", "").Replace("(", "").Replace(")", "")}"));

        CreateMap<Property, PropertyMapResponse>()
            .ForCtorParam(nameof(PropertyMapResponse.FirstPhotoUrl), o => o.MapFrom(s =>
                s.Photos.FirstOrDefault() != null ? s.Photos.First().Url : null));

        CreateMap<Review, ReviewResponse>()
            .ForCtorParam(nameof(ReviewResponse.Author), o => o.MapFrom(s => s.Author));
    }
}
