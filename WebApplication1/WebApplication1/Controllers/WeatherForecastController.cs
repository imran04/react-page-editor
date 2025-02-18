using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly IMemoryCache _memoryCache;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IMemoryCache memoryCache)
        {
            _logger = logger;
            _memoryCache = memoryCache;
        }

        //[HttpGet(Name = "GetWeatherForecast")]
        //public IEnumerable<WeatherForecast> Get()
        //{
        //    return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        //    {
        //        Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
        //        TemperatureC = Random.Shared.Next(-20, 55),
        //        Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        //    })
        //    .ToArray();
        //}

        [HttpPost(Name = "Gethtml")]
        public IActionResult GetHtml(PageStructure j)
        { var id ="1234567890";
            _memoryCache.Set(id, JsonToHtmlConverter.Convert(j));
            return Ok(id);
        }


        [HttpGet,Route("html/{id}")]
        public IActionResult GetJson(string id)
        {
            
           var html= _memoryCache.Get(id) as string;
            return Content(html,"text/html");
        }
    }

    public record jsonTypeRequest(string? json);
}
