using AlugaFacilApi.DTOs.Request;
using AlugaFacilApi.DTOs.Response;
using AlugaFacilApi.Models;
using AlugaFacilApi.Repositories.Interfaces;
using AlugaFacilApi.Services.Interfaces;
using AutoMapper;

namespace AlugaFacilApi.Services;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public ReviewService(IReviewRepository reviewRepository, IUserRepository userRepository, IMapper mapper)
    {
        _reviewRepository = reviewRepository;
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<List<ReviewResponse>> GetByLandlordAsync(int landlordId)
    {
        var reviews = await _reviewRepository.GetByLandlordIdAsync(landlordId);
        return _mapper.Map<List<ReviewResponse>>(reviews);
    }

    public async Task<ReviewResponse> CreateAsync(int authorId, CreateReviewRequest request)
    {
        if (authorId == request.LandlordId)
            throw new InvalidOperationException("Você não pode avaliar a si mesmo.");

        var landlordExists = await _userRepository.GetByIdAsync(request.LandlordId)
            ?? throw new KeyNotFoundException("Locador não encontrado.");

        if (await _reviewRepository.ExistsAsync(authorId, request.LandlordId))
            throw new InvalidOperationException("Você já avaliou este locador.");

        var review = new Review
        {
            AuthorId = authorId,
            LandlordId = request.LandlordId,
            Comment = request.Comment
        };

        var created = await _reviewRepository.CreateAsync(review);
        return _mapper.Map<ReviewResponse>(created);
    }

    public async Task DeleteAsync(int authorId, int reviewId)
    {
        var review = await _reviewRepository.GetByIdAsync(reviewId)
            ?? throw new KeyNotFoundException("Avaliação não encontrada.");

        if (review.AuthorId != authorId)
            throw new UnauthorizedAccessException("Você não tem permissão para deletar esta avaliação.");

        await _reviewRepository.DeleteAsync(review);
    }
}
