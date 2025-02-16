import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

export function registerRoutes(app: Express): Server {
  app.post('/api/preview', async (req, res) => {
    try {
      const { json } = req.body;

      // Create a temporary JSON file
      const tempJsonPath = path.join(process.cwd(), 'temp.json');
      fs.writeFileSync(tempJsonPath, json);

      // Execute the C# converter
      exec(`dotnet run JsonToHtml.cs ${tempJsonPath}`, (error, stdout, stderr) => {
        if (error) {
          console.error('Error executing C# converter:', error);
          res.status(500).send('Error generating HTML preview');
          return;
        }

        // Read the generated HTML file
        const htmlPath = tempJsonPath.replace('.json', '.html');
        const html = fs.readFileSync(htmlPath, 'utf-8');

        // Clean up temporary files
        fs.unlinkSync(tempJsonPath);
        fs.unlinkSync(htmlPath);

        res.send(html);
      });
    } catch (error) {
      console.error('Error in preview endpoint:', error);
      res.status(500).send('Error generating preview');
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}