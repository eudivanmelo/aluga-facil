using AlugaFacilApi.Services.Interfaces;
using Minio;
using Minio.DataModel.Args;

namespace AlugaFacilApi.Services;

public class StorageService : IStorageService
{
    private readonly IMinioClient _minioClient;
    private readonly string _bucketName;
    private readonly string _publicUrl;

    public StorageService(IMinioClient minioClient, IConfiguration configuration)
    {
        _minioClient = minioClient;
        _bucketName = configuration["Minio:BucketName"]!;
        _publicUrl = configuration["Minio:PublicUrl"]!.TrimEnd('/');
    }

    public async Task<string> UploadAsync(IFormFile file)
    {
        var extension = Path.GetExtension(file.FileName);
        var objectName = $"{Guid.NewGuid()}{extension}";

        await using var stream = file.OpenReadStream();
        await _minioClient.PutObjectAsync(new PutObjectArgs()
            .WithBucket(_bucketName)
            .WithObject(objectName)
            .WithStreamData(stream)
            .WithObjectSize(file.Length)
            .WithContentType(file.ContentType));

        return $"{_publicUrl}/{_bucketName}/{objectName}";
    }

    public async Task DeleteAsync(string fileUrl)
    {
        var objectName = fileUrl.Split('/').Last();
        await _minioClient.RemoveObjectAsync(new RemoveObjectArgs()
            .WithBucket(_bucketName)
            .WithObject(objectName));
    }
}
