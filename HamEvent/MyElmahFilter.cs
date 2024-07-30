using ElmahCore;

internal class MyElmahFilter : IErrorFilter
{
    public void OnErrorModuleFiltering(object sender, ExceptionFilterEventArgs args)
    {
        if (args.Exception.GetBaseException() is FileNotFoundException)
            args.Dismiss();

        if (args.Context is HttpContext httpContext)
        {
            if (httpContext.Request.Path.Equals("/favicon.ico") && httpContext.Response.StatusCode == 404)
                args.Dismiss();

           
        }
    }
}