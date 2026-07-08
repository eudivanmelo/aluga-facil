using AlugaFacilApi.DTOs.Request;
using AlugaFacilApi.DTOs.Response;
using AlugaFacilApi.Models;
using AlugaFacilApi.Repositories.Interfaces;
using AlugaFacilApi.Services.Interfaces;
using AutoMapper;

namespace AlugaFacilApi.Services;

public class PropertyService : IPropertyService
{
    private readonly IPropertyRepository _propertyRepository;
    private readonly IMapper _mapper;

    public PropertyService(IPropertyRepository propertyRepository, IMapper mapper)
    {
        _propertyRepository = propertyRepository;
        _mapper = mapper;
    }

    public async Task<PagedResponse<PropertySummaryResponse>> GetCatalogAsync(PropertyFilterRequest filter)
    {
        var (items, total) = await _propertyRepository.GetAllAsync(filter);
        var data = _mapper.Map<List<PropertySummaryResponse>>(items);
        var totalPages = (int)Math.Ceiling((double)total / filter.PageSize);
        return new PagedResponse<PropertySummaryResponse>(data, filter.Page, filter.PageSize, total, totalPages);
    }

    public async Task<List<PropertyMapResponse>> GetMapPropertiesAsync()
    {
        var properties = await _propertyRepository.GetAllForMapAsync();
        return _mapper.Map<List<PropertyMapResponse>>(properties);
    }

    public async Task<PropertyDetailResponse> GetByIdAsync(int id)
    {
        var property = await _propertyRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Imóvel não encontrado.");
        return _mapper.Map<PropertyDetailResponse>(property);
    }

    public async Task<List<PropertySummaryResponse>> GetMyPropertiesAsync(int userId)
    {
        var properties = await _propertyRepository.GetByUserIdAsync(userId);
        return _mapper.Map<List<PropertySummaryResponse>>(properties);
    }

    public async Task<PropertyDetailResponse> CreateAsync(int userId, CreatePropertyRequest request)
    {
        var property = new Property
        {
            UserId = userId,
            Title = request.Title,
            Description = request.Description,
            Price = request.Price,
            PaymentFrequency = request.PaymentFrequency,
            Street = request.Street,
            Number = request.Number,
            Neighborhood = request.Neighborhood,
            Complement = request.Complement,
            City = request.City,
            State = request.State,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            Bedrooms = request.Bedrooms,
            Bathrooms = request.Bathrooms,
            ParkingSpaces = request.ParkingSpaces,
            PetsAllowed = request.PetsAllowed,
            IsFurnished = request.IsFurnished,
            Tags = request.Tags
        };

        var created = await _propertyRepository.CreateAsync(property, request.PhotoUrls);
        return _mapper.Map<PropertyDetailResponse>(created);
    }

    public async Task<PropertyDetailResponse> UpdateAsync(int userId, int propertyId, UpdatePropertyRequest request)
    {
        var property = await _propertyRepository.GetByIdAsync(propertyId)
            ?? throw new KeyNotFoundException("Imóvel não encontrado.");

        if (property.UserId != userId)
            throw new UnauthorizedAccessException("Você não tem permissão para editar este anúncio.");

        if (request.Title != null) property.Title = request.Title;
        if (request.Description != null) property.Description = request.Description;
        if (request.Price.HasValue) property.Price = request.Price.Value;
        if (request.PaymentFrequency != null) property.PaymentFrequency = request.PaymentFrequency;
        if (request.Street != null) property.Street = request.Street;
        if (request.Number != null) property.Number = request.Number;
        if (request.Neighborhood != null) property.Neighborhood = request.Neighborhood;
        if (request.Complement != null) property.Complement = request.Complement;
        if (request.City != null) property.City = request.City;
        if (request.State != null) property.State = request.State;
        if (request.Latitude.HasValue) property.Latitude = request.Latitude.Value;
        if (request.Longitude.HasValue) property.Longitude = request.Longitude.Value;
        if (request.Bedrooms.HasValue) property.Bedrooms = request.Bedrooms.Value;
        if (request.Bathrooms.HasValue) property.Bathrooms = request.Bathrooms.Value;
        if (request.ParkingSpaces.HasValue) property.ParkingSpaces = request.ParkingSpaces.Value;
        if (request.PetsAllowed.HasValue) property.PetsAllowed = request.PetsAllowed.Value;
        if (request.IsFurnished.HasValue) property.IsFurnished = request.IsFurnished.Value;
        if (request.Tags != null) property.Tags = request.Tags;

        var updated = await _propertyRepository.UpdateAsync(property, request.PhotoUrls);
        return _mapper.Map<PropertyDetailResponse>(updated);
    }

    public async Task DeleteAsync(int userId, int propertyId)
    {
        var property = await _propertyRepository.GetByIdAsync(propertyId)
            ?? throw new KeyNotFoundException("Imóvel não encontrado.");

        if (property.UserId != userId)
            throw new UnauthorizedAccessException("Você não tem permissão para deletar este anúncio.");

        await _propertyRepository.DeleteAsync(property);
    }

    public Task<List<string>> GetDistinctCitiesAsync() => _propertyRepository.GetDistinctCitiesAsync();
}
