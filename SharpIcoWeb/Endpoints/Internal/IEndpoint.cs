namespace SharpIcoWeb.Endpoints.Internal;

public interface IEndpoint
{ 
    static abstract void UseEndpoints(IEndpointRouteBuilder app);
    static abstract void AddServices(IServiceCollection services, IConfiguration configuration);
}