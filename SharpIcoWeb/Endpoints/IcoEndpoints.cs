using Microsoft.AspNetCore.Mvc;
using SharpIco;
using SharpIcoWeb.Endpoints.Internal;
using SharpIcoWeb.Model;
using SharpIcoWeb.Services;

namespace SharpIcoWeb.Endpoints;

public class IcoEndpoints: IEndpoint
{
    public static void UseEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api");

        // 上传图片文件并返回文件名
        group.MapPost("/uploadDownload", UploadDownload)
            .DisableAntiforgery();

        // 获取图片信息
        group.MapGet("/getImageInfo/{filename}", GetImageInfo);

        // 下载文件
        group.MapGet("/downloads/{fileName}", DowloadFile);

        // 上传图片文件并返回文件名和不同尺寸的ICO文件的ZIP文件
        group.MapPost("/uploadDownload/sizes", UploadDownloadSizes)
            .DisableAntiforgery();
    }

    public static void AddServices(IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IFileService, FileService>();
    }

    private static async Task<IResult> UploadDownload(
        [FromForm] IFormFile file,
        [FromForm] string? sizes,
        IFileService fileService,
        ILogger<Program> logger)
    {
        try
        {
            // 验证输入
            if (!fileService.IsFileValid(file))
            {
                return Results.Json(new ApiResponse { Message = "请上传有效文件,文件大小不能超过10MB" });
            }

            // 保存临时文件
            var tempFilePath = await fileService.SaveUploadedFile(file);

            // 生成输出路径
            var outName = $"{Guid.NewGuid()}.ico";
            var outputPath = Path.Combine(fileService.GetRootDirectory(), outName);

            // 执行转换 处理大小参数
            var sizesArray = string.IsNullOrEmpty(sizes) ? null : sizes.Split(',').Select(int.Parse).ToArray();
            if (sizesArray is { Length: > 0 })
                IcoGenerator.GenerateIcon(tempFilePath, outputPath, sizesArray);
            else
                IcoGenerator.GenerateIcon(tempFilePath, outputPath);

            logger.LogInformation($"{DateTime.Now} 文件 {file.FileName} 转换成功");

            // 返回文件路径
            return Results.Json(new ApiResponse { Message = "转换成功", Data = outName });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"{DateTime.Now} 处理文件时发生错误");
            return Results.Json(new ApiResponse { Message = ex.Message });
        }
    }

    private static async Task<IResult> UploadDownloadSizes(
        [FromForm] IFormFile file,
        [FromForm] string? sizes,
        IFileService fileService,
        ILogger<Program> logger)
    {
        try
        {
            // 验证输入
            if (!fileService.IsFileValid(file))
            {
                return Results.Json(new ApiResponse { Message = "请上传有效文件,文件大小不能超过10MB" });
            }

            // 保存临时文件
            var tempFilePath = await fileService.SaveUploadedFile(file);

            // 执行转换 处理大小参数
            var sizesArray = string.IsNullOrEmpty(sizes) ? null : sizes.Split(',').Select(int.Parse).ToArray();
            // 为每个尺寸生成ICO文件
            var filesToZip = new Dictionary<string, string>();

            if (sizesArray is { Length: > 0 })
            {
                foreach (var size in sizesArray)
                {
                    var fileName = $"icon{size}.ico";
                    var outputPathSize = Path.Combine(fileService.GetTempDirectory(), fileName);
                    IcoGenerator.GenerateIcon(tempFilePath, outputPathSize, [size]);
                    filesToZip.Add(fileName, outputPathSize);
                }
            }
            else
            {
                var outputPath = Path.Combine(fileService.GetTempDirectory(), "icon.ico");
                IcoGenerator.GenerateIcon(tempFilePath, outputPath);
                filesToZip.Add("icon.ico", outputPath);
            }

            // 创建ZIP文件
            var zipStream = await fileService.CreateZipFromFilesAsync(filesToZip);

            // 删除原始临时文件
            fileService.DeleteFile(tempFilePath);

            var count = sizesArray is { Length: > 0 } ? sizesArray.Length : 1;
            logger.LogInformation($"{DateTime.Now} 文件 {file.FileName} 转换成功，生成 {count} 个尺寸的ICO文件");

            return Results.File(zipStream, "application/zip", $"{DateTime.Now:yyyyMMddHHmmss}icons.zip");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"{DateTime.Now} 处理文件时发生错误");
            return Results.Json(new ApiResponse { Message = ex.Message });
        }
    }


    private static IResult GetImageInfo(string filename, IFileService fileService,
        ILogger<Program> logger)
    {
        string path = Path.Combine(fileService.GetRootDirectory(), filename);
        if (!File.Exists(path))
        {
            return Results.Json(new ApiResponse { Message = "文件不存在", StatusCode = 400 });
        }

        List<ImageInfo> images = IcoInspector.Inspect(path);
        logger.LogInformation($"{DateTime.Now} 文件 {path} 信息获取成功");
        return Results.Json(new ApiResponse { Message = "获取成功", Data = images, StatusCode = 200 });
    }

    private static async Task<IResult> DowloadFile(string fileName, IFileService fileService, ILogger<Program> logger)
    {
        var filePath = Path.Combine(fileService.GetRootDirectory(), fileName);
        if (!File.Exists(filePath))
            return Results.Json(new ApiResponse { Message = "文件不存在", StatusCode = 400 });

        var memoryStream = await fileService.ReadFileToMemoryAsync(filePath);
        // 删除文件
        fileService.DeleteFile(filePath);
        return Results.File(memoryStream, "image/x-icon");
    }
}