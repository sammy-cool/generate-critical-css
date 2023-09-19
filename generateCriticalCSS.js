import { generate } from 'critical';
import { writeFileSync } from 'fs';
import csso from 'csso';
import readline from 'readline';

const generateCriticalCSS = async (url, outputPath) => {
  try {
    const { css } = await generate({
      inline: false,
      src: url,
      width: 1200,
      height: 900,
    });

    const optimizedCSS = await csso.minify(css, {
      restructure: true,
      comments: false,
      forceMediaMerge: true,
      forcePropertiesSorting: true,
      compatibility: 'ie9',
    });

    const minifiedCSS = await csso.minify(optimizedCSS.css);

    writeFileSync(outputPath, minifiedCSS.css);
    console.log(`Critical CSS generated and saved to ${outputPath}`);
  } catch (error) {
    console.error('Error generating critical CSS:', error);
  }

  process.exit();
};

const url = process.argv[2];
const outputPath = 'critical.css';

if (url) {
  generateCriticalCSS(url, outputPath);
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter the complete URL "example: https://www.example.com" ', (userInput) => {
    rl.close();
    generateCriticalCSS(userInput, outputPath);
  });
}