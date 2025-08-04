import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
}

async function createDirectory(dirPath) {
  try {
    await fs.mkdir(path.join(__dirname, dirPath), { recursive: true })
    console.log(`${colors.green}✓${colors.reset} Créé: ${dirPath}`)
  } catch (error) {
    console.error(`${colors.red}✗${colors.reset} Erreur: ${dirPath}`, error.message)
  }
}

async function createFile(filePath, content = '') {
  try {
    const fullPath = path.join(__dirname, filePath)
    await fs.mkdir(path.dirname(fullPath), { recursive: true })
    await fs.writeFile(fullPath, content)
    console.log(`${colors.green}✓${colors.reset} Créé: ${filePath}`)
  } catch (error) {
    console.error(`${colors.red}✗${colors.reset} Erreur: ${filePath}`, error.message)
  }
}

async function setup() {
  console.log(`\n${colors.blue}🚀 Configuration de ComfyCMS...${colors.reset}\n`)

  // Créer la structure de dossiers
  const directories = [
    // Public
    'public/css/components',
    'public/css/themes',
    'public/js/core',
    'public/js/components',
    'public/js/utils',
    'public/js/lib',
    'public/assets/uploads',
    'public/assets/fonts',
    'public/assets/icons',
    'public/assets/ui',

    // Templates
    'templates/restaurant-moderne',
    'templates/portfolio-creatif',
    'templates/business-corporate',
    'templates/landing-page',

    // Sections
    'sections/headers/header-classic',
    'sections/headers/header-modern',
    'sections/headers/header-minimal',
    'sections/heroes/hero-video',
    'sections/heroes/hero-image',
    'sections/heroes/hero-slider',
    'sections/features/features-grid',
    'sections/features/features-list',
    'sections/galleries/gallery-grid',
    'sections/galleries/gallery-masonry',
    'sections/testimonials/testimonials-slider',
    'sections/testimonials/testimonials-grid',
    'sections/pricing/pricing-table',
    'sections/pricing/pricing-cards',
    'sections/contacts/contact-form',
    'sections/contacts/contact-map',
    'sections/footers/footer-simple',
    'sections/footers/footer-extended',

    // Data
    'data/clients',
    'data/projects',
    'data/exports',

    // Autres
    'palettes',
    'plugins',
    'docs',
    'tests/unit',
    'tests/integration',
    'tests/e2e'
  ]

  for (const dir of directories) {
    await createDirectory(dir)
  }

  // Créer les fichiers .gitkeep
  const gitkeepFiles = [
    'data/clients/.gitkeep',
    'data/projects/.gitkeep',
    'data/exports/.gitkeep',
    'public/assets/uploads/.gitkeep'
  ]

  for (const file of gitkeepFiles) {
    await createFile(file, '')
  }

  // Créer un fichier de palettes par défaut
  const palettesContent = JSON.stringify({
    sobres: [
      {
        name: "Élégance Noir",
        primary: "#000000",
        secondary: "#333333",
        accent: "#666666",
        background: "#FFFFFF",
        text: "#000000"
      },
      {
        name: "Minimal Gris",
        primary: "#2c3e50",
        secondary: "#7f8c8d",
        accent: "#bdc3c7",
        background: "#ecf0f1",
        text: "#2c3e50"
      },
      {
        name: "Pro Bleu",
        primary: "#0D47A1",
        secondary: "#1976D2",
        accent: "#42A5F5",
        background: "#FAFAFA",
        text: "#212121"
      }
    ],
    vives: [
      {
        name: "Tropical Paradise",
        primary: "#FF6B6B",
        secondary: "#4ECDC4",
        accent: "#FFE66D",
        background: "#F7FFF7",
        text: "#2D3436"
      },
      {
        name: "Sunset Vibes",
        primary: "#FF4757",
        secondary: "#FF6348",
        accent: "#FFA502",
        background: "#FFF5F5",
        text: "#2C2C2C"
      },
      {
        name: "Ocean Dream",
        primary: "#00B8D4",
        secondary: "#00ACC1",
        accent: "#0097A7",
        background: "#E0F7FA",
        text: "#004D40"
      }
    ]
  }, null, 2)

  await createFile('palettes/default.json', palettesContent)

  // Créer un template d'exemple minimal
  const templateHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon Site</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header class="header">
        <h1 class="logo editable">Mon Logo</h1>
        <nav class="nav">
            <a href="#home">Accueil</a>
            <a href="#about">À propos</a>
            <a href="#contact">Contact</a>
        </nav>
    </header>
    
    <section class="hero">
        <h2 class="hero-title editable">Bienvenue sur mon site</h2>
        <p class="hero-text editable">Créé avec ComfyCMS en quelques minutes</p>
        <button class="cta-button editable">Commencer</button>
    </section>
    
    <footer class="footer">
        <p class="editable">&copy; 2024 Mon Site. Tous droits réservés.</p>
    </footer>
</body>
</html>`

  const templateCSS = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #333;
    line-height: 1.6;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: #fff;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
}

.nav {
    display: flex;
    gap: 2rem;
}

.nav a {
    text-decoration: none;
    color: #333;
    transition: color 0.3s;
}

.nav a:hover {
    color: #007bff;
}

.hero {
    text-align: center;
    padding: 5rem 2rem;
    background: #f8f9fa;
}

.hero-title {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.hero-text {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    color: #666;
}

.cta-button {
    background: #007bff;
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
}

.cta-button:hover {
    background: #0056b3;
}

.footer {
    text-align: center;
    padding: 2rem;
    background: #333;
    color: white;
}`

  const templateConfig = {
    id: "template-starter",
    name: "Template Starter",
    version: "1.0.0",
    category: "basic",
    author: "ComfyCMS",
    description: "Template de base pour démarrer rapidement"
  }

  await createFile('templates/template-starter/index.html', templateHTML)
  await createFile('templates/template-starter/style.css', templateCSS)
  await createFile('templates/template-starter/config.json', JSON.stringify(templateConfig, null, 2))

  console.log(`\n${colors.green}✅ Configuration terminée!${colors.reset}`)
  console.log(`\n${colors.yellow}Prochaines étapes:${colors.reset}`)
  console.log('1. Assurez-vous que le fichier index.html est dans public/')
  console.log('2. Lancez: npm run dev')
  console.log('3. Dans un autre terminal: npm run server')
  console.log(`\n${colors.blue}Bon développement avec ComfyCMS! 🚀${colors.reset}\n`)
}

// Lancer le setup
setup().catch(console.error)