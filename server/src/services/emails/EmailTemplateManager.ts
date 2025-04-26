import fs from 'fs';
import path from 'path';
import { compile } from 'handlebars';

export class EmailTemplateManager {
  private static cache: Map<string, HandlebarsTemplateDelegate> = new Map();

  public static compileTemplate(category: string, templateName: string, variables: any): string {
    const cacheKey = `${category}/${templateName}`;
    
    if (!this.cache.has(cacheKey)) {
      const filePath = path.join(__dirname, 'templates', category, `${templateName}.hbs`);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const compiled = compile(fileContent);
      this.cache.set(cacheKey, compiled);
    }

    const template = this.cache.get(cacheKey)!;
    return template(variables);
  }
}
