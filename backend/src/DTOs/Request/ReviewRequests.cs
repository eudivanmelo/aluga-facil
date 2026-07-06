namespace AlugaFacilApi.DTOs.Request;

public record CreateReviewRequest(
    int LandlordId,
    string Comment
);
