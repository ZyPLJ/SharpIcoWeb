using SharpIcoWeb.Endpoints.Internal;

namespace SharpIcoWeb.Endpoints;

public class TestEndpoints : IEndpoint
{
    public static void UseEndpoints(IEndpointRouteBuilder app)
    {
        app.MapGet("/test", async (context) =>
        {
            await context.Response.WriteAsync("Hello, World!");
        });
    }

    public static void AddServices(IServiceCollection services, IConfiguration configuration)
    {
    }
}