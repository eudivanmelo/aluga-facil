using AlugaFacilApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlugaFacilApi.Controllers;

[ApiController]
[Route("api/photos")]
[Authorize]
[Produces("application/json")]
public class PhotosController : ControllerBase
{
    private const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10MB

    private readonly IStorageService _storageService;

    public PhotosController(IStorageService storageService) => _storageService = storageService;

    /// <summary>
    /// Faz upload de uma imagem para o MinIO e retorna a URL pública, para uso em PhotoUrls
    /// na criação/edição de um anúncio.
    /// </summary>
    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file is null || file.Length == 0)
            throw new InvalidOperationException("Nenhum arquivo enviado.");

        if (file.Length > MaxFileSizeBytes)
            throw new InvalidOperationException("O arquivo excede o tamanho máximo de 10MB.");

        if (string.IsNullOrEmpty(file.ContentType) || !file.ContentType.StartsWith("image/"))
            throw new InvalidOperationException("Apenas arquivos de imagem são permitidos.");

        var url = await _storageService.UploadAsync(file);
        return Ok(new { url });
    }
}
