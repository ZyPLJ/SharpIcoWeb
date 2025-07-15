using System.Reflection;

namespace SharpIcoWeb.Endpoints.Internal;

public static class EndpointExtensions
{
    public static void MapAllEndpoints(this IEndpointRouteBuilder app)
    {
        var endpointTypes = Assembly.GetExecutingAssembly()
            .GetTypes()
            .Where(t => typeof(IEndpoint).IsAssignableFrom(t) && !t.IsInterface && !t.IsAbstract);

        foreach (var type in endpointTypes)
        {
            type.GetMethod(nameof(IEndpoint.MapEndpoints))?
            .Invoke(null, new object[] { app });
        }
    }
}