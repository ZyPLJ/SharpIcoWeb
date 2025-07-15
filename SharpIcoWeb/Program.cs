using SharpIcoWeb.Endpoints.Internal;
using SharpIcoWeb.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.WebHost.UseUrls("http://*:5235");

builder.Services.AddScoped<IFileService, FileService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        opt => opt.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod()
            .WithExposedHeaders("http://localhost:5173/", "https://localhost:5173/api"));
});


var app = builder.Build();

app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("CorsPolicy");

app.UseHttpsRedirection();

// 注册端点
app.MapAllEndpoints();

app.Run();