using System.Text.Json;
using System.Text;
using System;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.IO;

namespace WebApplication1
{
    public class WeatherForecast
    {
        public DateOnly Date { get; set; }

        public int TemperatureC { get; set; }

        public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);

        public string? Summary { get; set; }
    }


public class PageStructure
{
    public string Name { get; set; }
    public PageMetadata Metadata { get; set; }
    public PageContent Content { get; set; }
}

public class PageMetadata
{
    public string Title { get; set; }
}

public class PageContent
{
    public Row[] Rows { get; set; }
}

public class Row
{
    public string Id { get; set; }
    public Dictionary<string, string> Styles { get; set; }
    public Dictionary<string, string> Attributes { get; set; }
    public Column[] Columns { get; set; }
}

public class Column
{
    public string Id { get; set; }
    public string Type { get; set; }
    public Dictionary<string, string> Styles { get; set; }
    public Dictionary<string, string> Attributes { get; set; }
    public Block[] Content { get; set; }
}

public class Block
{
    public string Id { get; set; }
    public string Blocktype { get; set; }
    public Dictionary<string, string> Styles { get; set; }
    public Dictionary<string, string> Attributes { get; set; }
    public string InnerHtmlOrText { get; set; }
}

public class JsonToHtmlConverter
{
    public static string Convert(string jsonFilePath)
    {
        //var jsonContent = File.ReadAllText(jsonFilePath);
        var pageStructure = JsonSerializer.Deserialize<PageStructure>(jsonFilePath);
        
        var html = new StringBuilder();
        
        // Add HTML header with Bootstrap
        html.AppendLine("<!DOCTYPE html>");
        html.AppendLine("<html lang=\"en\">");
        html.AppendLine("<head>");
        html.AppendLine("    <meta charset=\"UTF-8\">");
        html.AppendLine("    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
   //     html.AppendLine($"    <title>{pageStructure.Metadata.Title}</title>");
        html.AppendLine("    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css\" rel=\"stylesheet\">");
        html.AppendLine("</head>");
        html.AppendLine("<body>");
        html.AppendLine("<div class=\"container\">");

        // Convert rows and columns
        foreach (var row in pageStructure.Content.Rows)
        {
            html.AppendLine("    <div class=\"row my-4\">");
            
            foreach (var column in row.Columns)
            {
                // Convert our col-X to Bootstrap's col-X
                var bootstrapColClass = column.Type.Replace("col-", "col-md-");
                html.AppendLine($"        <div class=\"{bootstrapColClass}\">");
                
                foreach (var block in column.Content)
                {
                    var blockHtml = RenderBlock(block);
                    html.AppendLine($"            {blockHtml}");
                }
                
                html.AppendLine("        </div>");
            }
            
            html.AppendLine("    </div>");
        }

        // Close containers and add Bootstrap JS
        html.AppendLine("</div>");
        html.AppendLine("<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js\"></script>");
        html.AppendLine("</body>");
        html.AppendLine("</html>");

        return html.ToString();
    }
        public static string Convert(PageStructure pageStructure)
    {
        //var jsonContent = File.ReadAllText(jsonFilePath);
        //var pageStructure = JsonSerializer.Deserialize<PageStructure>(jsonFilePath);
        
        var html = new StringBuilder();
        
        // Add HTML header with Bootstrap
        html.AppendLine("<!DOCTYPE html>");
        html.AppendLine("<html lang=\"en\">");
        html.AppendLine("<head>");
        html.AppendLine("    <meta charset=\"UTF-8\">");
        html.AppendLine("    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
   //     html.AppendLine($"    <title>{pageStructure.Metadata.Title}</title>");
        html.AppendLine("    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css\" rel=\"stylesheet\">");
        html.AppendLine("</head>");
        html.AppendLine("<body>");
        html.AppendLine("<div class=\"container\">");

        // Convert rows and columns
        foreach (var row in pageStructure.Content.Rows)
        {
            html.AppendLine("    <div class=\"row my-4\">");
            
            foreach (var column in row.Columns)
            {
                // Convert our col-X to Bootstrap's col-X
                var bootstrapColClass = column.Type.Replace("col-", "col-md-");
                html.AppendLine($"        <div class=\"{bootstrapColClass}\">");
                
                foreach (var block in column.Content)
                {
                    var blockHtml = RenderBlock(block);
                    html.AppendLine($"            {blockHtml}");
                }
                
                html.AppendLine("        </div>");
            }
            
            html.AppendLine("    </div>");
        }

        // Close containers and add Bootstrap JS
        html.AppendLine("</div>");
        html.AppendLine("<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js\"></script>");
        html.AppendLine("</body>");
        html.AppendLine("</html>");

        return html.ToString();
    }
    private static string RenderBlock(Block block)
    {
        var styleAttr = GetStyleAttribute(block.Styles);
        
        switch (block.Blocktype.ToLower())
        {
            case "text":
                return $"<div class=\"content-block\" {styleAttr}>{block.InnerHtmlOrText}</div>";
                
            case "image":
                return $"<div class=\"content-block\" {styleAttr}><img src=\"{block.InnerHtmlOrText}\" class=\"img-fluid\" alt=\"Content image\"></div>";
                
            default:
                return $"<div class=\"content-block\" {styleAttr}>{block.InnerHtmlOrText}</div>";
        }
    }

    private static string GetStyleAttribute(Dictionary<string, string> styles)
    {
        if (styles == null || !styles.Any())
            return string.Empty;

        var styleStr = string.Join(";", styles.Select(s => $"{s.Key}:{s.Value}"));
        return $"style=\"{styleStr}\"";
    }

    //public static void Main(string[] args)
    //{
    //    if (args.Length == 0)
    //    {
    //        Console.WriteLine("Please provide the path to the JSON file as an argument.");
    //        return;
    //    }

    //    var jsonFilePath = args[0];
    //    var outputPath = Path.ChangeExtension(jsonFilePath, "html");

    //    try
    //    {
    //        var html = Convert(jsonFilePath);
    //        File.WriteAllText(outputPath, html);
    //        Console.WriteLine($"HTML file generated successfully: {outputPath}");
    //    }
    //    catch (Exception ex)
    //    {
    //        Console.WriteLine($"Error: {ex.Message}");
    //    }
    }
}
