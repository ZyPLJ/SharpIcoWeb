namespace SharpIcoWeb.Endpoints.Internal;

public interface IEndpoint
{ 
    static abstract void MapEndpoints(IEndpointRouteBuilder app);
}