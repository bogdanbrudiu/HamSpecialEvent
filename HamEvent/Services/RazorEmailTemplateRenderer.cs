using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Routing;

namespace HamEvent.Services
{
    public class RazorEmailTemplateRenderer : IEmailTemplateRenderer
    {
        private readonly IRazorViewEngine _viewEngine;
        private readonly ITempDataProvider _tempDataProvider;
        private readonly IServiceProvider _serviceProvider;

        public RazorEmailTemplateRenderer(
            IRazorViewEngine viewEngine,
            ITempDataProvider tempDataProvider,
            IServiceProvider serviceProvider)
        {
            _viewEngine = viewEngine;
            _tempDataProvider = tempDataProvider;
            _serviceProvider = serviceProvider;
        }

        public async Task<string> RenderAsync(string templateName, object? model, CancellationToken cancellationToken = default)
        {
            var actionContext = GetActionContext();
            var viewName = NormalizeTemplateName(templateName);
            var viewEngineResult = _viewEngine.GetView(executingFilePath: null, viewPath: viewName, isMainPage: false);

            if (!viewEngineResult.Success)
            {
                viewEngineResult = _viewEngine.FindView(actionContext, templateName, isMainPage: false);
            }

            if (!viewEngineResult.Success)
            {
                throw new InvalidOperationException($"Couldn't find email template '{templateName}'.");
            }

            await using var output = new StringWriter();
            var viewContext = new ViewContext(
                actionContext,
                viewEngineResult.View,
                new ViewDataDictionary<object?>(
                    metadataProvider: new EmptyModelMetadataProvider(),
                    modelState: new ModelStateDictionary())
                {
                    Model = model
                },
                new TempDataDictionary(actionContext.HttpContext, _tempDataProvider),
                output,
                new HtmlHelperOptions());

            await viewEngineResult.View.RenderAsync(viewContext);
            return output.ToString();
        }

        private ActionContext GetActionContext()
        {
            var httpContext = new DefaultHttpContext
            {
                RequestServices = _serviceProvider
            };

            return new ActionContext(httpContext, new RouteData(), new ActionDescriptor());
        }

        private static string NormalizeTemplateName(string templateName)
        {
            var normalized = templateName.Replace('\\', '/').TrimStart('~');

            if (normalized.StartsWith("/"))
            {
                return normalized.EndsWith(".cshtml", StringComparison.OrdinalIgnoreCase)
                    ? normalized
                    : $"{normalized}.cshtml";
            }

            if (!normalized.Contains('/'))
            {
                normalized = $"Shared/{normalized}";
            }

            return normalized.EndsWith(".cshtml", StringComparison.OrdinalIgnoreCase)
                ? $"/Views/{normalized}"
                : $"/Views/{normalized}.cshtml";
        }
    }
}