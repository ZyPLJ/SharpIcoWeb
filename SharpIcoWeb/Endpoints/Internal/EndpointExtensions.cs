using System.Reflection;

namespace SharpIcoWeb.Endpoints.Internal;

public static class EndpointExtensions
{
    public static void UseEndpoints<TMarker>(this IEndpointRouteBuilder app)
    {
        UseEndpoints(app, typeof(TMarker));
    }
    
    public static void UseEndpoints(this IEndpointRouteBuilder app, Type typeMarker)
    {
        var endpointTypes = GetEndpointTypes(typeMarker);

        foreach (var type in endpointTypes)
        {
            type.GetMethod(nameof(IEndpoint.UseEndpoints))?
            .Invoke(null, new object[] { app });
        }
    }

    public static void AddEndpoints<TMarker>(this IServiceCollection services, IConfiguration configuration)
    {
        AddEndpoints(services, typeof(TMarker), configuration);
    }
    public static void AddEndpoints(this IServiceCollection services, Type typeMarker, IConfiguration configuration)
    {
        var endpointTypes = GetEndpointTypes(typeMarker);

        foreach (var endpointType in endpointTypes)
        {
            endpointType.GetMethod(nameof(IEndpoint.AddServices))!
                .Invoke(null, new object[] { services, configuration });
        }
    }

    private static IEnumerable<TypeInfo> GetEndpointTypes(Type typeMarker)
    {
        var endpointTypes = typeMarker.Assembly.DefinedTypes
            .Where(x => !x.IsAbstract && !x.IsInterface && 
                        typeof(IEndpoint).IsAssignableFrom(x));
        return endpointTypes;
    }
}